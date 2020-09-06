// Dependencies
import { Datastore } from '@framework/system/datastore/Datastore.js';

// Class
class AppDatastore extends Datastore {

    // TODO: Make this persist in local storage on the web or as a file in Node
    // We will want to create AppDatastore.js and AppSessionDatastore.js
    // which use the adapter pattern to create underlying datastores based on context
    // See framework/system/interface/graphical/web/data/LocalStorage.js

}

// Export
export { AppDatastore };
