ModelManagerTest = Test.extend({

	testAddPropertyToModel: function() {
		Assert.equal('1', '1');

		var UserModel = Model.extend({});
		var newUserModel = new UserModel();

		var idModelProperty = new ModelProperty();
		idModelProperty.name = 'id';

		//ModelManager.addPropertyToModel(idModelProperty, UserModel);

		Console.out('Model', Model);
		// THIS IS WEIRD, I CANNOT PASS REFERENCES TO CLASSES?
		Console.out('usermodel', UserModel);
	},

});