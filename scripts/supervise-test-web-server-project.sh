#!/bin/bash

# Get the directory of the script
scriptInvocationBasename=`basename $0`
if [ "`echo $0 | cut -c1`" = "/" ]; then
	scriptPath=`dirname $0`
else
	scriptPath=`pwd`/`echo $0 | sed -e s/$scriptInvocationBasename//`
fi
scriptDirectory=$(echo $scriptPath | sed -e 's/\\/\//g')
scriptDirectory=`dirname "$scriptDirectory"`
scriptDirectoryWithEscapedSpaces=$(echo $scriptDirectory | sed 's/ /\\ /g' )
#echo $scriptDirectory

# Run the script
processManagerArgument="--harmony '$scriptDirectory/../tests/projects/web-server/Project.js'"
#echo $processManagerArgument
#echo "$scriptDirectory/../ProcessManager.js" $processManagerArgument
node "$scriptDirectory/../ProcessManager.js" $processManagerArgument