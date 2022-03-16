// Class
class BlockchainAddress {

    address = null;

    constructor(address) {
        this.address = address;
    }

    uppercase() {
        return BlockchainAddress.uppercase(this.address);
    }

    abbreviate() {
        return BlockchainAddress.abbreviate(this.address);
    }

    toString() {
        return this.address;
    }

    static uppercase(address) {
        return '0x'+address.substring(2, address.length).toUpperCase();
    }

    static abbreviate(address) {
        if(!address) {
            return '????...????';
        }

        return '0x'+(address.substring(2, 6)+'...'+address.substring(address.length - 4, address.length)).toUpperCase();
    }

}

// Export
export { BlockchainAddress };
