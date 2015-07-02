ZipModule = Module.extend({

	AdmZip: null,

	version: new Version('0.1.0'),

	uses: [
		'ZipFile',
		'ZipFileSystemObjectReference',
	],

	construct: function(moduleName) {
		this.super.apply(this, arguments);

		// Load in the adm-zip library
		this.AdmZip = Framework.require(Project.framework.directory+'libraries'+Node.Path.separator+'adm-zip'+Node.Path.separator+'adm-zip.js');
	},
	
});