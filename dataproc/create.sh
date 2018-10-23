#!/bin/bash -xe

gcloud dataproc clusters create data-fest-demo \
    --zone=us-east1 \
    --bucket data-proc-fest \
    --num-workers 2 \
    --initialization-actions gs://data-proc-fest/scripts/init.sh
