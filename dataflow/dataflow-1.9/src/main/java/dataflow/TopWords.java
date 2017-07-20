package dataflow;

import com.google.api.services.bigquery.model.TableRow;
import com.google.cloud.dataflow.sdk.Pipeline;
import com.google.cloud.dataflow.sdk.coders.TableRowJsonCoder;
import com.google.cloud.dataflow.sdk.io.PubsubIO;
import com.google.cloud.dataflow.sdk.options.PipelineOptionsFactory;
import com.google.cloud.dataflow.sdk.transforms.*;
import com.google.cloud.dataflow.sdk.transforms.windowing.FixedWindows;
import com.google.cloud.dataflow.sdk.transforms.windowing.Window;
import com.google.cloud.dataflow.sdk.values.KV;
import com.google.cloud.dataflow.sdk.values.TypeDescriptor;
import dataflow.utils.CustomPipelineOptions;
import org.joda.time.Duration;

public class TopWords {

    private static class ExtractWords extends DoFn<String, String> {

        @Override
        public void processElement(ProcessContext c) throws Exception {
            for (String word : c.element().split("[^a-zA-Z']+")) {
                if (!word.isEmpty()) {
                    c.output(word);
                }
            }
        }
    }

    private static class Formatter extends SimpleFunction<KV<String, Long>, TableRow> {
        @Override
        public TableRow apply(KV<String, Long> element) {
            TableRow r = new TableRow();
            r.set("word", element.getKey());
            r.set("count", element.getValue());
            return r;
        }
    }

    public static void main(String[] args) {
        CustomPipelineOptions options =
                PipelineOptionsFactory.fromArgs(args).withValidation().as(CustomPipelineOptions.class);
        Pipeline p = Pipeline.create(options);

        p.apply(PubsubIO.Read.named("read from PubSub")
                .topic(String.format("projects/%s/topics/%s", options.getSourceProject(), options.getSourceTopic()))
                .withCoder(TableRowJsonCoder.of()))

                .apply("window 10s", Window.into(FixedWindows.of(Duration.standardSeconds(10))))
                .apply("extract text", MapElements.via((TableRow row) -> row.get("text").toString()).withOutputType(TypeDescriptor.of(String.class)))
                .apply(ParDo.named("ExtractWords").of(new ExtractWords()))
                .apply(Count.perElement())
                .apply(MapElements.via(new Formatter()))
                .apply(PubsubIO.Write.named("WriteToPubsub")
                        .topic(String.format("projects/%s/topics/%s", options.getSinkProject(), options.getSinkTopic()))
                        .withCoder(TableRowJsonCoder.of()));

        p.run();
    }
}
