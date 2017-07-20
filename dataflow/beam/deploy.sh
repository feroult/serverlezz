#!/bin/sh

read -d '' CMD << EOF
    java -jar build/libs/beam-all-1.0.jar
         --project=beam-test-app
         --sinkProject=beam-test-app
         --bigQueryTable=beam-test-app:test.messages
         --zone=us-east1-c
         --streaming
         --stagingLocation=gs://beam-test-app/staging
         --runner=DataflowRunner
         --numWorkers=1 --maxNumWorkers=3
EOF

if [ -z "$1" ]; then
    echo "Deploying new pipeline..."
    eval $CMD
else
    echo "Updating existing pipeline: $1..."
    eval $CMD --update --jobName=$1
fi


