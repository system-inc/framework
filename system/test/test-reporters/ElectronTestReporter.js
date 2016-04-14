// Dependencies
var TestReporter = Framework.require('system/test/test-reporters/TestReporter.js');

// Class
var ElectronTestReporter = TestReporter.extend({

	//startedRunningTests: function(data) {
	//	Console.log('start');
	//},

	//startedRunningTest: function(data) {
	//},

	//startedRunningTestMethod: function(data) {
	//},

	//finishedAssert: function(data) {
	//},

	//finishedRunningTestMethod: function(data) {
	//},

	//finishedRunningTest: function(data) {
	//},	

	//finishedRunningTests: function(data) {
	//	Console.log('end');
	//},

});

// Export
module.exports = ElectronTestReporter;