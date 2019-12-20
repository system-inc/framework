// Dependencies
import Connection from 'framework/system/server/Connection.js';

// Class
class HttpConnection extends Connection {

    constructor(nodeSocket) {
        super(nodeSocket);
    }

    async send(data) {
        //console.log('HttpConnection.send ---');
        //console.log(data);
        //console.log('^ ---');
        this.nodeSocket.write(data);
    }

    async request(data, timeoutInMilliseconds = 1 * 1000) {
        //console.log('HttpConnection.request data', data);

        await this.send(data);

        return new Promise(function(resolve, reject) {
            var timeoutFunction = Function.schedule(timeoutInMilliseconds, function() {
                //resolve(new Error('Request failed, timed out after '+timeoutInMilliseconds+' milleseconds.'));
                reject('Request failed, timed out after '+timeoutInMilliseconds+' milleseconds.');
            });

            // A function to check the correlation identifiers of future packets until we get a match
            var correlationIdentifierCheckFunction = function(event) {
                //console.log('HttpConnection.request on data event:', event);
                //console.log('HttpConnection.request on data event.data:', event.data);
                resolve(event.data.toString());
            }.bind(this);

            // Listen to data until we get a response to our request
            this.on('data', correlationIdentifierCheckFunction);
        }.bind(this));
    }

}

// Export
export default HttpConnection;
