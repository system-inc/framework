// Class
class Position {

	x = null;
	y = null;

	coordinates = {
		topLeft: {
			x: null,
			y: null,
		},
		topCenter: {
			x: null,
			y: null,
		},
		topRight: {
			x: null,
			y: null,
		},

		centerLeft: {
			x: null,
			y: null,
		},
		center: {
			x: null,
			y: null,
		},
		centerRight: {
			x: null,
			y: null,
		},

		bottomLeft: {
			x: null,
			y: null,
		},
		bottomCenter: {
			x: null,
			y: null,
		},
		bottomRight: {
			x: null,
			y: null,
		},
	};

	edges = {
		top: null,
		right: null,
		bottom: null,
		left: null,
	};

	calculateCoordinatesAndEdges(width, height) {
		// Coordinates - Top
		this.coordinates.topLeft.x = this.x;
		this.coordinates.topLeft.y = this.y;

		this.coordinates.topCenter.x = width / 2;
		this.coordinates.topCenter.y = 0;
			
		this.coordinates.topRight.x = width;
		this.coordinates.topRight.y = 0;

		// Coordinates - Center
		this.coordinates.centerLeft.x = 0;
		this.coordinates.centerLeft.y = height / 2;

		this.coordinates.center.x = width / 2;
		this.coordinates.center.y = height / 2;

		this.coordinates.centerRight.x = width;
		this.coordinates.centerRight.y = height / 2;

		// Coordinates - Bottom
		this.coordinates.bottomLeft.x = 0;
		this.coordinates.bottomLeft.y = height;
			
		this.coordinates.bottomCenter.x = width / 2;
		this.coordinates.bottomCenter.y = height;
			
		this.coordinates.bottomRight.x = width;
		this.coordinates.bottomRight.y = height;

		// Edges
		this.edges.top = this.y;
		this.edges.right = this.x + width;
		this.edges.bottom = this.y + height;
		this.edges.left = this.x;
	}

	static resolveWidth(width, totalWidth) {
		var resolvedWidth = null;

		if(width <= 1) {
			resolvedWidth = width * totalWidth;
		}

		return resolvedWidth;
	}

	static resolveHeight(height, totalHeight) {
		var resolvedHeight = null;

		if(height <= 1) {
			resolvedHeight = height * totalHeight;
		}

		return resolvedHeight;
	}

	static resolveX(x, width, totalWidth) {
		var resolvedX = x;

		if(x == 'left') {
			resolvedX = 0;
		}
		else if(x == 'center') {
			resolvedX = Number.round((totalWidth / 2) - (width / 2));
		}
		else if(x == 'right') {
			resolvedX = totalWidth - width;
		}
		else if(x <= 1) {
			resolvedX = x * totalWidth;
		}

		//console.info('resolvedX', resolvedX);

		return resolvedX;
	}

	static resolveY(y, height, totalHeight) {
		var resolvedY = y;

		if(y == 'top') {
			resolvedY = 0;
		}
		else if(y == 'center') {
			resolvedY = Number.round((totalHeight / 2) - (height / 2));
		}
		else if(y == 'bottom') {
			resolvedY = totalHeight - height;
		}
		else if(y <= 1) {
			resolvedY = y * totalHeight;
		}

		//console.info('resolvedY', resolvedY);

		return resolvedY;
	}

}

// Export
export { Position };
