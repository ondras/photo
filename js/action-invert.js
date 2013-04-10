Action.Invert = function(options) {
	Action.call(this, options);
}
Action.Invert.prototype = Object.create(Action.prototype);

Action.Invert.prototype.go = function(canvas) {
	var promise = Action.prototype.go.call(this, canvas);
	var id = App.canvasToImageData(canvas);
	this._runInWorker(promise, {method:"linear", args: [id, -1, 255]});
	return promise;
}
