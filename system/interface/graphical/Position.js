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

}

// Export
export default Position;
