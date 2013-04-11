var Action = function() {
	this._options = this._defaultOptions();
	this._canvas = null;
	this._name = "FIXME";
}

Action.prototype.getName = function() {
	return this._name;
}

Action.prototype.setOptions = function(options) {
	for (var p in options) { this._options[p] = options[p]; }
		return this;
}

Action.prototype.getOptions = function(options) {
	return this._options;
}

Action.prototype.go = function(canvas) {
	var promise = new Promise();
	return promise;
}

Action.prototype.preview = function(canvas) {
	this.go(canvas).then(function() {
		Preview.getCanvas().getContext("2d").drawImage(this._canvas, 0, 0);
	}.bind(this));
}

Action.prototype.getCanvas = function() {
	return this._canvas;
}

Action.prototype._defaultOptions = function() {
	return {};
}

Action.prototype._runInWorker = function(promise, data) {
	Promise.worker("worker.js", data).then(function(id) {
		this._canvas = App.imageDataToCanvas(id);
		promise.fulfill(this._canvas);
	}.bind(this));
}