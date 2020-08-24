// Dependencies


// Class
class Message {

    identifier = null;
    connection = null;

    constructor(connection) {
        this.connection = connection;
        this.identifier = String.uniqueIdentifier();
    }

    async respond(messageOrData) {
        return this.connection.request(messageOrData, this);
    }

    static is(value) {
		return Class.isInstance(value, Message);
    }
    
}

// Export
export { Message };
