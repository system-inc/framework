ProxyRoute = Route.extend({

	type: 'proxy',
	proxyUrl: null,
	proxyHeaders: null,

	construct: function() {
	},

	getFullProxyUrl: function(url) {
		var indexInUrlWhereFullExpressionMatchStarts = url.url.search(this.fullExpression);
		var indexInFullExpressionWhereRegularExpressionCaptureGroupStarts = this.fullExpression.indexOf('(');
		var indexWhereAdditionalUrlPathStarts = indexInUrlWhereFullExpressionMatchStarts + indexInFullExpressionWhereRegularExpressionCaptureGroupStarts;
		var additionalUrlPath = url.url.substring(indexWhereAdditionalUrlPathStarts);
		var fullProxyUrl = new Url(this.proxyUrl.url.replaceLast('/', '')+additionalUrlPath);

		return fullProxyUrl;
	},

});