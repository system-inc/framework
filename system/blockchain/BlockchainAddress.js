// Class
class BlockchainAddress {

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
