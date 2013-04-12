Action.Scale = function() {
	Action.call(this);
	this._name = "Scale";
	this._throbber = "Scaling...";
}
Action.Scale.prototype = Object.create(Action.prototype);

Action.Scale.prototype.go = function(canvas) {
	var promise = Action.prototype.go.call(this, canvas);

	var width = this._options.width;
	var height = this._options.height;
	if (this._options.units == "rel") {
		width *= canvas.width;
		height *= canvas.height;
	}

	var result = document.createElement("canvas");
	result.width = Math.round(width);
	result.height = Math.round(height);
	var context = result.getContext("2d");

	context.webkitImageSmoothingEnabled = this._options.smooth;
	context.mozImageSmoothingEnabled = this._options.smooth;
	context.imageSmoothingEnabled = this._options.smooth;

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
