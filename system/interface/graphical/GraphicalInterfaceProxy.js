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
			identifier: null,
			parentIdentifier: null,
			childrenIdentifiers: null,
		};
	}

	sendMessage(key, value) {
		var sourceGraphicalInterface = null;

		var messages = LocalStorage.get('app.interfaces.graphical.'+this.identifier+'.messages');

		if(!messages) {
			messages = [];
		}

		messages.append({
			sourceIdentifier: app.interfaces.graphical.identifier,
			identifier: key,
			value: value,
		});

		LocalStorage.set('app.interfaces.graphical.'+this.identifier+'.messages', messages);
	}

	receiveMessage(message) {
		this.emit(message.identifier, message);
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
