// Dependencies
import { EventEmitter } from '@framework/system/event/EventEmitter.js';
import { HttpRequestMessage } from '@framework/system/server/protocols/http/messages/HttpRequestMessage.js';
import { HttpResponseMessage } from '@framework/system/server/protocols/http/messages/HttpResponseMessage.js';
import { Url } from '@framework/system/web/Url.js';
import { Headers } from '@framework/system/server/protocols/http/messages/headers/Headers.js';
import { Version } from '@framework/system/version/Version.js';

// Class
class HttpMessageGenerator extends EventEmitter {

    connection = null;

    incomingMessageClassDefinition = null;
    incomingMessageCurrentStructureIndex = null;
    incomingMessageCurrentStructureProperty = null;
    incomingMessage = null;

    dataToProcessSizeInBytes = 0;
    dataToProcess = [];

    // Used to keep track of body chunks
    incomingBodyChunkSizeInBytes = null;

    messagesEmitted = 0;

    constructor(connection) {
        super();

        this.connection = connection;
    }

    receiveDataToProcess(data) {
        //console.log('Socket message generator processing data', data.toString());
        
        // We've got new data from the wire, add it to our data to process
        this.dataToProcess.append(data);
        this.dataToProcessSizeInBytes += data.length;

        // Process the data
        this.processData();
    }

    processData() {
        // app.log('HttpMessageGenerator this.incomingMessageCurrentStructureProperty', this.incomingMessageCurrentStructureProperty, 'dataToProcessSizeInBytes', this.dataToProcessSizeInBytes, 'dataToProcess', this.dataToProcess);

        // If the current state index is null, start off with a new message
        if(this.incomingMessageCurrentStructureIndex == null) {
            // app.log('Creating a new message...');

            // Determine if the message is an HttpRequestMessage or HttpResponseMessage
            this.incomingMessageClassDefinition = this.getIncomingMessageClassDefinition();
            if(!this.incomingMessageClassDefinition) {
                throw new Error('Unrecognized HTTP message type.');
            }
            // app.log('The new message type is:', this.incomingMessageClassDefinition.name);
            
            // Create a new message
            this.incomingMessage = new this.incomingMessageClassDefinition();

            // Set the connection on the new message
            this.incomingMessage.connection = this.connection;
            
            // Start off at the first structure at index 0
            this.incomingMessageCurrentStructureIndex = 0;

            // Set the current property
            this.incomingMessageCurrentStructureProperty = this.incomingMessageClassDefinition.structure.getKeys().nth(this.incomingMessageCurrentStructureIndex);
            // app.log('this.incomingMessageCurrentStructureProperty', this.incomingMessageCurrentStructureProperty);
        }

        // If we are reading the body
        if(this.incomingMessageCurrentStructureProperty == 'body') {
            // app.log('at the body dataToProcessSizeInBytes', this.dataToProcessSizeInBytes, 'dataToProcess', this.dataToProcess);

            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length
            let contentLength = this.incomingMessage.headers.get('content-length');

            // https://en.wikipedia.org/wiki/Chunked_transfer_encoding
            let transferEncoding = this.incomingMessage.headers.get('transfer-encoding');

            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Trailer
            let trailer = this.incomingMessage.headers.get('trailer');
            
            // If a content length was specified and we have enough bytes to read it
            if(contentLength !== null && this.dataToProcessSizeInBytes >= contentLength) {
                this.incomingMessage.body = this.readFromDataToProcess(contentLength);
                this.nextStructureIndex(); // Move to the trailers
            }
            // If we are using chunked transfer encoding
            else if(transferEncoding !== null && transferEncoding.lowercase() == 'chunked') {
                // Set the body as an empty string which we will append to
                if(this.incomingMessage.body === null) {
                    this.incomingMessage.body = '';
                }
                
                // Read the chunk size from the dataToProcess if we have not already read it
                if(this.incomingBodyChunkSizeInBytes === null) {
                    // The data until the next boundary will be the chunk size in bytes in hexadecimal
                    let chunkSizeInHexadecimal = this.readFromDataToProcessToBoundary("\r\n");
                    // app.log('chunkSizeInHexadecimal', chunkSizeInHexadecimal);

                    // Convert it from hex to an integer and store it
                    this.incomingBodyChunkSizeInBytes = Number.hexadecimalToInteger(chunkSizeInHexadecimal.toString()); // Remember to convert from a buffer to string
                }
                // app.log('this.incomingBodyChunkSizeInBytes', this.incomingBodyChunkSizeInBytes);

                // If the chunk size is 0, we are at the end of the body
                if(this.incomingBodyChunkSizeInBytes === 0) {
                    this.incomingBodyChunkSizeInBytes = null; // Reset to null
                    this.readFromDataToProcessToBoundary("\r\n"); // All chunks end in "\r\n", so we will read it to remove it

                    // app.log('No more chunks, this.dataToProcess', this.dataToProcess);
                    return this.nextStructureIndex(); // Move to the trailers
                }
                // If we have all of the chunk data, read the chunk and append it to the body
                else if(this.incomingBodyChunkSizeInBytes <= this.dataToProcessSizeInBytes) {
                    this.incomingMessage.body += this.readFromDataToProcess(this.incomingBodyChunkSizeInBytes);
                    this.incomingBodyChunkSizeInBytes = null; // Reset to null
                    this.readFromDataToProcessToBoundary("\r\n"); // All chunks end in "\r\n", so we will read it to remove it
                    return this.processMoreData(); // Process more data if we have it
                }
                // Wait for the rest of the chunk to come through
                else {
                    // app.log('Waiting for the rest of the chunk from the socket, only have this.dataToProcessSizeInBytes', this.dataToProcessSizeInBytes, 'and need this.incomingBodyChunkSizeInBytes', this.incomingBodyChunkSizeInBytes);
                }
            }
            // There is no content length, there is no transfer encoding, and there are no trailers
            else if(contentLength === null && transferEncoding === null && trailer === null) {
                // The body is the rest of the data
                this.incomingMessage.body = this.readFromDataToProcess(this.dataToProcessSizeInBytes);
                app.log('No content length set, the rest of the body is', this.incomingMessage.body);
            }
            else {
                throw new Error('need to implement this scenario')
            }
        }
        // If we are reading the trailers
        else if(this.incomingMessageCurrentStructureProperty == 'trailers') {
            app.log('At the trailers');

            let trailer = this.incomingMessage.headers.get('trailer');
            app.log('trailer', trailer);

            // If there are no trailers to read
            if(!trailer) {
                return this.nextStructureIndex();
            }
        }
        // Read everything else
        else {
            let boundaryString = this.incomingMessageClassDefinition.structure[this.incomingMessageCurrentStructureProperty].boundary;
            let dataUpToBoundary = this.readFromDataToProcessToBoundary(boundaryString);
            // app.log(this.incomingMessageCurrentStructureProperty, 'dataUpToBoundary', dataUpToBoundary);
    
            // If we found the boundary
            if(dataUpToBoundary !== null) {
                // app.log('boundaryString', boundaryString, 'dataUpToBoundary', dataUpToBoundary);
    
                // Conditionally convert data to a number if the structure type is number
                if(this.incomingMessageClassDefinition.structure[this.incomingMessageCurrentStructureProperty].type == 'number') {
                    dataUpToBoundary = Number.from(dataUpToBoundary);
                }
                // Everything else is a string
                else {
                    dataUpToBoundary = dataUpToBoundary.toString();
                }
    
                // Handle various property values
                let propertyValue = null;
                // HttpMessage .protocolVersion
                if(this.incomingMessageCurrentStructureProperty == 'protocolVersion') {
                    propertyValue = new Version(dataUpToBoundary);
                }
                // HttpMessage .url
                else if(this.incomingMessageCurrentStructureProperty == 'url') {
                    propertyValue = new Url(dataUpToBoundary);
                }
                // HttpMessage .headers
                else if(this.incomingMessageCurrentStructureProperty == 'headers') {
                    propertyValue = new Headers(dataUpToBoundary);
                }
                // HttpMessage .trailers
                else if(this.incomingMessageCurrentStructureProperty == 'trailers') {
                    propertyValue = new Headers(dataUpToBoundary);
                }
                else {
                    propertyValue = dataUpToBoundary;
                }
    
                // Set the property value on the message
                // app.log('Setting', this.incomingMessageCurrentStructureProperty, 'to', propertyValue);
                this.incomingMessage[this.incomingMessageCurrentStructureProperty] = propertyValue;
    
                // app.log('HttpMessageGenerator dataToProcessSizeInBytes', this.dataToProcessSizeInBytes, 'dataToProcess', this.dataToProcess);
                
                // Move to the next structure index
                this.nextStructureIndex();
            }
        }

        // app.log('this.incomingMessage', this.incomingMessage);
    }

    nextStructureIndex() {
        let structureKeys = this.incomingMessageClassDefinition.structure.getKeys();
        this.incomingMessageCurrentStructureIndex++;

        // If we have processed all of the structures
        if(this.incomingMessageCurrentStructureIndex == structureKeys.length) {
            return this.emitMessage();
        }

        this.incomingMessageCurrentStructureProperty = structureKeys[this.incomingMessageCurrentStructureIndex];

        return this.processMoreData();
    }

    processMoreData() {
        // Recurse if there are more bytes to process
        if(this.dataToProcessSizeInBytes > 0) {
            return this.processData();
        }
        // Conditions for being done with the message
        else if(
            // If we just moved to the body after the headers are there is no more data, we are done
            (this.incomingMessageCurrentStructureProperty == 'body' && this.dataToProcessSizeInBytes === 0) ||
            // If we are at the trailers and there are no trailer headers, we are done
            (this.incomingMessageCurrentStructureProperty == 'trailers' && this.incomingMessage.headers.get('trailer') === null)
        ) {
            return this.emitMessage();
        }
    }

    readFromDataToProcessToBoundary(boundaryString) {
        let boundaryBuffer = Buffer.from(boundaryString); // Turn the boundary into a buffer so we can use Buffer .indexOf()
        let indexOfBoundary = null; // Where the boundary starts
        let sizeToReadFromDataToProcess = 0; // How much to read

        // Our dataToProcess is an array of buffers
        // Loop through the buffers looking for the boundary
        this.dataToProcess.each(function(arrayIndex, buffer) {
            // Find the boundary in the buffer
            let indexOfBoundaryCheck = buffer.indexOf(boundaryBuffer);
            //app.log('indexOfBoundaryCheck', indexOfBoundaryCheck);

            // If the boundary was found in the buffer
            if(indexOfBoundaryCheck >= 0) {
                indexOfBoundary = indexOfBoundaryCheck;
                sizeToReadFromDataToProcess += indexOfBoundary;

                return false; // break
            }
            // If the boundary was not found in the buffer, keep track of the size and keep looping
            else {
                sizeToReadFromDataToProcess += buffer.length;
            }
        });

        let result = null;

        // If we found the boundary in the dataToProcess, read up until the boundary
        if(indexOfBoundary !== null) {
            // Read but do not include the boundary
            result = this.readFromDataToProcess(sizeToReadFromDataToProcess);

            if(result === null) {
                result = Buffer.allocUnsafe(0);
            }

            // Read the boundary to remove it from dataToProcess
            this.readFromDataToProcess(boundaryBuffer.length);
        }

        return result;
    }

    readFromDataToProcess(size) {
        var result = null;

        // Keep track of the bytes we are reading
        this.dataToProcessSizeInBytes -= size;

        // If the bytes we want to read are the exact length of the first entry in the dataToProcess array
        if(size === this.dataToProcess[0].length) {
            result = this.dataToProcess.shift();
        }
        // If the bytes we want to read are less than the size of the first entry in the dataToProcess array
        else if(size < this.dataToProcess[0].length) {
            // Cut out just the data we need from the first entry
            result = this.dataToProcess[0].slice(0, size);
            this.dataToProcess[0] = this.dataToProcess[0].slice(size);
        }
        // If the bytes we want to read span more than one entry in the dataToProcess array
        else {
            result = Buffer.allocUnsafe(size);
            var offset = 0;
            var length;

            while(size > 0) {
                length = this.dataToProcess[0].length;

                if(size >= length) {
                    this.dataToProcess[0].copy(result, offset);
                    offset += length;
                    this.dataToProcess.shift();
                }
                else {
                    this.dataToProcess[0].copy(result, offset, 0, size);
                    this.dataToProcess[0] = this.dataToProcess[0].slice(size);
                }

                size -= length;
            }
        }

        return result;
    }

    getIncomingMessageClassDefinition() {
        let incomingMessageClassDefinition = null;

        // Grab the first seven characters of the string
        // app.log('this.dataToProcess', this.dataToProcess[0]);
        let firstSevenCharacters = this.dataToProcess[0].slice(0, 7).toString();
        // app.log('firstSevenCharacters', firstSevenCharacters);

        // If the first seven characters start with HTTP, it is an HttpResponseMessage
        if(firstSevenCharacters.startsWith('HTTP')) {
            incomingMessageClassDefinition = HttpResponseMessage;
        }
        // If the first seven characters do not start with HTTP, then it must be an HttpRequestMessage
        else {
            // Loop through the HTTP request methods to see if the message starts with one of them
            HttpRequestMessage.methods.each(function(methodKey, methodString) {
                if(firstSevenCharacters.startsWith(methodString)) {
                    // app.log('firstSevenCharacters', firstSevenCharacters, 'matches method', methodString);
                    incomingMessageClassDefinition = HttpRequestMessage;
                    return false; // break
                }
            });
        }

        return incomingMessageClassDefinition
    }

    emitMessage() {
        // If the body is JSON, decode it and save it to the .data property
        if(Json.is(this.incomingMessage.body)) {
            this.incomingMessage.data = Json.decode(this.incomingMessage.body);
        }

        // Set the message properties using the headers
        this.incomingMessage.setPropertiesUsingHeaders();

        // app.log('emitMessage!', this.incomingMessage);
        this.emit('message', this.incomingMessage);

        // Keep track of how many messages we have emitted
        this.messagesEmitted++;

        // Reset the incoming message
        this.incomingMessageClassDefinition = null;
        this.incomingMessageCurrentStructureIndex = null;
        this.incomingMessageCurrentStructureProperty = null;
        this.incomingMessage = null;
    }
    
}

// Export
export { HttpMessageGenerator };
