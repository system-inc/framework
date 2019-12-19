// Dependencies


// Class
class Message {

    connection = null;

    constructor(connection) {
        this.connection = connection;
    }

    // Allow messages to be responded to
    async respond() {
        throw new Error('This method must be implemented by a child class.');
    }

    static is(value) {
		return Class.isInstance(value, Message);
    }
    
}

// Export
export default Message;
