Operation.Linear = function(options) {
	Operation.call(this, options);
}
Operation.Linear.prototype = Object.create(Operation.prototype);

Operation.Linear.prototype.go = function(canvas) {
	var promise = Operation.prototype.go.call(this, canvas);
	var id = App.canvasToImageData(canvas);
	Promise.worker("worker.js", {method:"linear", args:[id, this._options.a, this._options.b]}).then(function(id) {
		this._canvas = App.imageDataToCanvas(id);
		promise.fulfill(this._canvas);
	}.bind(this));
	return promise;
}

Operation.Linear.prototype._defaultOptions = function() {
	return {
		a: 1.2,
		b: 0
	};
}
