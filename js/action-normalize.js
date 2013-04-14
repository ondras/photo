Action.Normalize = function() {
	Action.call(this);
	this._name = "Normalize";
	this._throbber = "Normalizing...";
}
Action.Normalize.prototype = Object.create(Action.prototype);

Action.Normalize.prototype.go = function(canvas) {
	var promise = Action.prototype.go.call(this, canvas);
	var id = this._canvasToImageData(canvas);

	var count = id.width*id.height;
	var min = 255;
	var max = 0;

	for (var i=0;i<count;i++) {
		var r = id.data[4*i+0];
		var g = id.data[4*i+1];
		var b = id.data[4*i+2];
		min = Math.min(min, r, g, b);
		max = Math.max(max, r, g, b);
	}

	/* min and max muset be scaled via linear transformation: min => padding, max => 255-padding */
	if (max != min) {
		var a = (255 - 2*this._options.padding) / (max - min);
		var b = this._options.padding - a*min;
	} else { /* noop */
		var a = 1;
		var b = 0;
	}

	var def = {
		r: {a:a, b:b},
		g: {a:a, b:b},
		b: {a:a, b:b}
	}

	this._runInWorker(promise, {method:"linear", args: [id, def]});
	return promise;
}

Action.Normalize.prototype._defaultOptions = function() {
	return {
		padding: 0
	};
}
