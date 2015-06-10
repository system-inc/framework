Html = function(tag, options) {
	return new HtmlElement(tag, options);
}

// HTML structure

// Wrapper tag for entire file (only DOCTYPE goes before it)
Html.html = function(options) {
	return new HtmlElement('html', options);
}

// Wrapper tag for meta info
Html.head = function(options) {
	return new HtmlElement('head', options);
}

// Meta tag used inside head tag <meta charset="utf-8" />
Html.meta = function(options) {
	return new HtmlElement('meta', options, true);
}

// Style sheet etc <link rel="stylesheet" type="text/css" href="basic.css">
Html.link = function(options) {
	return new HtmlElement('link', options, true);
}

// Document title
Html.title = function(options) {
	return new HtmlElement('title', options);
}

// Base URL <base href="http://example.com/" target="_blank" />
Html.base = function(options) {
	return new HtmlElement('base', options, true);
}

// Wrapper tag for page content
Html.body = function(options) {
	return new HtmlElement('body', options);
}

// CSS stylesheet <style type="text/css">…</style>
Html.style = function(options) {
	return new HtmlElement('style', options);
}

// Page structure

// Navigation bar
Html.nav = function(options) {
	return new HtmlElement('nav', options);
}

// Page header
Html.header = function(options) {
	return new HtmlElement('header', options);
}

// Page footer
Html.footer = function(options) {
	return new HtmlElement('footer', options);
}

// Main section
Html.main = function(options) {
	return new HtmlElement('main', options);
}

// Sidebar
Html.aside = function(options) {
	return new HtmlElement('aside', options);
}

// Article body
Html.article = function(options) {
	return new HtmlElement('article', options);
}

// Section body (chapter).
Html.section = function(options) {
	return new HtmlElement('section', options);
}

// Title or section heading

// Headline 1
Html.h1 = function(options) {
	return new HtmlElement('h1', options);
}

// Headline 2
Html.h2 = function(options) {
	return new HtmlElement('h2', options);
}

// Headline 3
Html.h3 = function(options) {
	return new HtmlElement('h3', options);
}

// Headline 4
Html.h4 = function(options) {
	return new HtmlElement('h4', options);
}

// Headline 5
Html.h5 = function(options) {
	return new HtmlElement('h5', options);
}

// Headline 6
Html.h6 = function(options) {
	return new HtmlElement('h6', options);
}

// Used to group one of h1 to h6, for subtitle purpose. This tag is removed from W3C spec, but remains in WHATWG spec.
Html.hgroup = function(options) {
	return new HtmlElement('hgroup', options);
}

// Text block

// Generic block markup. Use with CSS
Html.div = function(options) {
	return new HtmlElement('div', options);
}

// Paragraph
Html.p = function(options) {
	return new HtmlElement('p', options);
}

// Monospace block
Html.pre = function(options) {
	return new HtmlElement('pre', options);
}

// Quote passages, excerpt
Html.blockquote = function(options) {
	return new HtmlElement('blockquote', options);
}

// Horizontal rule
Html.hr = function(options) {
	return new HtmlElement('hr', options, true);
}


// Lists

// Unordered list
Html.ul = function(options) {
	return new HtmlElement('ul', options);
}

// Ordered list
Html.ol = function(options) {
	return new HtmlElement('ol', options);
}

// List item. (use inside ul or ol)
Html.li = function(options) {
	return new HtmlElement('li', options);
}

// Definition list
Html.dl = function(options) {
	return new HtmlElement('dl', options);
}

// Definition term
Html.dt = function(options) {
	return new HtmlElement('dt', options);
}

// Definition description
Html.dd = function(options) {
	return new HtmlElement('dd', options);
}


// Inline text markup

// Generic text markup. Use with CSS
Html.span = function(options) {
	return new HtmlElement('span', options);
}

// Link (anchor)
Html.a = function(options) {
	return new HtmlElement('a', options);
}

// Emphasize. Placing emphasis may affect the meaning of sentence.
Html.em = function(options) {
	return new HtmlElement('em', options);
}

// Important. Placement of this tag does not change the meaning of sentence.
Html.strong = function(options) {
	return new HtmlElement('strong', options);
}

// Bold
Html.b = function(options) {
	return new HtmlElement('b', options);
}

// Italic
Html.i = function(options) {
	return new HtmlElement('i', options);
}

// Underline for book title, misspelled word, ….
Html.u = function(options) {
	return new HtmlElement('u', options);
}

// Strike-thru
Html.s = function(options) {
	return new HtmlElement('s', options);
}

// Highlight
Html.mark = function(options) {
	return new HtmlElement('mark', options);
}

// Smaller
Html.small = function(options) {
	return new HtmlElement('small', options);
}

// Deleted text
Html.del = function(options) {
	return new HtmlElement('del', options);
}

// Newly inserted text (in contrast to del)
Html.ins = function(options) {
	return new HtmlElement('ins', options);
}

// Superscript
Html.sup = function(options) {
	return new HtmlElement('sup', options);
}

// Subscript
Html.sub = function(options) {
	return new HtmlElement('sub', options);
}

// Definition term
Html.dfn = function(options) {
	return new HtmlElement('dfn', options);
}

// Computer code
Html.code = function(options) {
	return new HtmlElement('code', options);
}

// Variable
Html.var = function(options) {
	return new HtmlElement('var', options);
}

// Sample code
Html.samp = function(options) {
	return new HtmlElement('samp', options);
}

// Keyboard input
Html.kbd = function(options) {
	return new HtmlElement('kbd', options);
}

// Short inline quote.
Html.q = function(options) {
	return new HtmlElement('q', options);
}

// Book title (or title of: article, essay, song, script, film, TV show, game, artwork, … etc)
Html.cite = function(options) {
	return new HtmlElement('cite', options);
}

// Pronunciation markup for Asian languages. ruby example
Html.ruby = function(options) {
	return new HtmlElement('ruby', options);
}

// Used inside ruby tag, for pronunciation.
Html.rt = function(options) {
	return new HtmlElement('rt', options);
}

// Used inside ruby tag, for older browser support.
Html.rp = function(options) {
	return new HtmlElement('rp', options);
}

// Line break
Html.br = function(options) {
	return new HtmlElement('br', options, true);
}

// Line-break hint. Browsers can render line break at this point.
Html.wbr = function(options) {
	return new HtmlElement('wbr', options, true);
}

// Text direction
Html.bdo = function(options) {
	return new HtmlElement('bdo', options);
}

// Text direction
Html.bdi = function(options) {
	return new HtmlElement('bdi', options);
}


// Table

// Table
Html.table = function(options) {
	return new HtmlElement('table', options);
}

// Table caption
Html.caption = function(options) {
	return new HtmlElement('caption', options);
}

// Table row
Html.tr = function(options) {
	return new HtmlElement('tr', options);
}

// Table cell
Html.td = function(options) {
	return new HtmlElement('td', options);
}

// Table cell header
Html.th = function(options) {
	return new HtmlElement('th', options);
}

// Table header
Html.thead = function(options) {
	return new HtmlElement('thead', options);
}

// Table footer
Html.tfoot = function(options) {
	return new HtmlElement('tfoot', options);
}

// Table body
Html.tbody = function(options) {
	return new HtmlElement('tbody', options);
}

// Group table columns for styling
Html.colgroup = function(options) {
	return new HtmlElement('colgroup', options);
}

// Used inside colgroup
Html.col = function(options) {
	return new HtmlElement('col', options, true);
}


// Image

// Inline image
Html.img = function(options) {
	return new HtmlElement('img', options, true);
}

// For independent illustartion, image, video, code example, …
Html.figure = function(options) {
	return new HtmlElement('figure', options);
}

// Caption for images
Html.figcaption = function(options) {
	return new HtmlElement('figcaption', options);
}

// Image Map Example
Html.map = function(options) {
	return new HtmlElement('map', options);
}

// Image Map Example
Html.area = function(options) {
	return new HtmlElement('area', options, true);
}

// Audio, video, special objects

// HTML5 Video Tutorial
Html.video = function(options) {
	return new HtmlElement('video', options);
}

// Embed sound files. HTML5 Audio Tag Tutorial
Html.audio = function(options) {
	return new HtmlElement('audio', options);
}

// A self-closing tag, to be used inside {video, audio} tags. Similar in purpose to the src="…" attribute. Used to indicate media source, for different formats. mp4, ogg. <source src="movie.mp4" type="video/mp4">
Html.source = function(options) {
	return new HtmlElement('source', options, true);
}

// video/audio track related.
Html.track = function(options) {
	return new HtmlElement('track', options, true);
}

// JavaScript Basics by Example
Html.script = function(options) {
	return new HtmlElement('script', options);
}

// <noscript>displayed when JavaScript is off</noscript>
Html.noscript = function(options) {
	return new HtmlElement('noscript', options);
}

// Embedded object. forHtml.object = function(options) {
Html.object = function(options) {
	return new HtmlElement('object', options);
}

// Parameter, used with object tag
Html.param = function(options) {
	return new HtmlElement('param', options, true);
}

// Interactive content or plugin
Html.embed = function(options) {
	return new HtmlElement('embed', options, true);
}

// Embed a page; inner window. HTML Iframe Tutorial
Html.iframe = function(options) {
	return new HtmlElement('iframe', options);
}

// Interactive graphics, games. Canvas Example
Html.canvas = function(options) {
	return new HtmlElement('canvas', options);
}

// <abbr title="eXtensible Markup Language">XML</abbr>. abbr Example
Html.abbr = function(options) {
	return new HtmlElement('abbr', options);
}

// Markup for contact of article or page. HTML5
Html.address = function(options) {
	return new HtmlElement('address', options);
}

// Gauge indicator. HTML5 {meter, progress} Tags
Html.meter = function(options) {
	return new HtmlElement('meter', options);
}

// Progress bar. HTML5 {meter, progress} Tags
Html.progress = function(options) {
	return new HtmlElement('progress', options);
}

// Date/time. HTML5
Html.time = function(options) {
	return new HtmlElement('time', options);
}

// Forms

// Form	
Html.form = function(options) {
	return new HtmlElement('form', options);
}

// Render as Button. Used together with JavaScript.
Html.button = function(options) {
	return new HtmlElement('button', options);
}

// Generic input (text, radio box, checkbox, submit button)
Html.input = function(options) {
	return new HtmlElement('input', options, true);
}

// Large text input (comment)
Html.textarea = function(options) {
	return new HtmlElement('textarea', options);
}

// Menu
Html.select = function(options) {
	return new HtmlElement('select', options);
}

// Menu item. Used with select.
Html.option = function(options) {
	return new HtmlElement('option', options);
}

// Menu item group label.
Html.optgroup = function(options) {
	return new HtmlElement('optgroup', options);
}

// A label for a form input
Html.label = function(options) {
	return new HtmlElement('label', options);
}

// ?
Html.fieldset = function(options) {
	return new HtmlElement('fieldset', options);
}

// Title in a fieldset
Html.legend = function(options) {
	return new HtmlElement('legend', options);
}

// ?
Html.keygen = function(options) {
	return new HtmlElement('keygen', options, true);
}

// command button
Html.command = function(options) {
	return new HtmlElement('command', options, true);
}

// dropdown list
Html.datalist = function(options) {
	return new HtmlElement('datalist', options);
}

// menu list
Html.menu = function(options) {
	return new HtmlElement('menu', options);
}

// ?
Html.output = function(options) {
	return new HtmlElement('output', options);
}

// ?
Html.details = function(options) {
	return new HtmlElement('details', options);
}

// header of a "details" element
Html.summary = function(options) {
	return new HtmlElement('summary', options);
}