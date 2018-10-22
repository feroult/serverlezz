#!/bin/bash -xe

gcloud compute ssh \
    --zone=southamerica-east1-a \
    --ssh-flag="-f" \
    --ssh-flag="-N" \
    --ssh-flag="-L" \
    --ssh-flag="8123:localhost:8123" \
    "data-proc-fest-m"

