var Photo = function(canvas) {
	this._canvas = canvas; /* original image data */
	this._previewCanvas = null; /* original image data */
	this._actions = [];
	this._actionIndex = -1;
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

Photo.prototype.drawPreview = function() {
	var source = this.getCanvas();
	var target = Preview.getCanvas();

	this._previewCanvas = document.createElement("canvas");
	this._previewCanvas = target.width;
	this._previewCanvas = target.height;
	this._previewCanvas.getContext("2d").drawImage(source, 0, 0, target.width, target.height);

	target.getContext("2d").drawImage(this._previewCanvas, 0, 0);
}

Photo.prototype.getCanvas = function() {
	return (this._actionIndex > -1 ? this._actions[this._actionIndex].getCanvas() : this._canvas);
}

Photo.prototype.getPreviewCanvas = function() {
	return this._previewCanvas;
}

Photo.prototype.addAction = function(action) {
	action.go(this.getCanvas()).then(function() {
		this._actions.push(action);
		this._actionIndex++;
		this.drawPreview();
	}.bind(this));
}