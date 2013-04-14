Action.Linear = function() {
	Action.call(this);
	this._name = "Adjust levels";
	this._throbber = "Adjusting levels...";
}
Action.Linear.prototype = Object.create(Action.prototype);

Action.Linear.prototype.go = function(canvas) {
	var promise = Action.prototype.go.call(this, canvas);
	var id = this._canvasToImageData(canvas);

	var a = this._options.a;
	var b = this._options.b;
	var def = {
		r: {a:a, b:b},
		g: {a:a, b:b},
		b: {a:a, b:b}
	}

	this._runInWorker(promise, {method:"linear", args: [id, def]});
	return promise;
}

Action.Linear.prototype._defaultOptions = function() {
	return {
		a: 0.6,
		b: 0
	};
}
