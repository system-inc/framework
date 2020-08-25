// Globals
import 'framework/globals/Globals.js';

// Dependencies
import { App } from '@framework/system/app/App.js';

// Class
class WebServerTestApp extends App {
	
}

// Global instance
global.app = new WebServerTestApp(Node.Path.dirname(import.meta.url.replace('file://', '')));

// Initialize
global.app.initialize();
