var App = {
	_photo: null,
	_ui: null,
	preview: null,

	_config: null,
	_actions: null,
	
	init: function() {
		this.preview = new Preview(document.querySelector("#preview"));

		this._config = document.querySelector("#config");
		this._actions = document.querySelector("#actions");
		this._throbber = document.querySelector("#throbber");

		this._actions.selectedIndex = 0;
		this._actions.addEventListener("change", this._changeAction.bind(this));
		var options = this._actions.querySelectorAll("option");

		for (var i=0;i<options.length;i++) {
			var name = options[i].value;
			if (!name) { continue; }
			name = this._capitalize(name);
			var action = new Action[name]();
			options[i].innerHTML = action.getName();
		}

		for (var i=2;i<options.length;i++) { options[i].disabled = true; }

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
		if (this._photo) {
			var select = this._photo.getHistorySelect();
			select.parentNode.removeChild(select);
		}
		
		this._photo = photo;
		var options = this._actions.querySelectorAll("option");
		for (var i=2;i<options.length;i++) { options[i].disabled = false; }
		
		this._actions.parentNode.insertBefore(this._photo.getHistorySelect(), this._actions.nextSibling);

		this.resetActions();
		this.preview.computeZoom(photo.getCanvas());
	},
	
	showUI: function(ui) {
		if (this._ui) { this._ui.hide(); }
		this._ui = ui;
		if (this._ui) { this._ui.show(this._config); }
		return this;
	},

	resetActions: function() {
		this.showUI(null);
		this._actions.selectedIndex = 0;
	},

	invalidatePreview: function() { /* preview changed, need to update as necessary */
		if (this._photo) { this._photo.invalidatePreview(); }
		if (this._ui) { this._ui.invalidatePreview(); }
	},

	_changeAction: function(e) { /* pick a new action to preview & perform */
		if (this._photo) { this._photo.resetHistory(); } /* interrupt any opened history */
		if (e.target.selectedIndex == 0) { return; }

		var name = e.target.value;
		if (!name) { return; }
		name = this._capitalize(name);

		var action = new Action[name]();
		var ui = new UI[name](action, this._photo);
		this.showUI(ui);
	},

	_capitalize: function(str) {
		return str.charAt(0).toUpperCase() + str.substring(1);
	}

}
