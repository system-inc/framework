// Dependencies
import { HttpRequestMessage } from '@framework/system/server/protocols/http/messages/HttpRequestMessage.js';
import { HttpResponseMessage } from '@framework/system/server/protocols/http/messages/HttpResponseMessage.js';

// Class
class WebClient {

    static async request(url, options = {}) {
        // Handle relative URLs, populate them with information from the DOM
        if(url.startsWith('/')) {
            if(document && document.location) {
                url = document.location.origin+url;
            }
        }

        // Create the HttpRequestMessage
        let httpRequestMessage = HttpRequestMessage.fromObject(options, url);

        // Use XMLHTTPRequest on the web
        return new Promise(function(resolve, reject) {
            // https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX/Getting_Started
            let xmlHttpRequest = new XMLHttpRequest();

            xmlHttpRequest.onreadystatechange = function() {
                //console.log('xmlHttpRequest.onreadystatechange() xmlHttpRequest.readyState', xmlHttpRequest.readyState);

                // If the request is finished
                if(xmlHttpRequest.readyState === XMLHttpRequest.DONE) {
                    // console.log('xmlHttpRequest', xmlHttpRequest);
                    var httpResponseMessage = HttpResponseMessage.fromMethodAndXmlHttpRequest(httpRequestMessage.method, xmlHttpRequest);
                    resolve(httpResponseMessage);
                }
            };

            //console.log('url', httpRequestMessage.url.toString())
            xmlHttpRequest.open(httpRequestMessage.method, httpRequestMessage.url.toString(), true); 
            xmlHttpRequest.send(httpRequestMessage.body);
        });
    }
    
}

// Export
export { WebClient };
