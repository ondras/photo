var Photo = function(canvas) {
	this._canvas = canvas;
}

Photo.fromFile = function(file) {
	var promise = new Promise();

	var fr = new FileReader();
	fr.addEventListener("load", function(e) {
		var img = document.createElement("img");
		img.addEventListener("load", function(e) {
			var canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			var context = canvas.getContext("2d");
			context.drawImage(img, 0, 0, canvas.width, canvas.height);

			promise.fulfill(new Photo(canvas));
		});
		img.src = e.target.result;

	});
	fr.readAsDataURL(file);

	return promise;
}

Photo.prototype.drawTo = function(canvas) {
	canvas.getContext("2d").drawImage(this._canvas, 0, 0, canvas.width, canvas.height);
}