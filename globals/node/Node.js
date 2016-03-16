// Class
var Node = {};

// Static properties

Node.Assert = require('assert');
Node.ChildProcess = require('child_process');
Node.Cluster = require('cluster');
Node.Cryptography = require('crypto');
Node.Domain = require('domain');
Node.Events = require('events');
Node.EventEmitter = Node.Events.EventEmitter;
Node.FileSystem = require('fs');
Node.Http = require('http');
Node.Https = require('https');
Node.OperatingSystem = require('os');
Node.Path = require('path');
Node.Path.separator = Node.Path.sep;
Node.Process = process;
Node.StandardIn = (Node.Process.versions.electron) ? null : Node.Process.stdin; // When running Electron, if you try to access process.stdin Node throws an exception
Node.StandardOut = Node.Process.stdout;
Node.Stream = require('stream');
Node.Url = require('url');
Node.Utility = require('util');
Node.Zlib = require('zlib');

// Static methods
Node.require = require;

Node.exit = function() {
	if(arguments.length) {
		Console.writeLine(Console.prepareMessage.call(this, arguments, 'error'));
	}
	
	Node.Process.exit(1);
};

// Export
module.exports = Node;