UI.Invert = function(action, photo) {
	UI.call(this, action, photo);

	var options = action.getOptions();
	this._r = this._buildCheckbox("Red", options.r);
	this._g = this._buildCheckbox("Green", options.g);
	this._b = this._buildCheckbox("Blue", options.b);

	this._buildApply();
	this._buildDelete();

}
UI.Invert.prototype = Object.create(UI.prototype);

UI.Invert.prototype.show = function(parent) {
	UI.prototype.show.call(this, parent);

	parent.appendChild(this._r);
	parent.appendChild(this._g);
	parent.appendChild(this._b);
	parent.appendChild(this._apply);

	if (this._photo.hasAction(this._action)) { parent.appendChild(this._delete); }

	this._preview();
}

UI.Invert.prototype.handleEvent = function(e) {
	switch (e.type) {
		case "click":
			if (e.target == this._apply) {
				this._action.setOptions(this._getOptions());
				this._photo.setAction(this._action);
			} else if (e.target == this._delete) {
				this._photo.deleteAction(this._action);
			}
		break;

		case "change":
			this._preview();
		break;
	}
}

UI.Invert.prototype._getOptions = function() {
	return {
		r: this._getCheckboxState(this._r),
		g: this._getCheckboxState(this._g),
		b: this._getCheckboxState(this._b)
	}
}