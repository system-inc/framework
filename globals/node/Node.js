// Get the Events module
var Events = require('events');

// Get and configure the Path module
var Path = require('path');
Path.separator = Path.sep;

// Class
class Node {

	static childProcesses = [];

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
	static OperatingSystem = require('os');
	static Path = Path;
	static Process = process;
	static Readline = require('readline');
	//static StandardIn = (process.versions.electron) ? null : process.stdin; // When running Electron, if you try to access process.stdin Node throws an exception
	static StandardIn = process.stdin;
	static StandardOut = process.stdout;
	static Stream = require('stream');
	static Url = require('url');
	static Utility = require('util');
	static Zlib = require('zlib');

	static spawnChildProcess() {
		var childProcess = Node.ChildProcess.spawn(...arguments);

		Node.childProcesses.append(childProcess);

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
	if(Node.childProcesses.length) {
		console.log('Killing', Node.childProcesses.length, 'child process'+(Node.childProcesses.length > 1 ? 'es' : '')+'...');
		Node.childProcesses.forEach(function(childProcess) {
			childProcess.kill();
		});
	}
});

// Global
global.Node = Node;
