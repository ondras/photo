Action.Scale = function() {
	Action.call(this);
	this._name = "Scale";
	this._throbber = "Scaling...";
}
Action.Scale.prototype = Object.create(Action.prototype);

Action.Scale.prototype.go = function(canvas, options) {
	var promise = Action.prototype.go.call(this, canvas, options);
	var options = this._mergeOptions(options);

	var width = options.width;
	var height = options.height;
	if (options.units == "rel") {
		width *= canvas.width;
		height *= canvas.height;
	}

	var result = document.createElement("canvas");
	result.width = Math.round(width);
	result.height = Math.round(height);
	var context = result.getContext("2d");

	context.webkitImageSmoothingEnabled = options.smooth;
	context.mozImageSmoothingEnabled = options.smooth;
	context.imageSmoothingEnabled = options.smooth;

	context.drawImage(canvas, 0, 0, result.width, result.height);

	promise.fulfill(result);

	return promise;
}

Action.Scale.prototype._defaultOptions = function() {
	return {
		units: "rel",
		width: 1,
		height: 1,
		smooth: true
	};
}
