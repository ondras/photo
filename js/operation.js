var Operation = function(options) {
	this._options = this._defaultOptions();
	for (var p in options) { this._options[p] = this._defaultOptions[p]; }
	this._canvas = null;
}

Operation.prototype.go = function(canvas) {
	var promise = new Promise();
	return promise;
}

Operation.prototype.getCanvas = function() {
	return this._canvas;
}

Operation.prototype._defaultOptions = function() {
	return {};
}
