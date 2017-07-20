package io.github.feroult.beam.fns;

import com.google.api.services.bigquery.model.TableRow;
import org.apache.beam.sdk.transforms.DoFn;

public class MessageToTableRowFn extends DoFn<String, TableRow> {

    private String topic;

    @ProcessElement
    public void processElement(ProcessContext c) throws Exception {
        String message = c.element();

        TableRow row = new TableRow();
        row.set("message", message);

        c.output(row);
    }

}
