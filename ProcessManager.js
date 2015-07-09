var NodeProcess = process;
var NodeVersion = NodeProcess.version.split('.');
var NodeFileSystem = require('fs');
var NodePath = require('path');
var NodeChildProcessSpawn = require('child_process').spawn;

var ProcessManager = function() {
}

ProcessManager.settings = {};
ProcessManager.program = null;
ProcessManager.programExtension = null;
ProcessManager.settings.watch = null;
ProcessManager.settings.watching = {};
ProcessManager.settings.ignore = null;
ProcessManager.settings.ignoring = {};
ProcessManager.settings.pollInterval = null;
ProcessManager.settings.extensions = null;
ProcessManager.settings.debug = false;
ProcessManager.settings.debugBreakFlag = null;
ProcessManager.settings.debugBreakFlagArgument = null;
ProcessManager.settings.noRestartOn = null;
ProcessManager.settings.forceWatch = false;
ProcessManager.settings.verbose = false;
ProcessManager.settings.harmony = false;

ProcessManager.startChildProcess = null;
ProcessManager.fileExtensionPattern = null;
ProcessManager.crashQueued = false;
ProcessManager.isWindowsWithoutWatchFile = NodeProcess.platform === 'win32' && parseInt(NodeVersion[1]) <= 6;
ProcessManager.argumentsArray = NodeProcess.argv.slice(1);
ProcessManager.log = console.log;

ProcessManager.help = function() {
    console.log('');
    console.log('Usage:');
    console.log('    ProcessManager.js [options] <program>');
    console.log('    ProcessManager.js [options] -- <program> [args ...]');
    console.log('');
    console.log('Required:');
    console.log('    <program>');
    console.log('        The program to run.');
    console.log('');
    console.log('Options:');
    console.log('    -w|--watch <watchItems>');
    console.log('        A comma-delimited list of folders or js files to watch for changes.');
    console.log('        When a change to a js file occurs, reload the program');
    console.log('        Default is \'.\'');
    console.log('');
    console.log('    -i|--ignore <ignoreItems>');
    console.log('        A comma-delimited list of folders to ignore for changes.');
    console.log('        No default');
    console.log('');
    console.log('    -p|--poll-interval <milliseconds>');
    console.log('        How often to poll watched files for changes.');
    console.log('        Defaults to Node default.');
    console.log('');
    console.log('    -e|--extensions <extensions>');
    console.log('        Specific file extensions to watch in addition to defaults.');
    console.log('        Used when --watch option includes folders');
    console.log('        Default is \'node,js\'');
    console.log('');
    console.log('    -x|--exec <executable>');
    console.log('        The executable that runs the specified program.');
    console.log('        Default is \'node\'');
    console.log('');
    console.log('    --debug');
    console.log('        Start node with --debug flag.');
    console.log('');
    console.log('    --debug-brk[=port]');
    console.log('        Start node with --debug-brk[=port] flag.');
    console.log('');
    console.log('    --harmony');
    console.log('        Start node with --harmony flag.');
    console.log('');
    console.log('    -n|--no-restart-on error|exit');
    console.log('        Don\'t automatically restart the supervised program if it ends.');
    console.log('        Supervisor will wait for a change in the source files.');
    console.log('        If \'error\', an exit code of 0 will still restart.');
    console.log('        If \'exit\', no restart regardless of exit code.');
    console.log('');
    console.log('    --force-watch');
    console.log('        Use fs.watch instead of fs.watchFile.');
    console.log('        This may be useful if you see a high cpu load on a windows machine.');
    console.log('');
    console.log('    -h|--help|-?');
    console.log('        Display these usage instructions.');
    console.log('');
    console.log('    -q|--quiet');
    console.log('        Suppress debug messages');
    console.log('');
    console.log('    -V|--verbose');
    console.log('        Show extra debug messages');
    console.log('');
};

ProcessManager.crash = function() {
    if(ProcessManager.crashQueued) {
        return;
    }

    ProcessManager.crashQueued = true;
    var nodeChildProcess = exports.child;

    setTimeout(function() {
        if(nodeChildProcess) {
            ProcessManager.log("\n"+'Process Manager: Crashing child process...'+"\n");
            NodeProcess.kill(nodeChildProcess.pid);
        }
        else {
            ProcessManager.log("\n"+'Process Manager: Restarting child process...'+"\n");
            ProcessManager.startChildProcess();
        }
    }, 50);
}

ProcessManager.crashOnWindows = function(event, fileName) {
    var shouldCrash = true;
    if(event === 'change') {
        if(fileName) {
            fileName = NodePath.resolve(fileName);
            Object.keys(ProcessManager.settings.ignoring).forEach(function(ignoredPath) {
                if(fileName.indexOf(ignoredPath+'\\') === 0 || fileName === ignoredPath) {
                    shouldCrash = false;
                }
            });
        }

        if(shouldCrash) {
            ProcessManager.crash();
        }
    }
}

ProcessManager.crashOnNonWindowsOperatingSystem = function(oldStatus, newStatus) {
    // We only care about modification time, not access time
    if(newStatus.mtime.getTime() !== oldStatus.mtime.getTime()) {
        ProcessManager.crash();
    }
}

ProcessManager.watchFile = function(file, pollInterval) {
    if(ProcessManager.isWindowsWithoutWatchFile || ProcessManager.settings.forceWatch) {
        NodeFileSystem.watch(
            file,
            {
                persistent: true,
                interval: pollInterval
            },
            ProcessManager.crashOnWindows
        );
    }
    else {
        NodeFileSystem.watchFile(
            file,
            {
                persistent: true,
                interval: pollInterval
            },
            ProcessManager.crashOnNonWindowsOperatingSystem
        );
    }

    if(ProcessManager.settings.verbose) {
        ProcessManager.log('Watching file "'+file+'".');
    }
}

ProcessManager.findFilesToWatch = function(directory, callback) {
    directory = NodePath.resolve(directory);

    if(ProcessManager.settings.ignoring[directory]) {
        return;
    }

    NodeFileSystem.stat(directory, function(error, status) {
        if(error) {
            console.error('Process Manager: Error retrieving status for: '+directory);
        }
        else {
            if(status.isDirectory()) {
                if(ProcessManager.isWindowsWithoutWatchFile || ProcessManager.settings.forceWatch) {
                    callback(directory);
                }

                NodeFileSystem.readdir(directory, function(error, fileNames) {
                    if(error) {
                        console.error('Process Manager: Error reading path: '+directory);
                    }
                    else {
                        fileNames.forEach(function(fileName) {
                            ProcessManager.findFilesToWatch(NodePath.join(directory, fileName), callback);
                        });
                    }
                });
            }
            else {
                if((!ProcessManager.isWindowsWithoutWatchFile || !ProcessManager.settings.forceWatch) && directory.match(ProcessManager.fileExtensionPattern)) {
                    callback(directory);
                }
            }
        }
    });
}

ProcessManager.startProgram = function(program, executor) {
    ProcessManager.log('Process Manager: Starting child process with "'+executor+' '+program.join(' ')+'".');

    ProcessManager.crashQueued = false;

    // Spawn the child process
    var nodeChildProcess = exports.child = NodeChildProcessSpawn(executor, program, {
        stdio: 'inherit',
    });
    
    if(nodeChildProcess.stdout) {
        // node < 0.8 doesn't understand the 'inherit' option, so pass through manually
        nodeChildProcess.stdout.addListener('data', function(chunk) {
            chunk && console.log(chunk);
        });

        nodeChildProcess.stderr.addListener('data', function(chunk) {
            chunk && console.error(chunk);
        });
    }

    nodeChildProcess.addListener('exit', function(code) {
        if(!ProcessManager.crashQueued) {
            ProcessManager.log("\n"+'Process Manager: Program '+executor+' '+program.join(' ')+' exited with code "'+code+'".');

            // Exit on code 1 no matter what
            if(code === 1) {
                NodeProcess.exit();
            }

            exports.child = null;

            if(ProcessManager.settings.noRestartOn == 'exit' || ProcessManager.settings.noRestartOn == 'error' && code !== 0) {
                return;
            }
        }

        // Restart the program if we get this far
        ProcessManager.startProgram(program, executor);
    });
}

ProcessManager.run = function(argumentsArray) {
    // Setup the process manager using the passed arguments
    var currentArgument;
    while(currentArgument = argumentsArray.shift()) {
        if(currentArgument === '--help' || currentArgument === '-h' || currentArgument === '-?') {
            return ProcessManager.help();
        }
        else if(currentArgument === '--quiet' || currentArgument === '-q') {
            ProcessManager.log = function() { };
        }
        else if(currentArgument === '--harmony') {
            ProcessManager.settings.harmony = true;
        }
        else if(currentArgument === '--verbose' || currentArgument === '-V') {
            ProcessManager.settings.verbose = true;
        }
        else if(currentArgument === '--watch' || currentArgument === '-w') {
            ProcessManager.settings.watch = argumentsArray.shift();
        }
        else if(currentArgument === '--ignore' || currentArgument === '-i') {
            ProcessManager.settings.ignore = argumentsArray.shift();
        }
        else if(currentArgument === '--poll-interval' || currentArgument === '-p') {
            ProcessManager.settings.pollInterval = parseInt(argumentsArray.shift());
        }
        else if(currentArgument === '--extensions' || currentArgument === '-e') {
            ProcessManager.settings.extensions = argumentsArray.shift();
        }
        else if(currentArgument === '--exec' || currentArgument === '-x') {
            ProcessManager.settings.executor = argumentsArray.shift();
        }
        else if(currentArgument === '--no-restart-on' || currentArgument === '-n') {
            ProcessManager.settings.noRestartOn = argumentsArray.shift();
        }
        else if(currentArgument === '--debug') {
            ProcessManager.settings.debug = true;
        }
        else if(currentArgument.indexOf('--debug-brk')>=0) {
            ProcessManager.settings.debugBreakFlag = true;
            ProcessManager.settings.debugBreakFlagArgument = currentArgument;
        }
        else if(currentArgument === '--force-watch') {
            ProcessManager.settings.forceWatch = true;
        }
        else if(currentArgument === '--') {
            ProcessManager.program = argumentsArray;
            break;
        }
        else if(currentArgument[0] != '-' && !argumentsArray.length) {
            // Assume last currentArgument is the program
            ProcessManager.program = [currentArgument];
        }
    }

    // Show help if no program
    if(!ProcessManager.program) {
        return ProcessManager.help();
    }

    // Watch the current directory if nothing is specified
    if(!ProcessManager.settings.watch) {
        // This causes problems if the script is called from a directory
        //ProcessManager.settings.watch = '.';
    }

    // Set the default poll interval
    if(!ProcessManager.settings.pollInterval) {
        ProcessManager.settings.pollInterval = 1000;
    }

    // Set the program extension
    ProcessManager.programExtension = ProcessManager.program.join(' ').match(/.*\.(\S*)/);
    ProcessManager.programExtension = ProcessManager.programExtension && ProcessManager.programExtension[1];

    // If no extensions passed try to guess from the program
    if(!ProcessManager.settings.extensions) {
        ProcessManager.settings.extensions = 'node,js';
        if(ProcessManager.programExtension && ProcessManager.settings.extensions.indexOf(ProcessManager.programExtension) == -1) {
            // Support coffee and litcoffee extensions
            if(ProcessManager.programExtension === 'coffee' || ProcessManager.programExtension === 'litcoffee') {
                ProcessManager.settings.extensions += ',coffee,litcoffee';
            }
            else {
                ProcessManager.settings.extensions += ','+ProcessManager.programExtension;
            }
        }
    }

    ProcessManager.fileExtensionPattern = new RegExp('^.*\.('+ProcessManager.settings.extensions.replace(/,/g, '|')+')$');

    if(!ProcessManager.settings.executor) {
        ProcessManager.settings.executor = (ProcessManager.programExtension === 'coffee' || ProcessManager.programExtension === 'litcoffee') ? 'coffee' : 'node';
    }

    if(ProcessManager.settings.debug) {
        ProcessManager.program.unshift('--debug');
    }

    if(ProcessManager.settings.debugBreakFlag) {
        ProcessManager.program.unshift(ProcessManager.settings.debugBreakFlagArgument);
    }

    if(ProcessManager.settings.harmony) {
        ProcessManager.program.unshift('--harmony');
    }

    if(ProcessManager.settings.executor === 'coffee' && (ProcessManager.settings.debug || ProcessManager.settings.debugBreakFlag)) {
        // coffee does not understand debug or debug-brk, make coffee pass options to node
        ProcessManager.program.unshift('--nodejs')
    }

    // Pass kill signals through to child
    try {
        ['SIGTERM', 'SIGINT', 'SIGHUP', 'SIGQUIT'].forEach(function(signal) {
            NodeProcess.on(signal, function() {
                var nodeChildProcess = exports.child;
                if(nodeChildProcess) {
                    ProcessManager.log('Sending "'+signal+'" signal to child...');
                    nodeChildProcess.kill(signal);
                }
                NodeProcess.exit();
            });
        });
    }
    catch(error) {
        // Windows doesn't support signals yet, so they simply don't get this handling.
        // https://github.com/joyent/node/issues/1553
    }

    // Announce launch
    ProcessManager.log('')
    ProcessManager.log('Starting Process Manager with');
    ProcessManager.log('  program "'+ProcessManager.program.join(' ')+'"');
    ProcessManager.log('  --watch "'+ProcessManager.settings.watch+'"');
    if(ProcessManager.settings.ignore) {
        ProcessManager.log('  --ignore "'+ProcessManager.settings.ignore+'"');
    }
    ProcessManager.log('  --extensions "'+ProcessManager.settings.extensions+'"');
    ProcessManager.log('  --exec "'+ProcessManager.settings.executor+'"');
    ProcessManager.log('');

    // Store the call to ProcessManager.startProgram in ProcessManager.startChildProcess in order to call it later
    ProcessManager.startChildProcess = function() {
        ProcessManager.startProgram(ProcessManager.program, ProcessManager.settings.executor);
    }

    // Start the child process
    ProcessManager.startChildProcess();

    // Handle ignored files
    if(ProcessManager.settings.ignore) {
        ProcessManager.settings.ignoring = ProcessManager.settings.ignore.split(',');
        ProcessManager.settings.ignoring.forEach(function(itemToIgnore) {
            itemToIgnore = NodePath.resolve(itemToIgnore);
            ProcessManager.settings.ignoring[itemToIgnore] = true;
            ProcessManager.log('Process Manager: Ignoring "'+itemToIgnore+'".');
        });
    }

    // Handle watching files
    if(ProcessManager.settings.watch) {
        ProcessManager.settings.watching = ProcessManager.settings.watch.split(',');
        ProcessManager.settings.watching.forEach(function(itemToWatch) {
            itemToWatch = NodePath.resolve(itemToWatch);
            ProcessManager.log('Process Manager: Watching "'+itemToWatch+'" for changes.');
            ProcessManager.findFilesToWatch(itemToWatch, function(file) {
                ProcessManager.watchFile(file, ProcessManager.settings.pollInterval);
            });
        });
    }
}

ProcessManager.start = function() {
    var baseNameofCurrentArgument;
    var currentArgument;

    //console.log(ProcessManager.argumentsArray);
    //return;

    // Shift arguments off of the arguments array until the arguments array is just what is relevant
    do {
        currentArgument = ProcessManager.argumentsArray.shift();
    }
    while(
        NodeFileSystem.realpathSync(currentArgument) !== __filename &&
        (baseNameofCurrentArgument = NodePath.basename(currentArgument)) !== 'process-manager' &&
        baseNameofCurrentArgument !== 'Process Manager' &&
        baseNameofCurrentArgument !== 'Process Manager.js'
    ) {
        ProcessManager.run(ProcessManager.argumentsArray);
    }
}

ProcessManager.start();