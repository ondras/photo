Action.Linear = function() {
	Action.call(this);
	this._name = "Linear";
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
		a: 0.6,
		b: 0
	};
}
