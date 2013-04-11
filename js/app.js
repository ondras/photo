var App = {
	photo: null,

	_config: null,
	_actions: null,
	_history: null,
	_preview: null,
	
	init: function() {
		this._config = document.querySelector("#config");
		this._actions = document.querySelector("#actions");
		this._history = document.querySelector("#history");
		this._preview = document.querySelector("#preview");

		this.resetSelects();

		this._actions.addEventListener("change", this._changeAction.bind(this));
		this._history.addEventListener("change", this._changeHistory.bind(this));

		this._preview.appendChild(Preview.getCanvas());
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

	resetSelects: function(e) {
		this._actions.selectedIndex = -1;
		this._history.selectedIndex = -1;
		this._config.innerHTML = "";

		if (this.photo) { this.photo.drawPreview(); }
	},

	_changeAction: function(e) { /* pick a new action to preview & perform */
		if (e.target.selectedIndex == 0) { 
			this.resetSelects();
			return;
		}

		this._history.selectedIndex = -1;
		this._config.innerHTML = "";
		if (this.photo) { this.photo.drawPreview(); }

		var name = e.target.value;
		if (!name) { return; }
		name = this._capitalize(name);

		var action = new Action[name]();
		var ui = new UI[name](action);
		ui.show(this._config);
	},

	_changeHistory: function(e) { /* pick a history item */
		if (e.target.selectedIndex == 0) { 
			this.resetSelects();
			return;
		}

		this._actions.selectedIndex = -1;
		var action = this.photo.getAction(e.target.selectedIndex-1); /* first is label */

		/* fixme bad practice */
		var name = "";
		for (var p in Action) {
			if (action instanceof Action[p]) { name = p; }
		}

		var ui = new UI[name](action);
		ui.show(this._config);
	},

	_capitalize: function(str) {
		return str.charAt(0).toUpperCase() + str.substring(1);
	}

}