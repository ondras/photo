UI.Open = function(action) {
	UI.call(this, action);

	this._input = document.createElement("input");
	this._input.type = "file";
	this._input.addEventListener("change", this);

}
UI.Open.prototype = Object.create(UI.prototype);

UI.Open.prototype.show = function(parent) {
	UI.prototype.show.call(this, parent);

	parent.appendChild(this._input);

	/* FIXME does not reset preview */
}

UI.Open.prototype.handleEvent = function(e) {
	this._action.go(e.target.files[0]).then(function(photo) {
		App.setPhoto(photo);
	});
}