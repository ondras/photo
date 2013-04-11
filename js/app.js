var App = {
	photo: null,
	_config: null,
	_actions: null,
	
	init: function() {
		this._config = document.querySelector("#config");
		this._actions = document.querySelector("#actions");

		document.querySelector("#preview").appendChild(Preview.getCanvas());
		this._actions.addEventListener("change", this._changeAction.bind(this));
		this._actions.selectedIndex = 0;
	},

	setPhoto: function(photo) {
		this.photo = photo;
		photo.drawPreview();
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

	resetAction: function(e) {
		this._actions.selectedIndex = 0;
		this._config.innerHTML = "";
		if (this.photo) { this.photo.drawPreview(); }
	},

	_changeAction: function(e) {
		this._config.innerHTML = "";
		if (this.photo) { this.photo.drawPreview(); }

		var name = e.target.value;
		if (!name) { return; }
		name = this._capitalize(name);

		var action = new Action[name]();
		var ui = new UI[name](action);
		ui.show(this._config);
	},

	_capitalize: function(str) {
		return str.charAt(0).toUpperCase() + str.substring(1);
	}

}