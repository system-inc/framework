// Configure the Path object
var Path = require('path');
Path.separator = Path.sep;

export default class Node {

	static Assert = require('assert');
	static ChildProcess = require('child_process');
	static Cluster = require('cluster');
	static Cryptography = require('crypto');
	static Domain = require('domain');
	static Events = require('events');
	static EventEmitter = Node.Events.EventEmitter;
	static FileSystem = require('fs');
	static Http = require('http');
	static Https = require('https');
	static OperatingSystem = require('os');
	static Path = Path;
	static Process = process;
	static StandardIn = (Node.Process.versions.electron) ? null : Node.Process.stdin; // When running Electron, if you try to access process.stdin Node throws an exception
	static StandardOut = Node.Process.stdout;
	static Stream = require('stream');
	static Url = require('url');
	static Utility = require('util');
	static Zlib = require('zlib');

	static exit() {
		if(arguments.length) {
			Console.writeLine(Console.prepareMessage.call(this, arguments, 'error'));
		}
		
		Node.Process.exit(1);	
	}

}