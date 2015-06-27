#!/bin/bash
BASEDIR=$(dirname $0)
node --harmony $BASEDIR/../tests/Test.js "$@"