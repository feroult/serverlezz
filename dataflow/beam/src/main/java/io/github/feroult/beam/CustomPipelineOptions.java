/*
 * Copyright (C) 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

package io.github.feroult.beam;

import org.apache.beam.runners.dataflow.options.DataflowPipelineOptions;
import org.apache.beam.sdk.options.Default;
import org.apache.beam.sdk.options.Validation;

public interface CustomPipelineOptions extends DataflowPipelineOptions {
    @Default.String("beam-test-app")
    @Validation.Required
    String getSourceProject();

    void setSourceProject(String value);

    @Default.String("events")
    @Validation.Required
    String getSourceTopic();

    void setSourceTopic(String value);

    @Default.String("beam-test-app")
    @Validation.Required
    String getSinkProject();

    void setSinkProject(String value);

    @Default.String("visualizer")
    @Validation.Required
    String getSinkTopic();

    void setSinkTopic(String value);

    @Default.String("beam-test-app:test.messages")
    @Validation.Required
    String getBigQueryTable();

    void setBigQueryTable(String value);
}
