RarBlockHeader = Class.extend({

	rarFile: null,

	offset: null,
	sizeInBytes: null,

	crc32: null,
	typeInteger: null,
	type: null,
	flags: null,
	blockSizeInBytes: null,
	partial: null,
	continuesFrom: null,
	continues: null,
	archivedSizeInBytes: null,
	extractedSizeInBytes: null,
	dataCrc32: null,
	time: null,
	operatingSystem: null,
	version: null,
	archiveMethodInteger: null,
	archiveMethod: null,
	encrypted: null,
	path: null,
	name: null,

	construct: function(rarFile) {
		this.rarFile = rarFile;
	},

	initializeFromBuffer: function*(buffer, offset) {
		this.offset = offset;

		this.crc32 = buffer.readUInt16LE(0);
		this.typeInteger = buffer.readUInt8(2);

		if(RarBlockHeader.typeMap[this.typeInteger]) {
			this.type = RarBlockHeader.typeMap[this.typeInteger];	
		}

		this.flags = buffer.readUInt16LE(3);
		this.blockSizeInBytes = buffer.readUInt16LE(5);
		//Console.out('this.sizeInBytes', this.sizeInBytes);
		if((this.flags & 0x8000) !== 0) {
			this.blockSizeInBytes += buffer.readUInt32LE(7);
			//Console.out('changing this.sizeInBytes', this.sizeInBytes);
		}

		// Handle rarred file system object headers
		if(this.type == 'rarredFileSystemObjectHeader') {
			var moreBuffer = yield this.rarFile.readToBuffer(this.blockSizeInBytes, offset);
			
			this.partial = ((this.flags & 0x01) !== 0 || (this.flags & 0x02) !== 0);
			this.continuesFrom = ((this.flags & 0x01) !== 0);
			this.continues = ((this.flags & 0x02) !== 0);
			this.archivedSizeInBytes = moreBuffer.readUInt32LE(7);
			this.extractedSizeInBytes = moreBuffer.readUInt32LE(11);
			this.dataCrc32 = moreBuffer.readUInt32LE(16);
			this.time = (function() {
				var time = moreBuffer.readUInt32LE(20).toString(2);
				if(time.length < 32) {
					time = (new Array(32 - time.length + 1)).join('0') + time;
				}
				time = time.match(/(\d{7})(\d{4})(\d{5})(\d{5})(\d{6})(\d{5})/).slice(1).map(function(val) {
					return parseInt(val, 2);
				});
				return new Date(1980 + time[0], time[1] - 1, time[2], time[3], time[4], time[5]);
			})();

			// TODO this is wrong
			this.timeModified = new Time(this.time);

			this.operatingSystem = (function() {
				var operatingSystem = moreBuffer.readUInt8(15);
				switch(operatingSystem) {
					case 0: return 'MS-DOS';
					case 1: return 'OS/2';
					case 2: return 'Windows';
					case 3: return 'Unix';
					case 4: return 'Mac';
					case 5: return 'BeOS';
				}
			})();
			this.version = moreBuffer.readUInt8(24);
			this.archiveMethodInteger = moreBuffer.readUInt8(25);
			if(RarBlockHeader.archiveMethodMap[this.archiveMethodInteger]) {
				this.archiveMethod = RarBlockHeader.archiveMethodMap[this.archiveMethodInteger];
			}
			this.encrypted = ((this.flags & 0x04) !== 0);
			var nameSize = moreBuffer.readUInt16LE(26);
			if((this.flags & 0x100) !== 0) {
				this.archivedSizeInBytes += moreBuffer.readUInt32LE(32) * 0x100000000;
				this.extractedSizeInBytes += moreBuffer.readUInt32LE(36) * 0x100000000;
				this.path = moreBuffer.toString(null, 40, 40 + nameSize);
			}
			else {
				this.path = moreBuffer.toString(null, 32, 32 + nameSize);
			}
			//Console.out('this.path', this.path);

			if((this.flags & 0x200) !== 0 && this.path.indexOf('\x00') !== -1) {
				this.path = this.path.split('\x00')[1];
			}

			// Force using forward slashes
			this.path = this.path.replace("\\", '/');

			this.name = this.path;
			if(this.name.indexOf('\\') !== -1) {
				this.name = this.name.substr(this.name.lastIndexOf('\\') + 1);
			}
			else {
				this.name = this.name.substr(this.name.lastIndexOf('/') + 1);
			}
		}
		else {
			this.archivedSizeInBytes = 0;
			this.extractedSizeInBytes = 0;
		}

		this.sizeInBytes = this.blockSizeInBytes - this.archivedSizeInBytes;

		//Console.out('Found', this.path, 'at offset', this.offset, 'header size', this.sizeInBytes, 'block size', this.blockSizeInBytes, 'file bytes', this.archivedSizeInBytes, 'archiveMethod', this.archiveMethod, this.archiveMethodInteger, this.version);

		return this;
	},

});

// Static properties
RarBlockHeader.sizeInBytes = 11;
RarBlockHeader.typeMap = {
	0x72: 'markerBlock',
	0x73: 'archiveHeader',
	0x74: 'rarredFileSystemObjectHeader',
	0x75: 'legacyCommentHeader',
	0x76: 'legacyAuthenticityInformation',
	0x77: 'legacySubBlock',
	0x78: 'legacyRecoveryRecord',
	0x79: 'legacyAuthenticityInformation',
	0x7a: 'subBlock',
	0x7b: 'terminator',
};
RarBlockHeader.archiveMethodMap = {
	0x30: 'store',
	0x31: 'fastest',
	0x32: 'fast',
	0x33: 'normal',
	0x34: 'good',
	0x35: 'best',
};