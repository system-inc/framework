// Globals
import './../../globals/Globals.js';

// Dependencies
import App from './../../system/app/App.js';

// Class
class FrameworkApp extends App {

}

// Global instance
global.app = new FrameworkApp(__dirname);

// Initialize
global.app.initialize();
