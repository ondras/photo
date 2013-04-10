var Action = function(options) {
	this._options = this._defaultOptions();
	for (var p in options) { this._options[p] = this._defaultOptions[p]; }
	this._canvas = null;
}

Action.prototype.go = function(canvas) {
	var promise = new Promise();
	return promise;
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