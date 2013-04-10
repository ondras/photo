var Photo = function(canvas) {
	this._canvas = canvas; /* original image data */
	this._operations = [];
	this._operationIndex = -1;
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
	target.getContext("2d").drawImage(source, 0, 0, target.width, target.height);
}

Photo.prototype.getCanvas = function() {
	return (this._operationIndex > -1 ? this._operations[this._operationIndex].getCanvas() : this._canvas);
}

Photo.prototype.addOperation = function(operation) {
	operation.go(this.getCanvas()).then(function() {
		this._operations.push(operation);
		this._operationIndex++;
		this.drawPreview();
	}.bind(this));
}