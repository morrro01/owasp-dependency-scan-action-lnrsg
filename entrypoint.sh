#!/bin/bash
set -e

#
# Inputs
#
IN_GITHUB_TOKEN=$1
IN_PROJECT=$2
IN_PATH=$3
IN_FORMAT=$4
IN_SCAN_ARGS=$5

#
# Variables
#
VAR_SCAN_OUT="/github/workspace/reports"

#
# Run dependency check.
#
/usr/share/dependency-check/bin/dependency-check.sh \
    --project ${IN_PROJECT} \
    --scan ${IN_PATH} \
    --format ${IN_FORMAT} \
    --out ${VAR_SCAN_OUT} \
    --noupdate \
    ${IN_SCAN_ARGS}

