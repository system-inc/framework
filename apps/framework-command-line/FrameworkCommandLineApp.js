// Globals
import './../../globals/Globals.js';

// Dependencies
import App from './../../system/app/App.js';

// Class
class FrameworkCommandLineApp extends App {

}

// Global instance
global.app = new FrameworkCommandLineApp(__dirname);

// Initialize
global.app.initialize();
