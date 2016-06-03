// Dependencies
var Pool = Framework.require('system/pool/Pool.js');
var TestBrowserWindow = Framework.require('proctor/desktop/browser-windows/TestBrowserWindow.js');

// Class
var TestBrowserWindowPool = Pool.extend({

	reusableClass: TestBrowserWindow,
	maximumSize: 8,
	createReusablesAsNecessary: true,

});

// Export
module.exports = TestBrowserWindowPool;