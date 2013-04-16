var Action = function() {
	this._options = this._defaultOptions();
	this._name = "";
	this._throbber = "";
}

Action.prototype.getName = function() {
	return this._name;
}

Action.prototype.setOptions = function(options) {
	this._options = this._mergeOptions(options);
	return this;
}

Action.prototype.getOptions = function(options) {
	return this._options;
}

Action.prototype.go = function(canvas, options) {
	var promise = new Promise();
	return promise;
}

Action.prototype._defaultOptions = function() {
	return {};
}

Action.prototype._runInWorker = function(promise, data) {
	App.showThrobber(this._throbber);
	Promise.worker("worker.js", data).then(function(id) {
		var canvas = this._imageDataToCanvas(id);
		App.hideThrobber();
		promise.fulfill(canvas);
	}.bind(this));
}

Action.prototype._canvasToImageData = function(canvas) {
	return canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
}

Action.prototype._imageDataToCanvas = function(id) {
	var canvas = document.createElement("canvas");
	canvas.width = id.width;
	canvas.height = id.height;
	canvas.getContext("2d").putImageData(id, 0, 0);
	return canvas;
}

Action.prototype._mergeOptions = function(options) {
	var o = {};
	for (var p in this._options) { o[p] = this._options[p]; }
	for (var p in options) { o[p] = options[p]; }
	return o;
}