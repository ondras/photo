UI.Open = function(action) {
	UI.call(this, action, null);

	this._input = document.createElement("input");
	this._input.type = "file";
	this._input.addEventListener("change", this);

}
UI.Open.prototype = Object.create(UI.prototype);

UI.Open.prototype.show = function(parent) {
	UI.prototype.show.call(this, parent);

	parent.appendChild(this._input);
}

UI.Open.prototype.handleEvent = function(e) {
	this._action.go(e.target.files[0]).then(function(photo) {
		App.setPhoto(photo);
	});
}

UI.Open.prototype.invalidatePreview = function() {} /* no preview */