// Dependencies
import Assert from 'assert';
import ChildProcess from 'child_process';
import Cluster from 'cluster';
import Cryptography from 'crypto';
import Events from 'events';
import FileSystem from 'fs';
import Http from 'http';
import Https from 'https';
import Http2 from 'http2';
import Module from 'module';
import Net from 'net';
import OperatingSystem from 'os';
import Path from 'path';
import Readline from 'readline';
import Stream from 'stream';
import Url from 'url';
import Utility from 'util';
import Zlib from 'zlib';

// Class
class Node {

	static childProcesses = {};

	static Assert = Assert;
	static Buffer = Buffer;
	static ChildProcess = ChildProcess;
	static Cluster = Cluster;
	static Cryptography = Cryptography;
	static Events = Events;
	static EventEmitter = Events.EventEmitter;
	static FileSystem = FileSystem;
	static Http = Http;
	static Https = Https;
	static Http2 = Http2;
	static Module = Module;
	static Net = Net;
	static OperatingSystem = OperatingSystem;
	static Path = Path;
	static Process = process;
	static Readline = Readline;
	static StandardIn = process.stdin;
	static StandardOut = process.stdout;
	static Stream = Stream;
	static Url = Url;
	static Utility = Utility;
	static Zlib = Zlib;

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

// Configure and extend the Path module
Node.Path.separator = Node.Path.sep;

Node.Path.argumentsToStringArguments = function(passedArguments) {
	var stringArguments = [];
	for(var i = 0; i < passedArguments.length; i++) {
		stringArguments.push(passedArguments[i].toString());
	}
	return stringArguments;
};

// Make Node.Path.join accept objects which can be toString()'d (e.g., Directory objects)
var standardJoin = Node.Path.join;
Node.Path.join = function() {
	return standardJoin.apply(this, Node.Path.argumentsToStringArguments(arguments));
};

// Make Node.Path.isAbsolute accept objects which can be toString()'d (e.g., Directory objects)
var standardIsAbsolute = Node.Path.isAbsolute;
Node.Path.isAbsolute = function() {
	return standardIsAbsolute.apply(this, Node.Path.argumentsToStringArguments(arguments));
};

// Make Node.Path.isAbsolute accept objects which can be toString()'d (e.g., Directory objects)
var standardNormalize = Node.Path.normalize;
Node.Path.normalize = function() {
	return standardNormalize.apply(this, Node.Path.argumentsToStringArguments(arguments));
};

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
