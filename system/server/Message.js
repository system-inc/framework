// Dependencies


// Class
class Message {

    identifier = null;
    connection = null;

    constructor(connection = null) {
        this.connection = connection;
        this.identifier = String.uniqueIdentifier();
    }

    async respond(messageOrData) {
        //app.log('Message.respond this.connecton', this.connection); app.exit();
        return this.connection.respond(messageOrData, this);
    }

    static is(value) {
		return Class.isInstance(value, Message);
    }
    
}

// Export
export { Message };
