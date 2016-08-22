// Get the Events module
var Events = require('events');

// Get and configure the Path module
var Path = require('path');
Path.separator = Path.sep;

// Class
class Node {

	static Assert = require('assert');
	static Buffer = Buffer;
	static ChildProcess = require('child_process');
	static Cluster = require('cluster');
	static Cryptography = require('crypto');
	static Domain = require('domain');
	static Events = Events;
	static EventEmitter = Events.EventEmitter;
	static FileSystem = require('fs');
	static Http = require('http');
	static Https = require('https');
	static OperatingSystem = require('os');
	static Path = Path;
	static Process = process;
	static StandardIn = (process.versions.electron) ? null : process.stdin; // When running Electron, if you try to access process.stdin Node throws an exception
	static StandardOut = process.stdout;
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

// Global
global.Node = Node;
