var Action = function() {
	this._options = this._defaultOptions();
	this._name = "";
	this._throbber = "";
}

Action.prototype.getName = function() {
	return this._name;
}

Action.prototype.setOptions = function(options) {
	for (var p in options) { this._options[p] = options[p]; }
		return this;
}

Action.prototype.getOptions = function(options) {
	return this._options;
}

Action.prototype.go = function(canvas) {
	var promise = new Promise();
	return promise;
}

Action.prototype._defaultOptions = function() {
	return {};
}

Action.prototype._runInWorker = function(promise, data) {
	App.showThrobber(this._throbber);
	Promise.worker("worker.js", data).then(function(id) {
		var canvas = App.imageDataToCanvas(id);
		App.hideThrobber();
		promise.fulfill(canvas);
	}.bind(this));
}