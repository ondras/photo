var App = {
	photo: null,
	
	init: function() {
		document.body.appendChild(Preview.getCanvas());

		var load = document.querySelector("input[type=file]");

		Promise.event(load, "change").then(function(e) {
			return Photo.fromFile(e.target.files[0]);
		}).then(function(photo) {
			this.photo = photo;
			photo.drawPreview()
		}.bind(this));

		document.querySelector("#apply").addEventListener("click", this._clickApply.bind(this));
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

	_clickApply: function(e) {
		var name = document.querySelector("#operation").value;
		if (!name) { return; }
		var obj = Operation[name.charAt(0).toUpperCase() + name.substring(1)];
		var inst = new obj();

		this.photo.addOperation(inst);
	},

	_operationDone: function(canvas) {
		Preview.setData(data);
	}
}