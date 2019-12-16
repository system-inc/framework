// Dependencies
import ProtocolClient from 'framework/system/server/protocols/ProtocolClient.js';
import LocalSocketProtocolConnection from 'framework/system/server/protocols/local-socket/LocalSocketProtocolConnection.js';

// Class
class LocalSocketProtocolClient extends ProtocolClient {

    localSocketFilePath = null;

    constructor(localSocketFilePath = null) {
        super();

        // Set the local socket file path
        if(localSocketFilePath === null) {
            throw new Error('Path must be specified when constructing a LocalSocketProtocolClient.');
        }
        this.localSocketFilePath = localSocketFilePath;
    }

    async connect(timeoutInMilliseconds = 1 * 1000) {
        return new Promise(function(resolve, reject) {
            //console.log('Client: Connecting...');
            
            // Timeout the promise if we never connect
            var timeoutFunction = Function.schedule(timeoutInMilliseconds, function() {
                reject('Could not connect, timed out after '+timeoutInMilliseconds+' milleseconds.');
            });

            // Create the connection
            var connection = new LocalSocketProtocolConnection(Node.Net.createConnection(this.localSocketFilePath, function() {
                //console.log('Client connected!');

                // Cancel the timeout function
                Function.cancel(timeoutFunction);
                
                resolve(connection);
            }.bind(this)));
        }.bind(this));
    }
    
}

// Export
export default LocalSocketProtocolClient;
