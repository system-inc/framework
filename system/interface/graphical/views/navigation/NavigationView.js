// Dependencies
import { View } from '@framework/system/interface/graphical/views/View.js';
import { LinkListView } from '@framework/system/interface/graphical/views/lists/LinkListView.js';

// Class
class NavigationView extends View {

    linkListView = null;
    toggleMenuButtonView = null;

	constructor() {
        super();

        this.linkListView = new LinkListView();

        this.append(this.linkListView);

        // html.html(`
        //     <ul class="menu">
        //         <li class="menuToggle"><a><div class="icon"><div class="box"><div class="inner"></div></div></div></a></li>
        //         <li class="logo image"><a href="/"><i class="icon wiseBeing"><svg height="42px" version="1.1" viewBox="0 0 42 42" width="42px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title/><desc/><g fill="none" fill-rule="evenodd" id="Page-2" stroke="none" stroke-width="1"><g fill="currentColor" fill-rule="nonzero" id="Growth" transform="translate(-4.000000, -4.000000)"><path d="M24.0119016,32.75 L8.54443359,32.75 C8.13022003,32.75 7.79443359,32.4142136 7.79443359,32 C7.79443359,31.5857864 8.13022003,31.25 8.54443359,31.25 L24.2536509,31.25 L24.2535771,30.0000265 C24.2535771,29.9696898 24.2553783,29.9397738 24.2588795,29.9103797 L24.2589838,22.970522 C21.0914731,23.0400378 18.5227381,22.1342613 16.598582,20.2434753 C14.5473339,18.2278015 13.6292202,15.4860321 13.8354134,12.0773998 L13.8755425,11.4140156 L14.5389362,11.3740434 C17.9932775,11.1659054 20.7723215,12.0624504 22.8208008,14.0754035 C23.7519877,14.9904411 24.4496574,16.0551129 24.9146359,17.2638776 C25.3699864,16.0427833 26.052554,14.9666568 26.961566,14.0416018 C28.9772398,11.9903537 31.7190092,11.07224 35.1276414,11.2784332 L35.7910257,11.3185623 L35.8309978,11.9819561 C36.0391358,15.4362973 35.1425909,18.2153413 33.1296377,20.2638206 C31.8085851,21.6081883 30.3642157,22.5227938 28.8004277,22.9961873 C28.4039814,23.1162004 27.9853082,22.892107 27.865295,22.4956607 C27.7452819,22.0992143 27.9693753,21.6805412 28.3658216,21.560528 C29.6781444,21.1632586 30.9081513,20.384392 32.0597407,19.2124785 C33.6278849,17.6166584 34.3974581,15.4773472 34.3591921,12.7508587 C31.6885227,12.7189862 29.5948185,13.501997 28.031463,15.0929439 C26.7803541,16.3661334 26.0408202,17.9796921 25.8094511,19.9605621 C25.7555196,20.4222977 25.7376279,21.1952149 25.7588481,22.2783576 L25.7588481,30.6852976 C25.8031564,30.7810048 25.8278816,30.8876291 25.8278816,31.0000283 L25.8278711,31.25 L41.7597656,31.25 C42.1739792,31.25 42.5097656,31.5857864 42.5097656,32 C42.5097656,32.4142136 42.1739792,32.75 41.7597656,32.75 L25.8278077,32.75 L25.8277471,34.1834546 C25.9413752,34.6432337 26.1687114,35.0228546 26.5159558,35.3392491 C27.1069874,35.8777723 27.9336969,36.1256367 29.0417416,36.0656234 C29.455349,36.0432219 29.8088041,36.3603568 29.8312056,36.7739642 C29.8536072,37.1875715 29.5364722,37.5410266 29.1228649,37.5634282 C27.7547059,37.6375296 26.6109676,37.3328736 25.7273188,36.6360082 C25.6728993,36.9058072 25.5991319,37.1648911 25.5061294,37.4128589 L25.5061294,42.1154785 C25.5061294,42.5296921 25.170343,42.8654785 24.7561294,42.8654785 C24.3419159,42.8654785 24.0061294,42.5296921 24.0061294,42.1154785 L24.0061294,39.4540114 C22.9510932,40.2870429 21.5893967,40.6522479 19.9579011,40.5604692 C19.5443414,40.5372046 19.2279447,40.1830886 19.2512092,39.7695289 C19.2744737,39.3559692 19.6285898,39.0395724 20.0421495,39.062837 C21.4621043,39.1427156 22.5340991,38.8088896 23.308377,38.0761381 C23.6055574,37.7948962 23.8377346,37.4756508 24.0061294,37.1140653 L24.0061294,32.8435059 C24.0061294,32.8118406 24.0080918,32.7806336 24.0119016,32.75 Z M21.7694587,15.1453006 C20.1736386,13.5771564 18.0343273,12.8075832 15.3078389,12.8458491 C15.2759664,15.5165186 16.0589772,17.6102227 17.6499241,19.1735782 C19.2457441,20.7417224 21.3850554,21.5112956 24.1115439,21.4730297 C24.1434164,18.8023602 23.3604056,16.7086561 21.7694587,15.1453006 Z" id="growth"/></g></g></svg></i></a>
        //         <li class="item text active"><a href="/">Home</a></li>
        //         <li class="item text"><a href="/conversations/">Conversations</a></li>
        //         <li class="item text"><a href="/companions/">Companions</a></li>
        //         <li class="item text"><a href="/discover/">Discover</a></li>
        //         <li class="item text"><a href="/about/">About</a></li>
        //         <li class="item userProfileImage image"><a href="/user/"><i class="icon"></i></a></li>
        //     </ul>
        // `);
    }
    
    initializeMenu() {
        this.linkListView = this.html.find('.menu');

        // Toggle the menu when the toggle icon is clicked
        this.toggleMenuButtonView = this.html.find('.menuToggle');
        this.toggleMenuButtonView.click(function() {
            this.toggleMenu();
        }.bind(this));

        // Close the menu on outside clicks
        $(document).click(function(event) {
            this.closeMenuOnOutsideInteraction(event);
        }.bind(this));

        // Listen to navigation events and set the active navigation item if the path matches
        app.navigation.on('navigateToPath', function(event) {
            //console.log('caught!', event);
            this.linkListView.find('a').parent().removeClass('active');
            this.linkListView.find('a[href="'+event.path+'"]').parent().addClass('active');
        }.bind(this));
    }
    
    toggleMenu() {
        if(this.linkListView.is('.active')) {
            this.hideMenu();
        }
        else {
            this.showMenu();
        }
    }

    showMenu() {
        this.linkListView.addClass('active');
    }

    hideMenu() {
        this.linkListView.removeClass('active');
    }

    closeMenuOnOutsideInteraction(event) {
        //console.log('closeMenuOnOutsideInteraction');

        var clickIsInMenu = $(this.linkListView).has(event.target).length;
        //console.log('clickIsInMenu', clickIsInMenu);
        if(!clickIsInMenu) {
            //console.log('click not in menu, closing menu');
            this.hideMenu();
        }
        else {
            //console.log('click in menu, not closing menu');
        }
    }

    
}

// Export
export { NavigationView };
