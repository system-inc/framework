Log = Class.extend({

	log: function() {
		var message = '';
		for(var i = 0; i < arguments.length; i++) {
			message += arguments[i]+' ';
		}		

		// Create a new error
		var error = new Error('Log.log');

		// Capture the stack trace from the callee
	    Error.captureStackTrace(error, arguments.callee);

	    //Log.log(error.stack)

	    // Format the stack trace
	    var stackTraceLines = error.stack.split("\n");
	    var className = stackTraceLines[1].match(/at\s(.*?)\s/)[1];
	    var methodName = stackTraceLines[1].match(/at\s(.*?)\s/)[1].split('.').reverse()[0];
	    var filePath = stackTraceLines[1].match(/\((.*?):/)[1];
	    var fileName = stackTraceLines[1].match(/\((.*?):/)[1].split('/').reverse()[0];
	    var lineNumber = stackTraceLines[1].match(/:(.*?):/)[1];
	    var columnNumber = stackTraceLines[1].match(/:\d+:(\d+)/)[1];

	    // Handle classes extending Class
	    if(className.startsWith('Class')) {
	    	className = fileName.replace('.js', '');
	    }

	    // Log.log('Class Name'+': '+className);
	    // Log.log('Method Name'+': '+methodName);
	    // Log.log('File Path'+': '+filePath);
	    // Log.log('File Name'+': '+fileName);
	    // Log.log('Line Number'+': '+lineNumber);
	    // Log.log('Column Number'+': '+columnNumber);

	    var log = '['+new Time().getDateTime()+'] ('+fileName+':'+lineNumber+") "+message;
		console.log(log);
	}

});

// Static methods
Log.log = Log.prototype.log;