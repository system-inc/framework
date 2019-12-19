// Get the Events module
var Events = require('events');

// Get and configure the Path module
var Path = require('path');
Path.separator = Path.sep;

Path.argumentsToStringArguments = function(passedArguments) {
	var stringArguments = [];
	for(var i = 0; i < passedArguments.length; i++) {
		stringArguments.push(passedArguments[i].toString());
	}
	return stringArguments;
};

// Make Path.join accept objects which can be toString()'d (e.g., Directory objects)
var standardJoin = Path.join;
Path.join = function() {
	return standardJoin.apply(this, Path.argumentsToStringArguments(arguments));
};

// Make Path.isAbsolute accept objects which can be toString()'d (e.g., Directory objects)
var standardIsAbsolute = Path.isAbsolute;
Path.isAbsolute = function() {
	return standardIsAbsolute.apply(this, Path.argumentsToStringArguments(arguments));
};

// Make Path.isAbsolute accept objects which can be toString()'d (e.g., Directory objects)
var standardNormalize = Path.normalize;
Path.normalize = function() {
	return standardNormalize.apply(this, Path.argumentsToStringArguments(arguments));
};

// Class
class Node {

	static childProcesses = {};

	static Assert = require('assert');
	static Buffer = Buffer;
	
	static ChildProcess = require('child_process');

	static Cluster = require('cluster');
	static Cryptography = require('crypto');
	static Events = Events;
	static EventEmitter = Events.EventEmitter;
	static FileSystem = require('fs');
	static Http = require('http');
	static Https = require('https');
	static Http2 = require('http2');
	static Module = require('module');
	static Net = require('net');
	static OperatingSystem = require('os');
	static Path = Path;
	static Process = process;
	static Readline = require('readline');
	static StandardIn = process.stdin;
	static StandardOut = process.stdout;
	static Stream = require('stream');
	static Url = require('url');
	static Utility = require('util');
	static Zlib = require('zlib');

	static execute(command, options = {}) {
		return new Promise(function(resolve, reject) {
			Node.ChildProcess.exec(command, options, function(error, standardOut, standardError) {
				if(error) {
					reject(error);	
				}
				else {
					resolve(standardOut);
				}
			});
		});
	}

	static spawnChildProcess() {
		//console.log('spawnChildProcess arguments', arguments);

		var childProcess = Node.ChildProcess.spawn(...arguments);

		Node.childProcesses[childProcess.pid] = childProcess;

		childProcess.on('close', function() {
			//console.log('removing process from nodeChildProcesses', childProcess.pid);
			delete Node.childProcesses[childProcess.pid];
		});

		return childProcess;
	}

	static exit() {
		if(arguments.length) {
			if(app.log) {
				app.log(...arguments);
			}
			else {
				console.log(...arguments);
			}
		}

		Node.Process.exit(1);	
	}

}

// Catch unhandled rejections
Node.Process.on('unhandledRejection', function(error) {
	console.error('Unhandled rejection:', error);
	Node.exit();
});

// Catch unhandled exceptions
Node.Process.on('uncaughtException', function(error) {
	console.error('Uncaught exception:', error);
	Node.exit();
});

// Catch ctrl-c
Node.Process.on('SIGINT', Node.exit);

// Catch kill
Node.Process.on('SIGTERM', Node.exit);

// Catch exit
Node.Process.on('exit', function() {
	var nodeChildProcesses = Node.childProcesses.getKeys();
	//console.log('nodeChildProcesses', nodeChildProcesses);

	if(nodeChildProcesses.length) {
		console.log('Killing', nodeChildProcesses.length, 'child process'+(nodeChildProcesses.length > 1 ? 'es' : '')+'...');

		Node.childProcesses.each(function(childProcessIdentifier, childProcess) {
			childProcess.kill();
		});
	}
});

// Global
global.Node = Node;
