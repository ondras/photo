var Photo = function(canvas) {
	this._canvases = [canvas];
	this._previewCanvas = null; /* final preview */
	this._actions = [];
}

Photo.prototype.drawPreview = function() {
	var source = this._canvases[this._canvases.length-1];

	this._previewCanvas = this._createPreviewCanvas(source);

	Preview.getCanvas().getContext("2d").drawImage(this._previewCanvas, 0, 0);
}

Photo.prototype.getPreviewCanvas = function(forAction) {
	var index = this._actions.indexOf(forAction);
	if (index == -1) { return this._previewCanvas; }

	var largeCanvas = this._getCanvas(forAction);
	return this._createPreviewCanvas(largeCanvas);
}

Photo.prototype.setAction = function(action) {
	var index = this._actions.indexOf(action);
	if (index == -1) { /* new action */
		var canvas = this._getCanvas(action);
		action.go(canvas).then(function(canvas) {
			this._actions.push(action);
			this._canvases.push(canvas);
			App.resetSelects();

			var o = document.createElement("option");
			o.innerHTML = action.getName();
			document.querySelector("#history").appendChild(o);


		}.bind(this));

	} else { /* modification of an old action */

	}
}

Photo.prototype.getAction = function(index) {
	return this._actions[index];
}

/**
 * Get full source canvas for a given action
 */
Photo.prototype._getCanvas = function(forAction) {
	var index = this._actions.indexOf(forAction);
	return this._canvases[index == -1 ? this._canvases.length-1 : index];
}

Photo.prototype._createPreviewCanvas = function(canvas) {
	var target = Preview.getCanvas();

	var result = document.createElement("canvas");
	result.width = target.width;
	result.height = target.height;
	result.getContext("2d").drawImage(canvas, 0, 0, result.width, result.height);

	return result;
}
