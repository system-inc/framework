// Dependencies
var Pool = Framework.require('system/pool/Pool.js');
var TestBrowserWindow = Framework.require('assistant/desktop/proctor/browser-windows/TestBrowserWindow.js');

// Class
var TestBrowserWindowPool = Pool.extend({

	reusableClass: TestBrowserWindow,
	minimumSize: 1,
	maximumSize: 4,
	createReusablesAsNecessary: false,
	timeInMillisecondsToWaitToRetireAvailableReusables: 1 * 1000,

});

// Export
module.exports = TestBrowserWindowPool;