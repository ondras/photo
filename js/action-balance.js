Action.Balance = function() {
	Action.call(this);
	this._name = "Color balance";
	this._throbber = "Adjusting color balance...";
}
Action.Balance.prototype = Object.create(Action.prototype);

Action.Balance.prototype.go = function(canvas, options) {
	var promise = Action.prototype.go.call(this, canvas, options);
	var id = this._canvasToImageData(canvas);

	var o = this._mergeOptions(options);
	var def = {
		r: {a:1, b:o.r - o.g/2 - o.b/2},
		g: {a:1, b:o.g - o.r/2 - o.b/2},
		b: {a:1, b:o.b - o.r/2 - o.g/2}
	}

	this._runInWorker(promise, {method:"linear", args: [id, def]});
	return promise;
}

Action.Balance.prototype._defaultOptions = function() {
	return {
		r: 0,
		g: 0,
		b: 0
	};
}
