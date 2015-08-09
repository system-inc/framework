RarFileHeader = Class.extend({

	rarFile: null,

	signature: null,

	crc32: null,
	sizeInBytes: null,
	type: null,
	flags: null,
	extraAreaSize: null,
	archiveFlags: null,
	volumeNumber: null,
	extraArea: null,

	offsetToFirstRarBlockHeader: null,

	construct: function(rarFile) {
		this.rarFile = rarFile;
	},

	read: function*() {
		// Initialize the status on the rar file if we need to
		if(!this.rarFile.statusInitialized) {
			yield this.rarFile.initializeStatus();
		}

		// Make sure the rar file has a size and meets the minimum size requirement
		if(!this.rarFile.size || this.rarFile.sizeInBytes() < RarFile.minimumSizeInBytes) {
			throw new Error('Invalid RAR file. A RAR file must be at least '+RarFile.minimumSizeInBytes+' bytes, the file provided is '+this.rarFile.size+' bytes.');
		}
		//Console.out('this.rarFile.sizeInBytes', this.rarFile.sizeInBytes());

		// Read the header bytes
		var buffer = yield this.rarFile.readToBuffer(14, 0);

		// Check for a valid signature
		var potentialSignature = buffer.readIntBE(0, 7);
		RarFile.signatures.each(function(index, signature) {
			if(potentialSignature == signature.signature) {
				this.signature = signature;
			}
		}.bind(this));

		if(!this.signature) {
			throw new Error('Invalid RAR file. Could not locate a valid RAR file signature.');
		}

		this.crc32 = buffer.readUInt16LE(7),
		this.type = buffer.readUInt8(9);
		this.flags = buffer.readUInt16LE(10);
		this.sizeInBytes = buffer.readUInt16LE(12);

		if(this.type !== 0x73) {
			throw new Error('Invalid RAR file.');
		}

		if((this.flags & 0x80) !== 0) {
			throw new Error('Encrypted RAR archives are not supported.');
		}

		this.offsetToFirstRarBlockHeader = this.sizeInBytes + this.signature.sizeInBytes;

		return this;
	},

});