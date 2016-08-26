// Dependencies
import HtmlElement from './HtmlElement.js';

// Class
class Html {

	// Any tag
	static create(tag, options) {
		return new HtmlElement(tag, options);
	}

	static tag = Html.create;

	// HTML structure

	// Wrapper tag for entire file (only DOCTYPE goes before it)
	static html(options) {
		return new HtmlElement('html', options);
	}

	// Wrapper tag for meta info
	static head(options) {
		return new HtmlElement('head', options);
	}

	// Meta tag used inside head tag <meta charset="utf-8" />
	static meta(options) {
		return new HtmlElement('meta', options, true);
	}

	// Style sheet etc <link rel="stylesheet" type="text/css" href="basic.css">
	static link(options) {
		return new HtmlElement('link', options, true);
	}

	// Document title
	static title(options) {
		return new HtmlElement('title', options);
	}

	// Base URL <base href="http://example.com/" target="_blank" />
	static base(options) {
		return new HtmlElement('base', options, true);
	}

	// Wrapper tag for page content
	static body(options) {
		return new HtmlElement('body', options);
	}

	// CSS stylesheet <style type="text/css">…</style>
	static style(options) {
		return new HtmlElement('style', options);
	}

	// Page structure

	// Navigation bar
	static nav(options) {
		return new HtmlElement('nav', options);
	}

	// Page header
	static header(options) {
		return new HtmlElement('header', options);
	}

	// Page footer
	static footer(options) {
		return new HtmlElement('footer', options);
	}

	// Main section
	static main(options) {
		return new HtmlElement('main', options);
	}

	// Sidebar
	static aside(options) {
		return new HtmlElement('aside', options);
	}

	// Article body
	static article(options) {
		return new HtmlElement('article', options);
	}

	// Section body (chapter).
	static section(options) {
		return new HtmlElement('section', options);
	}

	// Title or section heading

	// Headline 1
	static h1(options) {
		return new HtmlElement('h1', options);
	}

	// Headline 2
	static h2(options) {
		return new HtmlElement('h2', options);
	}

	// Headline 3
	static h3(options) {
		return new HtmlElement('h3', options);
	}

	// Headline 4
	static h4(options) {
		return new HtmlElement('h4', options);
	}

	// Headline 5
	static h5(options) {
		return new HtmlElement('h5', options);
	}

	// Headline 6
	static h6(options) {
		return new HtmlElement('h6', options);
	}

	// Used to group one of h1 to h6, for subtitle purpose. This tag is removed from W3C spec, but remains in WHATWG spec.
	static hgroup(options) {
		return new HtmlElement('hgroup', options);
	}

	// Text block

	// Generic block markup. Use with CSS
	static div(options) {
		return new HtmlElement('div', options);
	}

	// Paragraph
	static p(options) {
		return new HtmlElement('p', options);
	}

	// Monospace block
	static pre(options) {
		return new HtmlElement('pre', options);
	}

	// Quote passages, excerpt
	static blockquote(options) {
		return new HtmlElement('blockquote', options);
	}

	// Horizontal rule
	static hr(options) {
		return new HtmlElement('hr', options, true);
	}


	// Lists

	// Unordered list
	static ul(options) {
		return new HtmlElement('ul', options);
	}

	// Ordered list
	static ol(options) {
		return new HtmlElement('ol', options);
	}

	// List item. (use inside ul or ol)
	static li(options) {
		return new HtmlElement('li', options);
	}

	// Definition list
	static dl(options) {
		return new HtmlElement('dl', options);
	}

	// Definition term
	static dt(options) {
		return new HtmlElement('dt', options);
	}

	// Definition description
	static dd(options) {
		return new HtmlElement('dd', options);
	}


	// Inline text markup

	// Generic text markup. Use with CSS
	static span(options) {
		return new HtmlElement('span', options);
	}

	// Link (anchor)
	static a(options) {
		return new HtmlElement('a', options);
	}

	// Emphasize. Placing emphasis may affect the meaning of sentence.
	static em(options) {
		return new HtmlElement('em', options);
	}

	// Important. Placement of this tag does not change the meaning of sentence.
	static strong(options) {
		return new HtmlElement('strong', options);
	}

	// Bold
	static b(options) {
		return new HtmlElement('b', options);
	}

	// Italic
	static i(options) {
		return new HtmlElement('i', options);
	}

	// Underline for book title, misspelled word, ….
	static u(options) {
		return new HtmlElement('u', options);
	}

	// Strike-thru
	static s(options) {
		return new HtmlElement('s', options);
	}

	// Highlight
	static mark(options) {
		return new HtmlElement('mark', options);
	}

	// Smaller
	static small(options) {
		return new HtmlElement('small', options);
	}

	// Deleted text
	static del(options) {
		return new HtmlElement('del', options);
	}

	// Newly inserted text (in contrast to del)
	static ins(options) {
		return new HtmlElement('ins', options);
	}

	// Superscript
	static sup(options) {
		return new HtmlElement('sup', options);
	}

	// Subscript
	static sub(options) {
		return new HtmlElement('sub', options);
	}

	// Definition term
	static dfn(options) {
		return new HtmlElement('dfn', options);
	}

	// Computer code
	static code(options) {
		return new HtmlElement('code', options);
	}

	// Variable
	static var(options) {
		return new HtmlElement('var', options);
	}

	// Sample code
	static samp(options) {
		return new HtmlElement('samp', options);
	}

	// Keyboard input
	static kbd(options) {
		return new HtmlElement('kbd', options);
	}

	// Short inline quote.
	static q(options) {
		return new HtmlElement('q', options);
	}

	// Book title (or title of: article, essay, song, script, film, TV show, game, artwork, … etc)
	static cite(options) {
		return new HtmlElement('cite', options);
	}

	// Pronunciation markup for Asian languages. ruby example
	static ruby(options) {
		return new HtmlElement('ruby', options);
	}

	// Used inside ruby tag, for pronunciation.
	static rt(options) {
		return new HtmlElement('rt', options);
	}

	// Used inside ruby tag, for older browser support.
	static rp(options) {
		return new HtmlElement('rp', options);
	}

	// Line break
	static br(options) {
		return new HtmlElement('br', options, true);
	}

	// Line-break hint. Browsers can render line break at this point.
	static wbr(options) {
		return new HtmlElement('wbr', options, true);
	}

	// Text direction
	static bdo(options) {
		return new HtmlElement('bdo', options);
	}

	// Text direction
	static bdi(options) {
		return new HtmlElement('bdi', options);
	}


	// Table

	// Table
	static table(options) {
		return new HtmlElement('table', options);
	}

	// Table caption
	static caption(options) {
		return new HtmlElement('caption', options);
	}

	// Table row
	static tr(options) {
		return new HtmlElement('tr', options);
	}

	// Table cell
	static td(options) {
		return new HtmlElement('td', options);
	}

	// Table cell header
	static th(options) {
		return new HtmlElement('th', options);
	}

	// Table header
	static thead(options) {
		return new HtmlElement('thead', options);
	}

	// Table footer
	static tfoot(options) {
		return new HtmlElement('tfoot', options);
	}

	// Table body
	static tbody(options) {
		return new HtmlElement('tbody', options);
	}

	// Group table columns for styling
	static colgroup(options) {
		return new HtmlElement('colgroup', options);
	}

	// Used inside colgroup
	static col(options) {
		return new HtmlElement('col', options, true);
	}


	// Image

	// Inline image
	static img(options) {
		return new HtmlElement('img', options, true);
	}

	// For independent illustartion, image, video, code example, …
	static figure(options) {
		return new HtmlElement('figure', options);
	}

	// Caption for images
	static figcaption(options) {
		return new HtmlElement('figcaption', options);
	}

	// Image Map Example
	static map(options) {
		return new HtmlElement('map', options);
	}

	// Image Map Example
	static area(options) {
		return new HtmlElement('area', options, true);
	}

	// Audio, video, special objects

	// HTML5 Video Tutorial
	static video(options) {
		return new HtmlElement('video', options);
	}

	// Embed sound files. HTML5 Audio Tag Tutorial
	static audio(options) {
		return new HtmlElement('audio', options);
	}

	// A self-closing tag, to be used inside {video, audio} tags. Similar in purpose to the src="…" attribute. Used to indicate media source, for different formats. mp4, ogg. <source src="movie.mp4" type="video/mp4">
	static source(options) {
		return new HtmlElement('source', options, true);
	}

	// video/audio track related.
	static track(options) {
		return new HtmlElement('track', options, true);
	}

	// JavaScript Basics by Example
	static script(options) {
		return new HtmlElement('script', options);
	}

	// <noscript>displayed when JavaScript is off</noscript>
	static noscript(options) {
		return new HtmlElement('noscript', options);
	}

	// Embedded object
	static object(options) {
		return new HtmlElement('object', options);
	}

	// Parameter, used with object tag
	static param(options) {
		return new HtmlElement('param', options, true);
	}

	// Interactive content or plugin
	static embed(options) {
		return new HtmlElement('embed', options, true);
	}

	// Embed a page
	static iframe(options) {
		return new HtmlElement('iframe', options);
	}

	// Interactive graphics, games
	static canvas(options) {
		return new HtmlElement('canvas', options);
	}

	// <abbr title="eXtensible Markup Language">XML</abbr>
	static abbr(options) {
		return new HtmlElement('abbr', options);
	}

	// Markup for contact of article or page. HTML5
	static address(options) {
		return new HtmlElement('address', options);
	}

	// Gauge indicator. HTML5 {meter, progress} Tags
	static meter(options) {
		return new HtmlElement('meter', options);
	}

	// Progress bar. HTML5 {meter, progress} Tags
	static progress(options) {
		return new HtmlElement('progress', options);
	}

	// Date/time. HTML5
	static time(options) {
		return new HtmlElement('time', options);
	}

	// Forms

	// Form	
	static form(options) {
		return new HtmlElement('form', options);
	}

	// Render as Button. Used together with JavaScript.
	static button(options) {
		return new HtmlElement('button', options);
	}

	// Generic input (text, radio box, checkbox, submit button)
	static input(options) {
		return new HtmlElement('input', options, true);
	}

	// Large text input (comment)
	static textarea(options) {
		return new HtmlElement('textarea', options);
	}

	// Menu
	static select(options) {
		return new HtmlElement('select', options);
	}

	// Menu item. Used with select.
	static option(options) {
		return new HtmlElement('option', options);
	}

	// Menu item group label.
	static optgroup(options) {
		return new HtmlElement('optgroup', options);
	}

	// A label for a form input
	static label(options) {
		return new HtmlElement('label', options);
	}

	// ?
	static fieldset(options) {
		return new HtmlElement('fieldset', options);
	}

	// Title in a fieldset
	static legend(options) {
		return new HtmlElement('legend', options);
	}

	// ?
	static keygen(options) {
		return new HtmlElement('keygen', options, true);
	}

	// command button
	static command(options) {
		return new HtmlElement('command', options, true);
	}

	// dropdown list
	static datalist(options) {
		return new HtmlElement('datalist', options);
	}

	// menu list
	static menu(options) {
		return new HtmlElement('menu', options);
	}

	// ?
	static output(options) {
		return new HtmlElement('output', options);
	}

	// ?
	static details(options) {
		return new HtmlElement('details', options);
	}

	// header of a "details" element
	static summary(options) {
		return new HtmlElement('summary', options);
	}

}


// Export
export default Html;
