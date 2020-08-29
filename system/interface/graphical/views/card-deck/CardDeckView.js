// Dependencies
import { View } from '@framework/system/interface/graphical/views/View.js';
// import { CardView } from '@framework/system/interface/graphical/views/card-deck/CardView.js';

// Class
class CardDeckView extends View {
    
    cards = [];

    deckView  = null;

    constructor() {
        super();
    }

    // addCard(imageUrl, titleString, titleDescriptorString, titleDescriptorString, descriptionString, url, data) {
    //     let cardView = new CardView(imageUrl, titleString, titleDescriptorString, titleDescriptorString, descriptionString, url, data);
    //     this.append()
    // }

}

// Export
export { CardDeckView };
