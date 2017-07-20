package io.github.feroult.beam.models;

import com.google.api.services.bigquery.model.TableFieldSchema;
import com.google.api.services.bigquery.model.TableSchema;

import java.util.ArrayList;
import java.util.List;

public class SchemaFor {

    public static TableSchema message() {
        List<TableFieldSchema> fields = new ArrayList<>();
        fields.add(new TableFieldSchema().setName("message").setType("STRING").setMode("REQUIRED"));
        TableSchema schema = new TableSchema().setFields(fields);
        return schema;
    }

}