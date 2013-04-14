Action.Invert = function(options) {
	Action.call(this, options);
	this._name = "Invert";
	this._throbber = "Inverting...";
}
Action.Invert.prototype = Object.create(Action.prototype);

Action.Invert.prototype.go = function(canvas) {
	var promise = Action.prototype.go.call(this, canvas);
	var id = this._canvasToImageData(canvas);

	var def = {};
	if (this._options.r) { 
		def.r = {a:-1, b:255}
	}
	if (this._options.g) { 
		def.g = {a:-1, b:255}
	}
	if (this._options.b) { 
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
