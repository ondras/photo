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
		this._throbber = document.querySelector("#throbber");

		this._actions.selectedIndex = 0;
		this._actions.addEventListener("change", this._changeAction.bind(this));
		var options = this._actions.querySelectorAll("option");
		for (var i=2;i<options.length;i++) { options[i].disabled = true; }

		this._history.selectedIndex = -1;
		this._history.addEventListener("change", this._changeHistory.bind(this));

		this._preview.appendChild(Preview.getCanvas());

		this.hideThrobber();
	},

	showThrobber: function(label) {
		this._throbber.innerHTML = label;
		this._throbber.style.display = "";
	},

	hideThrobber: function() {
		this._throbber.style.display = "none";
	},

	setPhoto: function(photo) {
		/* fixme existing photo */
		this.photo = photo;
		var options = this._actions.querySelectorAll("option");
		for (var i=2;i<options.length;i++) { options[i].disabled = false; }

		this.resetHistory();
	},

	addHistory: function(action) {
		var o = document.createElement("option");
		o.innerHTML = action.getName();
		this._history.appendChild(o);
		this._actions.selectedIndex = 0;

		this.resetHistory();
	},

	resetHistory: function() { /* move to last history item */
		this._history.selectedIndex = -1;
		this._config.innerHTML = "";
		if (this.photo) { this.photo.drawPreview(); }
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

	_changeAction: function(e) { /* pick a new action to preview & perform */
		this.resetHistory();

		if (e.target.selectedIndex == 0) { return; }

		var name = e.target.value;
		if (!name) { return; }
		name = this._capitalize(name);

		var action = new Action[name]();
		var ui = new UI[name](action);
		ui.show(this._config);
	},

	_changeHistory: function(e) { /* pick a history item */
		this._actions.selectedIndex = 0;
		if (this.photo) { this.photo.drawPreview(e.target.selectedIndex); } /* draw history preview */

		if (e.target.selectedIndex == 0) {
			this._config.innerHTML = "";
			return;
		}

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