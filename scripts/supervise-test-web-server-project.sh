#!/bin/bash

# Remove any instances of ./ from the script invocation path
scriptInvocationPath=`echo $0 | sed 's/.\///'`
#echo "scriptInvocationPath $scriptInvocationPath"

# Change path separators from \ to / on Windows
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

# The path to the project from the scripts directory
projectFile="$scriptDirectory../tests/projects/web-server/Project.js"
#echo "projectFile $projectFile"

# The path to the process manager from the scripts directory
processManagerFile="$scriptDirectory../modules/process-manager/ProcessManager.js"
#echo "processManagerFile $processManagerFile"

# Run the script
node --harmony "$processManagerFile" --harmony --extensions js,json "$projectFile" $@