Operation.Invert = function(options) {
	Operation.call(this, options);
}
Operation.Invert.prototype = Object.create(Operation.prototype);

Operation.Invert.prototype.go = function(canvas) {
	var promise = Operation.prototype.go.call(this, canvas);
	var id = App.canvasToImageData(canvas);
	Promise.worker("worker.js", {method:"invert", args:[id]}).then(function(id) {
		this._canvas = App.imageDataToCanvas(id);
		promise.fulfill(this._canvas);
	}.bind(this));
	return promise;
}
