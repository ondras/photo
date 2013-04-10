var App = {
	_photo: null,
	_
	
	init: function() {
		document.body.appendChild(Preview.getCanvas());

		var load = document.querySelector("input[type=file]");

		Promise.event(load, "change").then(function(e) {
			return Photo.fromFile(e.target.files[0]);
		}).then(function(photo) {
			this._photo = photo;
			photo.drawPreview();
		}.bind(this));

		document.querySelector("operation").addEventListener("change", this._changeOperation.bind(this));
//		document.querySelector("#apply").addEventListener("click", this._clickApply.bind(this));
	},

	canvasToImageData: function(canvas) {
		return canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
	},

	imageDataToCanvas: function(id) {
		var canvas = document.createElement("canvas");
		canvas.width = id.width;
		canvas.height = id.height;
		canvas.getContext("2d").putImageData(id, 0, 0);
		return canvas;
	},

	_changeOperation: function(e) {
		var name = document.querySelector("#operation").value;
		if (!name) { return; }
		var obj = Operation[name.charAt(0).toUpperCase() + name.substring(1)];
		this._config.innerHTML = "";
		obj.showUI(this._config);

	},

	_clickApply: function(e) {
		var name = document.querySelector("#operation").value;
		if (!name) { return; }
		var obj = Operation[name.charAt(0).toUpperCase() + name.substring(1)];
		var inst = new obj();

		this._photo.addOperation(inst);
	}
}