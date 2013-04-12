var App = {
	_photo: null,

	_config: null, /* FIXME clearing is problematic */
	_actions: null,
	_preview: null,
	
	init: function() {
		this._config = document.querySelector("#config");
		this._actions = document.querySelector("#actions");
		this._preview = document.querySelector("#preview");
		this._throbber = document.querySelector("#throbber");

		this._actions.selectedIndex = 0;
		this._actions.addEventListener("change", this._changeAction.bind(this));
		var options = this._actions.querySelectorAll("option");
		for (var i=2;i<options.length;i++) { options[i].disabled = true; }

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
		this._photo = photo;
		var options = this._actions.querySelectorAll("option");
		for (var i=2;i<options.length;i++) { options[i].disabled = false; }
		
		this._actions.parentNode.insertBefore(this._photo.getHistorySelect(), this._actions.nextSibling);
	},
	
	showUI: function(ui) {
		ui.show(this._config);
	},

	resetActions: function() {
		this._config.innerHTML = "";
		this._actions.selectedIndex = 0;
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
		if (this._photo) { this._photo.resetHistory(); } /* interrupt any opened history */
		if (e.target.selectedIndex == 0) { return; }

		var name = e.target.value;
		if (!name) { return; }
		name = this._capitalize(name);

		var action = new Action[name]();
		var ui = new UI[name](action, this._photo);
		ui.show(this._config);
	},

	_capitalize: function(str) {
		return str.charAt(0).toUpperCase() + str.substring(1);
	}

}
