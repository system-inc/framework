// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';
import TextView from 'framework/system/interface/graphical/views/text/TextView.js';

import Proctor from 'framework/system/test/Proctor.js';
import FormView from 'framework/system/interface/graphical/views/forms/FormView.js';
import TableView from 'framework/system/interface/graphical/views/tables/TableView.js';

// Class
class ActivityContentView extends View {

	constructor() {
		super();

		this.setStyle({
			flex: '1',
			//background: 'red',
			overflow: 'scroll',
			paddingTop: '.75rem',
			paddingLeft: '.75rem',
			paddingRight: '.75rem',
		});

		//this.append(new TextView('ActivityContentView'+(String.random(10)+' ').repeat(500)));
		this.append(new TextView('Tests'));

		this.appendTestsFormView();
	}

	async appendTestsFormView() {
        // Get all possible tests: Proctor.getTests(path, filePattern, methodPattern)
        //var tests = await Proctor.getTests();
        var tests = await Proctor.getTests(null, 'SingleLine');
        console.log('tests', tests);

        // Create a FormView
        var testsFormView = new FormView({
            submitButtonView: {
                content: 'Run Tests',
            },
        });
        console.log(testsFormView);

        //this.subviews.testsFormView.on('form.submit', function(event) {
        //    this.runTestMethods();
        //}.bind(this));

        //var summary = new TextView(this.tests.methods.length+' test methods in '+this.tests.classes.length+' tests');
        //testsFormView.append(summary);
        
        // Table for the tests
        //var tableView = new TableView();
        //tableView.setColumns(['Class', 'Method', 'Status', '']);
        
        //this.tests.methods.each(function(testMethodIndex, testMethod) {
        //    testMethod.runButton = new ButtonView('Run');
        //    testMethod.runButton.on('input.press', function(event) {
        //        this.runTestMethod(testMethod);
        //    }.bind(this));

        //    testMethod.statusSpan = Html.span('Not Started');

        //    tableView.addRow(testMethod.class.name, testMethod.name, testMethod.statusSpan, testMethod.runButton);
        //}.bind(this));

        //testsFormView.append(tableView);

        //app.log(tableView.getData());

        console.warn('append start');
        this.append(testsFormView);
        console.warn('append end');
    }

}

// Export
export default ActivityContentView;
