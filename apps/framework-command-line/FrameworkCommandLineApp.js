// Globals
import './../../globals/Globals.js';

//var transpiled = require.cache[require.resolve(__filename)];

////var transpiled = require('babel-register/lib/cache').get();
////transpiled.each(function(key, value) {
////	try {
////		key = Json.decode(key);	
////	}
////	catch(error) {

////	}
	
////	if(key && key.filename) {
////		console.log(key.filename);	
////	}
////});

//console.log(transpiled);
//Node.exit();

// Dependencies
import App from './../../system/app/App.js';

// Class
class FrameworkCommandLineApp extends App {

}

// Global instance
global.app = new FrameworkCommandLineApp(__dirname);

// Initialize
global.app.initialize();
