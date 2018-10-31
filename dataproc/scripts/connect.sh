#!/bin/bash -xe

gcloud compute ssh \
    --zone=us-east1-b \
    --ssh-flag="-f" \
    --ssh-flag="-N" \
    --ssh-flag="-L" \
    --ssh-flag="8123:localhost:8123" \
    "data-fest-demo-m"

