#!/bin/bash -xe

gcloud dataproc clusters create data-fest-demo \
    --zone=us-east1-b \
    --bucket data-fest-proc \
    --num-workers 3 \
    --initialization-actions gs://data-fest-proc/scripts/init.sh
