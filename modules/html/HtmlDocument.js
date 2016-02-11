HtmlDocument = XmlDocument.extend({

	type: 'html',

	domDocument: null,
	isAppliedToDom: false,
	afterAppliedToDom: null,

	element: null,
	head: null,
	body: null,

	titleHtmlElement: null,

	shouldScheduleDomUpdates: true,
	//shouldScheduleDomUpdates: false,
	domUpdatesScheduled: false,
	domUpdates: {},

	construct: function(declaration) {
		// Set the declaration
		if(declaration) {
			this.declaration = declaration;
		}
		else {
			this.declaration = '<!DOCTYPE '+this.type+'>';	
		}

		// An <html> tag to store the head and body
		this.element = Html.html();

		// Establish a reference to the HtmlDocument
		this.element.htmlDocument = this;

		// Create the head and body tags
		this.head = Html.head();
		this.body = Html.body();

		// If we the DOM is present, reference the DOM document
		if(global['document']) {
			// Connect this.domDocument to the global document
			this.domDocument = document;
			//console.log('DOM present, HtmlDocument connected to DOM', this);

			// Manually connect this <html> HtmlElement to document.documentElement
			this.element.domNode = this.domDocument.documentElement;

			// Manually connect the head and body domNode's to the domDocument's head and body properties
			this.head.domNode = this.domDocument.head;
			this.body.domNode = this.domDocument.body;
		}

		this.element.append(this.head);
		this.element.append(this.body);

		// Manually set the <html> tag to the children array
		this.children = [
			this.element,
		];
	},

	on: function(eventName, callback) {
		// Allow the method to be called statically
		if(this.domDocument) {
			domDocument = this.domDocument;
		}
		else {
			domDocument = document;
		}
		//console.log('on', eventName, domDocument);

		if(domDocument) {
			// Alias ready to DOMContentLoaded
			if(eventName == 'ready') {
				eventName = 'DOMContentLoaded';
			}

			// If they want to use the custom afterAppliedToDom event
			if(eventName == 'afterAppliedToDom') {
				if(!this.afterAppliedToDom) {
					this.afterAppliedToDom = callback;
				}
				else if(Function.is(this.afterAppliedToDom)) {
					// Wrap the current function in an array
					this.afterAppliedToDom = [this.afterAppliedToDom];

					// Add the new callback to the array
					this.afterAppliedToDom.append(callback);
				}
				else if(Array.is(this.afterAppliedToDom)) {
					this.afterAppliedToDom.append(callback);
				}
			}
			// If the document is already ready, just run the function
			else if(eventName == 'DOMContentLoaded' && domDocument.readyState == 'complete') {
				//console.log('DOM already ready (readyState is complete)', callback);
				callback();
			}
			// If the document isn't ready, add an event listener
			else {
				//console.log('addEventListener', eventName, callback);
				domDocument.addEventListener(eventName, callback);
			}			
		}
	},

	ready: function(callback) {
		HtmlDocument.on('ready', callback);
	},

	applyToDom: function() {
		//console.log('HtmlDocument.applyToDom', this);

		// Add this.element to the DOM
		this.element.executeDomUpdate();

		// At this point the HtmlDocument has been added to the DOM
		this.appliedToDom();
	},

	appliedToDom: function() {
		//console.log('HtmlDocument.appliedToDom', this);

		// The HtmlDocument is now added to the DOM
		this.isAppliedToDom = true;

		if(Function.is(this.afterAppliedToDom)) {
			this.afterAppliedToDom();
		}
		else if(Array.is(this.afterAppliedToDom)) {
			this.afterAppliedToDom.each(function(index, callback) {
				callback();
			});
		}

		//this.printDomUpdates();

		// Now that all of the callbacks have run, execute any pending DOM updates
		this.executeDomUpdates();
	},

	printDomUpdates: function() {
		console.info('**************************************')
		console.info('Pending DOM Updates:')

		if(Object.isEmpty(this.domUpdates)) {
			console.info('No updates.');
		}
		else {
			this.domUpdates.each(function(htmlNodeIdentifier, htmlNode) {
				console.info(htmlNodeIdentifier, htmlNode.tag, Json.encode(htmlNode.attributes));
			});
		}
		console.info('**************************************')
	},

	updateDom: function(htmlNode) {
		//console.log('HtmlDocument.updateDom', htmlNode);
		//console.log('HtmlDocument.shouldScheduleDomUpdates', this.shouldScheduleDomUpdates);

		// Do nothing if the HtmlDocument is not added to the DOM yet
		if(!this.isAppliedToDom) {
			//console.info('HtmlDocument.updateDom ignored because HtmlDocument.isAppliedToDom is false');
		}
		// If DOM update scheduling is enabled
		else if(this.shouldScheduleDomUpdates) {
			this.scheduleDomUpdate(htmlNode);
		}
		// If not, immediately update the DOM
		else {
			htmlNode.executeDomUpdate();
		}
	},

	scheduleDomUpdate: function(htmlNode) {
		console.log('HtmlDocument.scheduleDomUpdate', htmlNode.tag, Json.encode(htmlNode.attributes));

		// Add the HtmlElement to the list of updates to do
		if(htmlNode) {
			// Use an object instead of an array so we get the speed of the hash table for deduping updates
			console.error('my identifiers are wrong so my updates will fail');
			this.domUpdates[htmlNode.identifier] = htmlNode;
		}

		// If an update isn't scheduled already, use the next animation frame to run all updates
		if(!this.domUpdatesScheduled) {
			//console.log('scheduling executeDomUpdates');
			this.domUpdatesScheduled = true;

			window.requestAnimationFrame(function() {
				//console.info('window.requestAnimationFrame');
				this.executeDomUpdates();
			}.bind(this));	
		}
		else {
			//console.log('executeDomUpdates already scheduled')
		}

		//console.log('this.domUpdates', this.domUpdates);
	},

	executeDomUpdates: function() {
		//console.log('HtmlDocument.executeDomUpdates', 'this.domUpdates', this.domUpdates);

		// Iterate over all DOM updates
		this.domUpdates.each(function(htmlNodeIdentifier, htmlNode) {
			// Run the DOM updates for the HtmlElement
			htmlNode.executeDomUpdate();

			// Remove the HtmlElement from the domUpdates objects
			delete this.domUpdates[htmlNodeIdentifier];
		}.bind(this));

		// Mark all updates as completed
		this.domUpdatesScheduled = false;
	},

	setTitle: function(title) {
		// Create the title tag if it doesn't exist
		if(!this.titleHtmlElement) {
			this.titleHtmlElement = Html.title(title);
			this.head.append(this.titleHtmlElement);
		}
		// If it title tag does exist, use domDocument to change it
		else if(this.domDocument) {
			this.domDocument.title = title;
		}
	},

	addScript: function(path) {
		this.head.append(Html.script({
			src: path,
		}));
	},

	addStyleSheet: function(path) {
		this.head.append(Html.link({
			rel: 'stylesheet',
			href: path,
		}));
	},

});

// Static methods
HtmlDocument.on = HtmlDocument.prototype.on;
HtmlDocument.ready = HtmlDocument.prototype.ready;