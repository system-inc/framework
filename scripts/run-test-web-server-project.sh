#!/bin/bash

# Get the script file name with extension
scriptInvocationBasename=`basename $0`
#echo "scriptInvocationBasename $scriptInvocationBasename"

# Get the directory of the script
if [ "`echo $0 | cut -c1`" = "/" ]; then
	#echo "if"

	scriptDirectory=`dirname $0`
	#echo "scriptDirectory $scriptDirectory"
else
	#echo "else $0"

	# Remove any instances of ./ from the script invocation path
	scriptInvocationPath=`echo $0 | sed 's/.\///'`
	#echo "scriptInvocationPath $scriptInvocationPath"
	
	# Build the script directory
	scriptDirectory=`pwd`/`echo $scriptInvocationPath | sed -e s/$scriptInvocationBasename//`
	#echo "scriptDirectory $scriptDirectory"
fi

#echo "scriptDirectory $scriptDirectory"

# Change path separators from \ to / for Windows
scriptDirectory=$(echo $scriptDirectory | sed -e 's/\\/\//g')
#echo "scriptDirectory $scriptDirectory"

# The path to the test web server project from the scripts directory
testWebServerProjectFile="$scriptDirectory../tests/projects/web-server/Project.js"
#echo "testWebServerProjectFile $testWebServerProjectFile"

# Run the script
command="node --harmony $testWebServerProjectFile $@"
#echo "command $command"
$command