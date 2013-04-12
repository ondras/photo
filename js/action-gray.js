Action.Gray = function(options) {
	Action.call(this, options);
	this._name = "Grayscale";
	this._throbber = "Desaturating...";
}
Action.Gray.prototype = Object.create(Action.prototype);

Action.Gray.prototype.go = function(canvas) {
	var promise = Action.prototype.go.call(this, canvas);
	var id = App.canvasToImageData(canvas);

	this._runInWorker(promise, {method:"average", args: [id, this._options.mode]});
	return promise;
}

Action.Gray.prototype._defaultOptions = function() {
	return {
		mode: 0 /* 0 = lightness, 1 = luminosity, 2 = average */
	}
}