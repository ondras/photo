Action.Linear = function() {
	Action.call(this);
	this._name = "Adjust levels";
	this._throbber = "Adjusting levels...";
}
Action.Linear.prototype = Object.create(Action.prototype);

Action.Linear.prototype.go = function(canvas, options) {
	var promise = Action.prototype.go.call(this, canvas, options);
	var id = this._canvasToImageData(canvas);
	var o = this._mergeOptions(options);

	var a = o.a;
	var b = o.b;
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
		a: 1,
		b: 0
	};
}

Action.Linear.prototype.abToMinMax = function(a, b) {
	return [Math.round(-b/a),  Math.round((255-b)/a)];
}

Action.Linear.prototype.minMaxToAB = function(min, max) {
	return [255/(max-min), 255*min/(min-max)];
}
