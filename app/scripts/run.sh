#!/bin/bash

# This script runs the app script with the correct arguments
# This allows users to conveniently use the command "./scripts/run.sh" to run the app
# See framework/app/index.js which does the same thing
appScript="FrameworkApp.js"

# Change directories to the script path
cd ${0%/*}

# Change directories to the app path
cd ../

# Run the app
node \
  --no-warnings \
  --experimental-loader \
  ./../globals/node/ModuleLoader.js \
  $appScript \
  $*
