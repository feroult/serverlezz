package io.github.feroult.beam;

import com.google.api.services.bigquery.model.TableRow;
import io.github.feroult.beam.fns.MessageToTableRowFn;
import io.github.feroult.beam.models.SchemaFor;
import org.apache.beam.sdk.Pipeline;
import org.apache.beam.sdk.coders.AvroCoder;
import org.apache.beam.sdk.coders.CoderRegistry;
import org.apache.beam.sdk.coders.SerializableCoder;
import org.apache.beam.sdk.io.gcp.bigquery.BigQueryIO;
import org.apache.beam.sdk.io.gcp.bigquery.TableDestination;
import org.apache.beam.sdk.io.gcp.bigquery.TableRowJsonCoder;
import org.apache.beam.sdk.io.gcp.pubsub.PubsubIO;
import org.apache.beam.sdk.options.PipelineOptionsFactory;
import org.apache.beam.sdk.transforms.ParDo;
import org.apache.beam.sdk.transforms.windowing.FixedWindows;
import org.apache.beam.sdk.transforms.windowing.Window;
import org.apache.beam.sdk.values.PCollection;
import org.joda.time.Duration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TestPipeline {
    private static final Logger LOG = LoggerFactory.getLogger(TestPipeline.class);

    public static void main(String[] args) {
        CustomPipelineOptions options =
                PipelineOptionsFactory.fromArgs(args).withValidation().as(CustomPipelineOptions.class);

        Pipeline pipeline = createPipeline(options);

        PCollection<String> messages = createInput(pipeline, options);
        createBackupFeed(messages, options);

        pipeline.run();
    }

    private static Pipeline createPipeline(CustomPipelineOptions options) {
        Pipeline p = Pipeline.create(options);
        CoderRegistry registry = p.getCoderRegistry();
        registry.registerCoderProvider(AvroCoder.getCoderProvider());
        registry.registerCoderForClass(TableDestination.class, SerializableCoder.of(TableDestination.class));
        registry.registerCoderForClass(TableRow.class, TableRowJsonCoder.of());
        return p;
    }

    private static void createBackupFeed(PCollection<String> messages, CustomPipelineOptions options) {
        messages
                .apply("window (BigQuery)",
                        Window.into(FixedWindows.of(Duration.standardMinutes(1))))

                .apply("create table row", ParDo.of(new MessageToTableRowFn()))
                .apply("write to BigQuery", BigQueryIO.writeTableRows()
                        .to(options.getBigQueryTable())
                        .withSchema(SchemaFor.message())
                        .withWriteDisposition(BigQueryIO.Write.WriteDisposition.WRITE_APPEND)
                        .withCreateDisposition(BigQueryIO.Write.CreateDisposition.CREATE_IF_NEEDED));

    }

    private static PCollection<String> createInput(Pipeline pipeline, CustomPipelineOptions options) {
        return pipeline
                .apply("from PubSub", PubsubIO.readStrings()
                        .fromTopic(sourceTopic(options))
                        .withTimestampAttribute("timestamp"));
    }

    private static String sourceTopic(CustomPipelineOptions options) {
        return String.format("projects/%s/topics/%s", options.getSourceProject(), options.getSourceTopic());
    }

}
