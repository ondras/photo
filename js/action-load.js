Action.Load = function(options) {
	Action.call(this, options);
}

Action.Load._input = document.createElement("input");
Action.Load.input = document.createElement("input");

Action.Load.showUI = function(parent) {
	parent.appendChild()
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