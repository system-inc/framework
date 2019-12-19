// Dependencies


// Class
class Message {

    connection = null;

    constructor(connection) {
        this.connection = connection;
    }

    async respond(messageOrData) {
        return this.connection.request(messageOrData, this);
    }

    static is(value) {
		return Class.isInstance(value, Message);
    }
    
}

// Export
export default Message;
