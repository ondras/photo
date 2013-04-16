Action.Invert = function(options) {
	Action.call(this, options);
	this._name = "Invert";
	this._throbber = "Inverting...";
}
Action.Invert.prototype = Object.create(Action.prototype);

Action.Invert.prototype.go = function(canvas, options) {
	var promise = Action.prototype.go.call(this, canvas, options);
	var id = this._canvasToImageData(canvas);
	var o = this._mergeOptions(options);

	var def = {};
	if (o.r) { 
		def.r = {a:-1, b:255}
	}
	if (o.g) { 
		def.g = {a:-1, b:255}
	}
	if (o.b) { 
		def.b = {a:-1, b:255}
	}

	this._runInWorker(promise, {method:"linear", args: [id, def]});
	return promise;
}

Action.Invert.prototype._defaultOptions = function() {
	return {
		r: true,
		g: true,
		b: true
	}
}
