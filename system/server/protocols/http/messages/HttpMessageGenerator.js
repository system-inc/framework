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
            // app.log('at the body');

            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Length
            let contentLength = this.incomingMessage.headers.get('content-length');

            // https://en.wikipedia.org/wiki/Chunked_transfer_encoding
            let transferEncoding = this.incomingMessage.headers.get('transfer-encoding');
            
            // If a content length was specified and we have enough bytes to read it
            if(contentLength !== null && this.dataToProcessSizeInBytes >= contentLength) {
                this.incomingMessage.body = this.readFromDataToProcess(contentLength);
            }
            // If we are using chunked transfer encoding
            else if(transferEncoding == 'chunked') {
                // The data until the next boundary will be the chunk size in bytes
                let chunkSize = this.readFromDataToProcessToBoundary("\r\n");
                app.log('chunkSize', chunkSize);
            }
            // If the content length is null, read until the body boundary (\r\n\r\n)
            else {
                this.incomingMessage.body = this.readFromDataToProcessToBoundary(this.incomingMessageClassDefinition.structure.body.boundary);
                app.log('No content length set, body is', this.incomingMessage.body);
            }

            // If the body is not null
            if(this.incomingMessage.body !== null) {
                // If the body is JSON, decode it and save it to the .data property
                if(Json.is(this.incomingMessage.body)) {
                    this.incomingMessage.data = Json.decode(this.incomingMessage.body);
                }

                // If there are no trailers, emit the message
                let trailer = this.incomingMessage.headers.get('trailer');
                if(!trailer) {
                    return this.emitMessage();
                }
            }
        }
        // If we are reading the trailers
        else if(this.incomingMessageCurrentStructureProperty == 'trailers') {
            let trailer = this.incomingMessage.headers.get('trailer');

            // If there are no trailers to read
            if(!trailer) {
                // Emit the message
                return this.emitMessage();
            }
        }
        // If we are reading the headers and there are no headers then the request is over
        else if(this.incomingMessageCurrentStructureProperty == 'headers' && this.dataToProcessSizeInBytes == 2 && this.dataToProcess[0].toString() == "\r\n") {
            // Emit the message
            return this.emitMessage();
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
                    dataUpToBoundary = Number(dataUpToBoundary);
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
                    this.incomingMessage.setPropertiesUsingHeaders();

                    // If there are no more bytes to process, then the request is over
                    if(this.dataToProcessSizeInBytes === 0) {
                        // Emit the message
                        return this.emitMessage();
                    }
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
    
                // Recurse if there are more bytes to process
                if(this.dataToProcessSizeInBytes > 0) {
                    return this.processData();
                }
            }
        }

        // app.log('this.incomingMessage', this.incomingMessage);
    }

    nextStructureIndex() {
        this.incomingMessageCurrentStructureIndex++;
        this.incomingMessageCurrentStructureProperty = this.incomingMessageClassDefinition.structure.getKeys().nth(this.incomingMessageCurrentStructureIndex);
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
