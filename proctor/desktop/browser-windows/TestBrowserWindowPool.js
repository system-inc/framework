// Dependencies
var Pool = Framework.require('system/pool/Pool.js');
var TestBrowserWindow = Framework.require('proctor/desktop/browser-windows/TestBrowserWindow.js');

// Class
var TestBrowserWindowPool = Pool.extend({

	reusableClass: TestBrowserWindow,
	minimumSize: 1,
	//maximumSize: 8,
	maximumSize: 3,
	//maximumSize: 1,
	createReusablesAsNecessary: true,
	//createReusablesAsNecessary: false,
	timeInMillisecondsToWaitToRetireAvailableReusables: 1 * 1000,

});

// Export
module.exports = TestBrowserWindowPool;