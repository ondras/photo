var Operation = function(options) {
	this._options = this._defaultOptions();
	for (var p in options) { this._options[p] = this._defaultOptions[p]; }
	this._source = null;
	this._target = null;
}

Operation.prototype.setSource = function(photo) {
	this._source = photo;
	return this;
}

Operation.prototype.getTarget = function() {
	return this._target;
}

Operation.prototype.go = function() {
	var promise = new Promise();
	return promise;
}

Operation.prototype._defaultOptions = function() {
	return {};
}