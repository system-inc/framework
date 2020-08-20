// Dependencies
import ViewController from 'framework/system/interface/graphical/view-controllers/ViewController.js';
import NavigationContainerView from 'framework/system/interface/graphical/views/navigation/NavigationContainerView.js';
import NavigationView from 'framework/system/interface/graphical/views/navigation/NavigationView.js';
import NotFoundPageView from 'framework/system/interface/graphical/views/navigation/pages/NotFoundPageView.js';

// Class
class NavigationViewController extends ViewController {
    
    // The view which allows the user to navigate to pages
    navigationView = null;
    useNavigationView = false; // Whether or not to show the navigation view

    // The pages which the user can navigate to
    pageViews = {};
    currentPageView = null;

    // The view to show when a route is not matched
    notFoundPageView = null;

    // Routes which are registered to functions which return views
    routes = {};

    constructor() {
		//console.log('CompanionsViewController.constructor');
		super();

		// Create and configure the view
        this.view = new NavigationContainerView();
    }

    async initialize() {
        await super.initialize();

        // Create the not found page view
        this.notFoundPageView = new NotFoundPageView();

        // Create the navigation view
        this.navigationView = new NavigationView();

        // Catch all link clicks for the single page app
        console.log('move this somewhere else - to the adapter?');
        document.body.addEventListener('click', function(event) {
            //event.preventDefault();

            // See if the item clicked is inside an A
            var linkElement = event.target;
            while(linkElement && linkElement.tagName !== 'A') {
                linkElement = linkElement.parentNode;
                if(!linkElement) {
                    return;
                }
            }
            //console.log('linkElement', linkElement);

            if(linkElement && linkElement.tagName == 'A' && linkElement.href && event.button == 0) {
                // It's a left click on an <a href=...>.
                if(linkElement.origin == document.location.origin) {
                    // It's a same-origin navigation: a link within the site
                    // Now check that the the app is capable of doing a within-page update
                    var oldPath = document.location.pathname;
                    var newPath = linkElement.pathname;
                    
                    // Prevent the browser from doing the navigation.
                    event.preventDefault();
                    
                    // Let the app handle it
                    this.navigateToPath(newPath);
                }
            }
        }.bind(this));

        // Handle state changes
        console.log('move this somewhere else - to the adapter?');
        window.onpopstate = function(event) {
            this.stateChange(event);
        }.bind(this);
    }

    createPage(view, path) {
        if(!path) {
            path = this.getPathFromView(view);
        }
        this.pageViews[path] = view;
        //console.log('navigation.createPage', this.pages);
    }

    createPath(path, functionReturningView) {
        var expression = path.replace(/:([^\/]+)/g, function() {
            return '(.+)';
        });
        expression = new RegExp(expression);
        //console.log('creating expression for', path, expression);

        this.paths[path] = {
            path: path,
            expression: expression,
            function: functionReturningView,
        }
        //console.log('navigation.createPath', path);
    }

    navigateToPath(path, doNotAddToHistory = false) {
        this.emit('navigateToPath', {
            path: path,
        });

        // Rewrite root path to home signed in or home signed out
        if(path == '/') {
            if(app.user) {
                path = '/home-signed-in/';
            }
            else {
                path = '/home-signed-out/';
            }
        }

        // Get the view to navigate to
        var viewToNavigateTo = this.pageViews[path];
        // If the page is not created, see if the path matches the registered paths
        if(!viewToNavigateTo) {
            //console.log('navigation checking registered paths');
            for(let key in this.paths) {
                let currentPathObject = this.paths[key];
                //console.log('checking', key, 'against', path, 'using', currentPathObject.expression);

                let possibleMatch = path.match(currentPathObject.expression);

                // TODO: this currently only supports /path/:id/, not more parameters
                // If there is a match
                if(possibleMatch && possibleMatch[0] && possibleMatch[1]) {
                    let idArray = [possibleMatch[1]];
                    //console.log(key, 'matched', 'idArray', idArray);
                    viewToNavigateTo = currentPathObject.function(...idArray);
                    break;
                }                
            }
        }

        // Add the navigation to history
        if(!doNotAddToHistory) {
            let title = 'Not Found';
            if(viewToNavigateTo) {
                title = this.getTitleFromView(viewToNavigateTo);
            }

            // Make home pages resolve to /
            var historyPath = path;
            if(historyPath == '/home-signed-in/' || historyPath == '/home-signed-out/') {
                historyPath = '/';
            }

            // Push the state
            history.pushState(historyPath, title, historyPath);
        }
        
        console.log('Navigating to path:', path, 'stored page:', this.pageViews[path]);

        // Detach the current page if one is set
        if(this.currentPageView) {
            this.currentPageView.remove();
        }
        // Or empty the app's HTML if this is our first page navigation
        else {
            //app.html.empty();
        }

        // If the page is not found
        if(!viewToNavigateTo) {
            this.notFoundPageView.path = path;
            viewToNavigateTo = this.notFoundPageView;
        }

        // Show the new page
        this.currentPageView = viewToNavigateTo;

        // Handle navigation view
        if(this.useNavigationView) {            
            // Hide the navigation menu on mobile
            this.navigationView.hideMenu();
        }

        // await this.currentPageView.initialize();
        // await this.currentPageView.render();
        this.view.append(this.currentPageView);
        console.log('appended this.currentPageView', this.currentPageView);
        //app.html.append(this.currentPageView.render());

        // Invoke the navigatedTo function
        if(this.currentPageView.navigatedTo) {
            this.currentPageView.navigatedTo();
        }
    }

    startUsingNavigationView() {
        this.useNavigationView = true;
        this.view.append(this.navigationView);
    }

    stopUsingNavigationView() {
        this.useNavigationView = false;
        this.navigationView.detach();
    }

    stateChange(event) {
        console.log('navigation.stateChange', event);
        this.navigateToPath(event.state, true);
    }

    getTitleFromView(view) {
        var title = '';

        if(view.title) {
            title = view.title;
        }
        else {
            title = Class.getClassNameFromInstance(view).replaceLast('PageView', '').toTitle();
        }

        title = title+' • '+app.title;

        return title;
    }

    getPathFromView(view) {
        var pathFromView = '/';
        pathFromView += Class.getClassNameFromInstance(view).replaceLast('PageView', '').toDashes();
        pathFromView += '/';

        return pathFromView;
    }

}

// Export
export default NavigationViewController;
