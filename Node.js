Node = {};
Node.ChildProcess = require('child_process');
Node.Cluster = require('cluster');
Node.Cryptography = require('crypto');
Node.Domain = require('domain');
Node.Events = require('events');
Node.EventEmitter = EventEmitter = Node.Events.EventEmitter;
Node.FileSystem = require('fs');
Node.Http = require('http');
Node.Https = require('https');
Node.OperatingSystem = require('os');
Node.Path = require('path');
Node.Path.separator = Node.Path.sep;
Node.Process = process;
Node.StandardIn = Node.Process.stdin;	
Node.StandardOut = Node.Process.stdout;
Node.Stream = require('stream');
Node.Url = require('url');
Node.Utility = require('util');
Node.Zlib = require('zlib');

Node.exit = function() {
	if(arguments.length) {
		Console.out(Terminal.style(Console.prepareMessage.call(this, arguments), 'red'));	
	}
	
	Node.Process.exit(1);
}