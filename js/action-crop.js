Action.Crop = function() {
	Action.call(this);
	this._name = "Crop";
	this._throbber = "Cropping...";
}
Action.Crop.prototype = Object.create(Action.prototype);

Action.Crop.prototype.go = function(canvas, options) {
	var promise = Action.prototype.go.call(this, canvas, options);
	var options = this._mergeOptions(options);

	var result = document.createElement("canvas");
	result.width = options.w;
	result.height = options.h;
	var context = result.getContext("2d");

	context.drawImage(canvas, 
		options.x, options.y, options.w, options.h,
		0, 0, result.width, result.height
	);

	promise.fulfill(result);

	return promise;
}

Action.Crop.prototype._defaultOptions = function() {
	return {
		x: 0,
		y: 0,
		w: 100,
		h: 100
	};
}
