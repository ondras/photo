Action.Histogram = function() {
	Action.call(this);
	this._name = "Histogram";
	this._throbber = "Computing histogram...";
}
Action.Histogram.prototype = Object.create(Action.prototype);

Action.Histogram.draw = function(data, width, height) {
	var canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	var context = canvas.getContext("2d");
	context.fillStyle = "#000";
	
	var totals = new Array(width);
	for (var i=0;i<totals.length;i++) { totals[i] = 0; }
	var max = 0;

	for (var i=0;i<data.length;i++) {
		var index = Math.floor(i*width/data.length);
		totals[index] += data[i];
		max = Math.max(max, totals[index]);
	}
	
	var scale = height/max;
	
	for (var i=0;i<totals.length;i++) {
		var value = totals[i];
		if (!value) { continue; }
		value *= scale;
		
		context.fillRect(i, height - value, 1, value); 
	}
	
	return canvas;
}

Action.Histogram.prototype.go = function(canvas) {
	var promise = Action.prototype.go.call(this, canvas);
	var id = this._canvasToImageData(canvas);

	var data = {method:"histogram", args: [id]};
	App.showThrobber(this._throbber);
	Promise.worker("worker.js", data).then(function(histogram) {
		App.hideThrobber();
		promise.fulfill(histogram);
	}.bind(this));

	return promise;
}
