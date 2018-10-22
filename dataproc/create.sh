#!/bin/bash

gcloud dataproc clusters create data-proc-fest \
    --bucket data-proc-fest \
    --num-workers 2 \
    --initialization-actions gs://data-proc-fest/scripts/init.sh
