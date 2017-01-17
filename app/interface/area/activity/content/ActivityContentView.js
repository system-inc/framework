// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';
import TextView from 'framework/system/interface/graphical/views/text/TextView.js';
import HeadingView from 'framework/system/interface/graphical/views/text/HeadingView.js';

import Proctor from 'framework/system/test/Proctor.js';
import FormView from 'framework/system/interface/graphical/views/forms/FormView.js';
import ButtonView from 'framework/system/interface/graphical/views/buttons/ButtonView.js';
import TableView from 'framework/system/interface/graphical/views/tables/TableView.js';

// Class
class ActivityContentView extends View {

	constructor() {
		super();

		this.setStyle({
			flex: '1',
			overflow: 'scroll',
			padding: '1rem',
            fontSize: '.8em',
		});

		this.appendTestsFormView();
	}

	async appendTestsFormView() {
        // Get all possible tests: Proctor.getTests(path, filePattern, methodPattern)
        //var tests = await Proctor.getTests();
        //var tests = await Proctor.getTests(null, 'SingleLine');
        var tests = await Proctor.getTests(null, 'String');
        console.log('tests', tests);

        // Create a FormView
        var testsFormView = new FormView({
            submitButtonView: {
                content: 'Run Tests',
            },
        });

        testsFormView.on('form.submit', function(event) {
            console.info('run test methods');
            //this.runTestMethods();
        }.bind(this));

        var summary = new TextView(tests.methods.length+' test methods in '+tests.classes.length+' tests');
        testsFormView.append(summary);
        
        // Table for the tests
        var tableView = new TableView();
        tableView.setColumns(['Class', 'Method', 'Status', '']);
        
        // Add each test
        tests.methods.each(function(testMethodIndex, testMethod) {
            testMethod.statusText = 'Not Started';

            testMethod.runButton = new ButtonView('Run');
            testMethod.runButton.on('input.press', function(event) {
                console.info('run test', testMethod);
                //this.runTestMethod(testMethod);
            }.bind(this));

            tableView.addRow(testMethod.class.name, testMethod.name, testMethod.statusText, testMethod.runButton);
        }.bind(this));

        testsFormView.append(tableView);

        //console.log('tableView.getData', tableView.getData());

        this.append(testsFormView);
    }

}

// Export
export default ActivityContentView;
