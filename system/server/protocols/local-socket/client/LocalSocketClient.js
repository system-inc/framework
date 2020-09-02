// Dependencies
import { Client } from '@framework/system/server/Client.js';
import { LocalSocketConnection } from '@framework/system/server/protocols/local-socket/LocalSocketConnection.js';

// Class
class LocalSocketClient extends Client {

    localSocketFilePath = null;

    constructor(localSocketFilePath = null) {
        super();

        // Set the local socket file path
        if(localSocketFilePath === null) {
            throw new Error('Path must be specified when constructing a LocalSocketClient.');
        }
        
        this.localSocketFilePath = localSocketFilePath;
    }

    async connect(timeoutInMilliseconds = 1 * 1000) {
        return new Promise(function(resolve, reject) {
            //console.log('Client: Connecting...');
            
            // Timeout the promise if we never connect
            let timeoutFunction = Function.schedule(timeoutInMilliseconds, function() {
                reject('Could not connect, timed out after '+timeoutInMilliseconds.addCommas()+' milleseconds.');
            });

            // Create the connection
            let localSocketConnection = new LocalSocketConnection(
                Node.Net.createConnection(
                    this.localSocketFilePath,
                    function() {
                        //console.log('LocalSocketClient connected!');

                        // Cancel the timeout function
                        Function.cancel(timeoutFunction);
                
                        resolve(localSocketConnection);
                    }.bind(this)
                ),
            );
        }.bind(this));
    }
    
}

// Export
export { LocalSocketClient };
