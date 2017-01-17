// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';
import HeadingView from 'framework/system/interface/graphical/views/text/HeadingView.js';
import LinkView from 'framework/system/interface/graphical/views/links/LinkView.js';
import FormView from 'framework/system/interface/graphical/views/forms/FormView.js';
import SingleLineTextFormFieldView from 'framework/system/interface/graphical/views/forms/fields/text/single-line/SingleLineTextFormFieldView.js';
import LinkListView from 'framework/system/interface/graphical/views/lists/LinkListView.js';

// Class
class HeaderView extends View {

	constructor() {
		super();

		this.setStyle({
			flex: '0 1 48px',
			display: 'flex',
			alignItems: 'center',
			//borderBottom: '1px solid #CCC',
			//background: '#666',
			background: 'rgb(60, 120, 220)',
			padding: '0 1rem',
		});

		// Framework
		var frameworkHeading = new HeadingView(new LinkView('Framework'));
		frameworkHeading.setStyle({
			fontWeight: '500',
			margin: '0 1em 0 0',
			color: '#FFF',
		});
		this.append(frameworkHeading);

		// App
		var appHeadingLink = new LinkView('App');
		appHeadingLink.addClass('icon caret');
		var appHeading = new HeadingView(appHeadingLink);
		appHeading.setStyle({
			fontWeight: '300',
			margin: 0,
			color: '#FFF',
		});
		this.append(appHeading);

		// Activity bookmarks
		var activityBookmarksLinkListView = new LinkListView();
		activityBookmarksLinkListView.setDirection('horizontal');
		activityBookmarksLinkListView.addItem('1');
		activityBookmarksLinkListView.addItem('2');
		activityBookmarksLinkListView.addItem('3');
		this.append(activityBookmarksLinkListView);

		// Search form
		var searchFormView = new FormView({
			submitButtonView: {
				enabled: false,
			},
		});
		searchFormView.setStyle({
			margin: '0 0 0 auto',
		});
		var singleLineTextFormFieldView = new SingleLineTextFormFieldView();
		singleLineTextFormFieldView.formControlView.setStyle({
			background: '#FFF',
			fontSize: '.8em',
			padding: '.25em',
		});
		searchFormView.addFormFieldView(singleLineTextFormFieldView);
		this.append(searchFormView);

		// Settings
		var settingsLinkView = new LinkView();
		settingsLinkView.setStyle({
			width: '1.75em',
			height: '1.75em',
			borderRadius: '1.75em',
			background: '#FFF',
			margin: '0 0 0 .5em',
		});
		this.append(settingsLinkView);

		// User
		var userLink = new LinkView();
		userLink.setStyle({
			width: '1.75em',
			height: '1.75em',
			borderRadius: '1.75em',
			background: '#FFF',
			margin: '0 0 0 .5em',
		});
		this.append(userLink);
	}

}

// Export
export default HeaderView;
