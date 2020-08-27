// Dependencies
import { View } from '@framework/system/interface/graphical/views/View.js';
import { Settings } from '@framework/system/settings/Settings.js';

// Class
class CarouselView extends View {

    
    itemsContainerView = null;
    itemViews = [];

    controlsContainerView = null;
    controlsView = null;
    previousButtonView = null;
    saveButtonView = null;
    nextButtonView = null;

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

        // Create keyboard controls
        this.createKeyboardControls();
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
        this.previousButtonView = new View('⬅').addClass('button previous');
        this.previousButtonView.on('input.press', function() {
            this.previous();
        }.bind(this));
        this.controlsView.append(this.previousButtonView);

        // Save
        this.saveButtonView = new View('♡').addClass('button save');
        this.saveButtonView.on('input.press', function() {
            this.save();
        }.bind(this));
        this.controlsView.append(this.saveButtonView);

        // Next
        this.nextButtonView = new View('⮕').addClass('button next');
        this.nextButtonView.on('input.press', function() {
            this.next();
        }.bind(this));
        this.controlsView.append(this.nextButtonView);

        this.append(this.controlsContainerView);
    }

    createKeyboardControls() {
        // Add keyboard controls
        this.setAttribute('tabindex', '0'); // This is required to make divs emit key events

        this.on('input.key.left', function(event) {
            this.previous();
        }.bind(this));

        this.on('input.key.right', function(event) {
            this.next();
        }.bind(this));

        this.on('input.key.up', function(event) {
            this.save();
        }.bind(this));

        // Focus on the element for keyboard events
        this.focus();
    }
    
    showCurrentItem() {
        // Remove the current item
        this.itemsContainerView.empty();

        // Attached the item at the current index
        this.itemsContainerView.append(this.itemViews[this.currentIndex]);
    }

    previous() {
        this.saveButtonView.removeClass('active');

        this.previousButtonView.addClass('activated');
        Function.delay(62, function() {
            this.previousButtonView.removeClass('activated');
        }.bind(this));
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
        this.saveButtonView.removeClass('active');

        this.nextButtonView.addClass('activated');
        Function.delay(62, function() {
            this.nextButtonView.removeClass('activated');
        }.bind(this));
        console.log('Carousel next!');

        // Increment the current index
        this.currentIndex++;

        // Stop at the end
        if(this.currentIndex == this.itemViews.length) {
            this.currentIndex = this.itemViews.length - 1;
        }

        this.showCurrentItem();
    }

    save() {
        this.saveButtonView.addClass('active');
        this.saveButtonView.addClass('activated');
        Function.delay(62, function() {
            this.saveButtonView.removeClass('activated');
        }.bind(this));
        console.log('save!');
    }

}

// Export
export { CarouselView };
