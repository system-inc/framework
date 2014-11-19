Node = {};
Node.Cryptography = require('crypto');
Node.Domain = require('domain');
Node.Events = require('events');
EventEmitter = Node.EventEmitter = Node.Events.EventEmitter;
Node.FileSystem = require('fs');
Node.Http = require('http');
Node.Https = require('https');
Node.Path = require('path');
Node.Process = process;
Node.StandardIn = Node.Process.stdin;	
Node.StandardOut = Node.Process.stdout;
Node.Url = require('url');
Node.Utility = require('util');
Node.Zlip = require('zlib');

Node.exit = function() {
	if(arguments.length) {
		Console.out(Terminal.style(Console.prepareMessage.call(this, arguments), 'red'));	
	}
	
	Node.Process.exit();
}