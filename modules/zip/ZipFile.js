ZipFile = File.extend({

	fileSystemObjectReferences: [],

	construct: function() {
		this.super.apply(this, arguments);

		this.admZip = new ZipModule.AdmZip(this.path);
	},
	
	getFileSystemObjectReferences: function() {
		var fileSystemObjectReferences = []

		var admZipEntries = this.admZip.getEntries();

		admZipEntries.each(function(key, value) {
			Console.out(value.entryName);
		});

		// Console.highlight(admZipEntries);
	},

});