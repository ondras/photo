UI.Invert = function(action, photo) {
	UI.call(this, action, photo);

	this._buildApply();
}
UI.Invert.prototype = Object.create(UI.prototype);

UI.Invert.prototype.show = function(parent) {
	UI.prototype.show.call(this, parent);

	parent.appendChild(this._apply);

	this._preview();
}

UI.Invert.prototype.handleEvent = function(e) {
	this._photo.setAction(this._action);
}
