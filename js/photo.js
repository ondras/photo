var Photo = function(canvas) {
	this._canvas = canvas;
}

Photo.fromFile = function(file) {
	var promise = new Promise();

	var fr = new FileReader();
	Promise.event(fr, "load").then(function(e) {
		var img = document.createElement("img");
		img.src = e.target.result;
		return Promise.event(img, "load");
	}).then(function(e) {
		var canvas = document.createElement("canvas");
		canvas.width = e.target.width;
		canvas.height = e.target.height;
		var context = canvas.getContext("2d");
		context.drawImage(e.target, 0, 0, canvas.width, canvas.height);
		promise.fulfill(new Photo(canvas));
	});
	fr.readAsDataURL(file);
	return promise;
}

Photo.prototype.drawTo = function(canvas) {
	canvas.getContext("2d").drawImage(this._canvas, 0, 0, canvas.width, canvas.height);
}

Photo.prototype.getData = function() {
	return this._canvas.getContext("2d").getImageData(0, 0, this._canvas.width, this._canvas.height);
}
