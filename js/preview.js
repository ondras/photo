var Preview = {
	_canvas: document.createElement("canvas"),

	getCanvas: function() {
		return this._canvas;
	},

	setData: function(data) {
		var context = this._canvas.getContext("2d");
		context.putImageData(data, 0, 0);
	}
}
