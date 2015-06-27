#!/bin/bash
BASEDIR=$(dirname $0)
node $BASEDIR/../ProcessManager.js --harmony --extensions node,js,json --watch $BASEDIR/../../framework $BASEDIR/../tests/projects/web-server/Project.js