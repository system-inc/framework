RarTest = Test.extend({

	testReadFromPath: function*() {
		var rarFilePath = Node.Path.join(__dirname, 'files', 'rar-with-comment.rar');
		//var rarFilePath = '/Users/kirkouimet/Desktop/Share/comic.cbz';
		//var rarFilePath = 'C:\\Users\\Kirk Ouimet\\Desktop\\Share\\Test Folder 1\\comic.cbz';
		//Console.out(rarFilePath);

		// Read the rar file from disk
		var rarFile = new RarFile(rarFilePath);
		//Console.out(rarFile);

		// List the rar file's contents
		var rarredFileSystemObjects = yield rarFile.list();
		//Node.exit(rarredFileSystemObjects);

		var firstRarredFileSystemObject = rarredFileSystemObjects.first();
		//Console.out(firstRarredFileSystemObject.path);
		var firstRarredFileSystemObjectStream = yield firstRarredFileSystemObject.toReadStream();
		var firstRarredFileSystemObjectStreamString = yield firstRarredFileSystemObjectStream.toString();
		//Console.out(firstRarredFileSystemObjectStreamString);
		Assert.equal(firstRarredFileSystemObjectStreamString, "File B!\r\n\r\nWowza.", 'Extracts first file stored with archive method "store"');

		var secondRarredFileSystemObject = rarredFileSystemObjects.second();
		//Console.out(secondRarredFileSystemObject.path);
		var secondRarredFileSystemObjectStream = yield secondRarredFileSystemObject.toReadStream();
		var secondRarredFileSystemObjectStreamString = yield secondRarredFileSystemObjectStream.toString();
		//Console.out(secondRarredFileSystemObjectStreamString);
		Assert.equal(secondRarredFileSystemObjectStreamString, "File C!\r\n\r\nYay.", 'Extracts second file stored with archive method "store"');

		var thirdRarredFileSystemObject = rarredFileSystemObjects.third();
		//Console.out(thirdRarredFileSystemObject.path);
		var thirdRarredFileSystemObjectStream = yield thirdRarredFileSystemObject.toReadStream();
		var thirdRarredFileSystemObjectStreamString = yield thirdRarredFileSystemObjectStream.toString();
		//Console.out(thirdRarredFileSystemObjectStreamString);
		Assert.equal(thirdRarredFileSystemObjectStreamString, "File D!\r\n\r\nWoo hoo.", 'Extracts third file stored with archive method "store"');
	},

	testAllRarArchiveMethods: function*() {
		var files = [
			'rar-archive-method-store.rar',
			'rar-archive-method-fast.rar',
			'rar-archive-method-fastest.rar',
			'rar-archive-method-normal.rar',
			'rar-archive-method-good.rar',
			'rar-archive-method-best.rar',
		];

		yield files.each(function*(index, file) {
			var rarFilePath = Node.Path.join(__dirname, 'files', file);
			var rarFile = new RarFile(rarFilePath);
			var rarredFileSystemObjects = yield rarFile.list();
			var firstRarredFileSystemObject = rarredFileSystemObjects.first();
			var firstRarredFileSystemObjectStream = yield firstRarredFileSystemObject.toReadStream();
			//Console.out(firstRarredFileSystemObjectStream);
			var firstRarredFileSystemObjectStreamString = yield firstRarredFileSystemObjectStream.toString();
			//Console.out(firstRarredFileSystemObjectStreamString);

			Assert.equal(firstRarredFileSystemObjectStreamString, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum posuere arcu non ultrices rutrum. Sed faucibus volutpat sagittis. Phasellus nec egestas quam. Integer lacus arcu, vestibulum eget quam vitae, varius tincidunt nisi. Morbi in mi eu leo condimentum tincidunt vel sit amet ipsum. Vestibulum vehicula leo ante, sit amet tincidunt libero porta id. Phasellus sed elit sed purus aliquet euismod vel a tortor.\r\n\r\nSed tincidunt ipsum ac sollicitudin maximus. In hac habitasse platea dictumst. Nullam quis pulvinar massa. Mauris congue convallis arcu, eu porttitor tellus interdum non. Nam maximus felis quis tortor ullamcorper auctor. Nulla lacinia erat in eleifend fermentum. Praesent nec eleifend orci, vel maximus magna. Nam iaculis et sem rutrum convallis. In quis bibendum ante, sed ullamcorper felis. Integer eleifend at purus vitae dignissim. Praesent vel lorem sodales, venenatis massa sed, aliquet ipsum. Pellentesque lacus nibh, rutrum ut leo eu, dignissim cursus purus. Phasellus neque erat, viverra nec metus eleifend, posuere ultrices ante. Ut consequat tellus quis leo consequat molestie. Vivamus vitae sollicitudin urna. Fusce congue nisl id velit hendrerit mollis.\r\n\r\nSed eget eros neque. Etiam et justo at nibh tempus aliquam. Praesent pellentesque lacinia est at tempus. Ut nec congue augue. Nunc commodo ligula at ligula fermentum, ac bibendum erat fermentum. Quisque a tellus tortor. Quisque quis dapibus quam. Nunc ac posuere massa. Nullam nisl dui, malesuada ac sem nec, semper elementum augue. Pellentesque nec ex est. Vestibulum tincidunt tellus non orci fermentum, ac ultrices odio porttitor. Phasellus tempor blandit nulla, eu suscipit augue pretium sit amet. Nam quis tortor ut eros auctor interdum non rutrum velit.\r\n\r\nIn blandit mauris ex, sed posuere enim ullamcorper in. Integer et sem risus. Aenean faucibus elit sed elit pulvinar, a lacinia nulla egestas. Pellentesque a erat in arcu condimentum vulputate non non ligula. Morbi aliquet eu augue ac eleifend. Quisque sed vestibulum arcu. Phasellus suscipit sapien tortor, vulputate viverra ante efficitur nec. Quisque purus felis, dapibus in feugiat quis, pellentesque ut ligula. Aenean tempus, velit eget placerat elementum, nibh nibh commodo est, quis consectetur quam neque nec elit. Phasellus non neque et lorem consequat iaculis vitae in est. Nam blandit nibh vitae lorem condimentum, non semper quam euismod. Etiam sit amet ante nec nunc aliquet varius at at ex. Fusce et urna ac erat pharetra finibus eget eu mauris.\r\n\r\nIn eleifend ac dui id lacinia. Fusce vel molestie dolor, bibendum convallis ante. Etiam non faucibus mauris, in rutrum odio. Nam tincidunt felis sed ultrices tempus. Vivamus at nisi sed urna commodo cursus quis tincidunt tellus. Pellentesque id risus in sapien sagittis tristique ac in mauris. Donec eu consectetur felis. Aliquam ac aliquet mauris, ac malesuada elit. Integer porta ultricies felis in rhoncus. Nulla pharetra nec purus ac hendrerit. Curabitur ac efficitur nisl. Ut vitae diam id est malesuada lacinia eu eu mauris.", 'Extracts text file with archive method '+firstRarredFileSystemObject.archiveMethod);
		});
	},

	//testAllRar5ArchiveMethods: function*() {
	//	var files = [
	//		'rar5-archive-method-best.rar',
	//		'rar5-archive-method-fast.rar',
	//		'rar5-archive-method-fastest.rar',
	//		'rar5-archive-method-good.rar',
	//		'rar5-archive-method-normal.rar',
	//		'rar5-archive-method-store.rar',
	//	];
	//},

});