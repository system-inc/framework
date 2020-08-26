// Dependencies
import { View } from '@framework/system/interface/graphical/views/View.js';
import { Settings } from '@framework/system/settings/Settings.js';

// Class
class CarouselView extends View {

    
    itemsContainerView = null;
    itemViews = [];

    controlsContainerView = null;
    controlsView = null;

    currentIndex = 0;

	settings = new Settings({
	});

	constructor(viewsForItemViews, settings) {
        super();
        this.settings.merge(settings);

        // Create the items view
        this.createItemViewsContainerView(viewsForItemViews);

        // Create the controls view
        this.createControlsContainerView();
    }

    createItemViewsContainerView(viewsForItemViews) {
        // Create the container for the containers
        this.itemsContainerView = new View().addClass('carouselItemsContainer');
        this.append(this.itemsContainerView);

        // Create item views for each of the provided views
        viewsForItemViews.each(function(index, viewForItemView) {
            // Create the views but do not add them to the DOM
            this.itemViews.append(new View(viewForItemView).addClass('carouselItemContainer'));
        }.bind(this));

        // Make the first item view visible by appending it to the container view
        this.showCurrentItem();
    }

    createControlsContainerView() {
        // Create the controls for the carousel
        this.controlsContainerView = new View().addClass('carouselControlsContainer');

        this.controlsView = new View().addClass('carouselControls');
        this.controlsContainerView.append(this.controlsView);
        
        // Previous
        var previousButtonView = new View('Previous').addClass('button previous');
        previousButtonView.on('input.press', function() {
            this.previous();
        }.bind(this));
        this.controlsView.append(previousButtonView);

        // Save
        var saveButtonView = new View('Save').addClass('button save');
        saveButtonView.on('input.press', function() {
            console.log('save!');
        }.bind(this));
        this.controlsView.append(saveButtonView);

        // Next
        var nextButtonView = new View('Next').addClass('button next');
        nextButtonView.on('input.press', function() {
            this.next();
        }.bind(this));
        this.controlsView.append(nextButtonView);

        this.append(this.controlsContainerView);
    }
    
    showCurrentItem() {
        // Remove the current item
        this.itemsContainerView.empty();

        // Attached the item at the current index
        this.itemsContainerView.append(this.itemViews[this.currentIndex]);
    }

    previous() {
        console.log('Carousel previous!');

        // Increment the current index
        this.currentIndex--;

        // Stop at the beginning
        if(this.currentIndex == -1) {
            this.currentIndex = 0;
        }

        this.showCurrentItem();
	}

	next() {
        console.log('Carousel next!');

        // Increment the current index
        this.currentIndex++;

        // Stop at the end
        if(this.currentIndex == this.itemViews.length) {
            this.currentIndex = this.itemViews.length - 1;
        }

        this.showCurrentItem();
    }

}

// Export
export { CarouselView };
