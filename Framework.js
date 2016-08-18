// Dependencies
require('./globals/Globals.js');
//var Version = App.require('system/version/Version.js');

//// Class
//var Framework = {

//	// Static properties

//	version: new Version('0.1.0'),

//	directory: __dirname,

//	coreModules: [
//		'ConsoleModule',
//		'ArchiveModule',
//	],

//	// Static methods

//	// Run all require calls through this method
//	require: function(identifier) {
//		//Console.log('App.require', arguments);

//		// Ensure consistency of calls to .require()
//		if(!identifier.endsWith('.js')) {
//			throw new Error(identifier+' must end with ".js".');
//		}

//		// If the identifier is absolute
//		if(Node.Path.isAbsolute(identifier)) {
//			// Do nothing
//		}
//		// If we are calling the method as an instance of Framework using Project.require, use the Project directory
//		else if(Class.isInstance(this, Framework)) {
//			identifier = Node.Path.join(Project.directory, identifier);
//		}
//		// If we are calling the method statically using App.require, use the Framework directory
//		else {
//			identifier = Node.Path.join(App.directory, identifier);
//		}

//		//Console.log('App.require()', 'identifier', identifier);

//		try {
//			return Node.require(identifier);
//		}
//		catch(exception) {
//			Console.error('Error when requiring', identifier);
//			throw exception;
//		}
//	},

//};

//// Export
//module.exports = Framework;