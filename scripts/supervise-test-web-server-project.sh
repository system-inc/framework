#!/bin/bash

# Remove any instances of ./ from the script invocation path
scriptInvocationPath=`echo $0 | sed 's/.\///'`
#echo "scriptInvocationPath $scriptInvocationPath"

# Change path separators from \ to / for Windows
scriptInvocationPath=$(echo $scriptInvocationPath | sed -e 's/\\/\//g')
#echo "scriptInvocationPath $scriptInvocationPath"

# Get the script file name with extension
scriptInvocationBasename=`basename $scriptInvocationPath`
#echo "scriptInvocationBasename $scriptInvocationBasename"

# Get the working directory
workingDirectory=`pwd`
#echo "workingDirectory $workingDirectory"

# Build the script directory
scriptDirectory=$workingDirectory/`echo $scriptInvocationPath | sed -e s/$scriptInvocationBasename//`
#echo "scriptDirectory $scriptDirectory"

# The path to the test web server project from the scripts directory
testWebServerProjectFile="$scriptDirectory../tests/projects/web-server/Project.js"
#echo "testWebServerProjectFile $testWebServerProjectFile"

# The path to the test project from the scripts directory
processManagerFile="$scriptDirectory../ProcessManager.js"
#echo "processManagerFile $processManagerFile"

# Run the script
node --harmony "$processManagerFile" --harmony "$testWebServerProjectFile" $@