UI.Normalize = function(action, photo) {
	UI.call(this, action, photo);

	var options = action.getOptions();
	this._padding = document.createElement("input");
	this._padding.size = 3;
	this._padding.value = options.padding;
	this._padding.addEventListener("change", this);

	this._buildApply();
	this._buildDelete();

}
UI.Normalize.prototype = Object.create(UI.prototype);

UI.Normalize.prototype.show = function(parent) {
	UI.prototype.show.call(this, parent);

	parent.appendChild(this._padding);
	parent.appendChild(this._apply);
	if (this._photo.hasAction(this._action)) { parent.appendChild(this._delete); }

	this._preview();
}

UI.Normalize.prototype.handleEvent = function(e) {
	switch (e.type) {
		case "click":
			if (e.target == this._apply) {
				this._photo.setAction(this._action);
			} else if (e.target == this._delete) {
				this._photo.deleteAction(this._action);
			}
		break;

		case "change":
			var options = this._action.getOptions();
			options.padding = parseInt(this._padding.value);
			this._action.setOptions(options);
			this._preview();
		break;
	}
}
