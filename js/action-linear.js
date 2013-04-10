Action.Linear = function(options) {
	Action.call(this, options);
}
Action.Linear.prototype = Object.create(Action.prototype);

Action.Linear.prototype.go = function(canvas) {
	var promise = Action.prototype.go.call(this, canvas);
	var id = App.canvasToImageData(canvas);
	this._runInWorker(promise, {method:"linear", args: [id, this._options.a, this._options.b]});
	return promise;
}

Action.Linear.prototype._defaultOptions = function() {
	return {
		a: 1.2,
		b: 0
	};
}
