var Operation = function(options) {
	this._options = this._defaultOptions();
	for (var p in options) { this._options[p] = this._defaultOptions[p]; }
}

Operation.prototype.go = function(data) {
	var promise = new Promise();
	return promise;
}

Operation.prototype._defaultOptions = function() {
	return {};
}