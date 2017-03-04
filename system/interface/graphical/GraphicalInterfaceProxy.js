// Dependencies
import EventEmitter from 'framework/system/event/EventEmitter.js';
import LocalStorage from 'framework/system/interface/graphical/web/data/LocalStorage.js';

// Class
class GraphicalInterfaceProxy extends EventEmitter {

	identifier = null;
	parentIdentifier = null;
	childrenIdentifiers = null;

	constructor(identifier, parentIdentifier = null, childrenIdentifiers = []) {
		super();

		this.identifier = identifier;
		this.parentIdentifier = parentIdentifier;
		this.childrenIdentifiers = childrenIdentifiers;
	}

	toObject() {
		return {
			identifier: this.identifier,
			parentIdentifier: this.parentIdentifier,
			childrenIdentifiers: this.childrenIdentifiers,
		};
	}

	openDeveloperTools() {

	}

	show() {

	}

	close() {
	}

}

// Export
export default GraphicalInterfaceProxy;
