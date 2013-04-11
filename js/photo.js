var Photo = function(canvas) {
	this._canvas = canvas; /* original image data */
	this._previewCanvas = null; /* final preview */
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
	this._previewCanvas.width = target.width;
	this._previewCanvas.height = target.height;
	this._previewCanvas.getContext("2d").drawImage(source, 0, 0, target.width, target.height);

	target.getContext("2d").drawImage(this._previewCanvas, 0, 0);
}

Photo.prototype.getCanvas = function() {
	/* fixme private? */
	return (this._actionIndex > -1 ? this._actions[this._actionIndex].getCanvas() : this._canvas);
}

Photo.prototype.getPreviewCanvas = function(forAction) {
	/* FIXME forAction */
	return this._previewCanvas;
}

Photo.prototype.setAction = function(action) {
	var index = this._actions.indexOf(action);
	if (index == -1) { /* new action */
		action.go(this.getCanvas()).then(function() {
			this._actions.push(action);
			this._actionIndex++;
			App.resetAction();

			var o = document.createElement("option");
			o.innerHTML = action.getName();
			document.querySelector("#history").appendChild(o);


		}.bind(this));

	} else { /* modification of an old action */

	}
}

Photo.prototype.getAction = function(index) {
	return this._actions[index];
}