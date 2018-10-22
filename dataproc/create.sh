#!/bin/bash -xe

gcloud dataproc clusters create data-fest-demo \
    --zone=southamerica-east1-a \
    --bucket data-proc-fest \
    --num-workers 2 \
    --initialization-actions gs://data-proc-fest/scripts/init.sh
