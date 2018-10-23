#!/bin/bash -xe

gcloud dataproc clusters create data-fest-demo \
    --zone=us-east1 \
    --bucket data-fest-proc \
    --num-workers 2 \
    --initialization-actions gs://data-fest-proc/scripts/init.sh
