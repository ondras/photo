var Photo = function(canvas) {
	this._canvases = [canvas];
	this._lastPreviewCanvas = null; /* final preview */
	this._actions = [];
}

Photo.prototype.drawPreview = function(index) {
	if (arguments.length == 0) { index = this._canvases.length-1; }
	var source = this._canvases[index];

	if (arguments.length == 0) {
		if (!this._lastPreviewCanvas) {
			this._lastPreviewCanvas = this._createPreviewCanvas(source);
		}
		var canvas = this._lastPreviewCanvas;
	} else {
		var canvas = this._createPreviewCanvas(source);

	}

	Preview.getCanvas().getContext("2d").drawImage(canvas, 0, 0);
}

Photo.prototype.getPreviewCanvas = function(forAction) {
	var index = this._actions.indexOf(forAction);
	if (index == -1) { return this._lastPreviewCanvas; }

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
			this._lastPreviewCanvas = null; /* invalidate last preview */
			App.addHistory(action);
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
