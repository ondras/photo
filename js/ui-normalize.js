UI.Normalize = function(action, photo) {
	UI.call(this, action, photo);

	var options = action.getOptions();

	this._arrow = document.createElement("span");
	this._arrow.innerHTML = "▲";

	this._width = 50;

	var opts = {
		min: 0,
		max: this._width,
		step: 1,
		width: this._width
	}
	this._padding = new Slider(this._arrow, opts);
	this._padding.onchange = this;

	this._buildApply();
	this._buildDelete();

}
UI.Normalize.prototype = Object.create(UI.prototype);

UI.Normalize.prototype.show = function(parent) {
	UI.prototype.show.call(this, parent);

	var parent = document.createElement("div");
	parent.className = "slider";
	parent.style.width = this._width+"px";
	parent.style.display = "inline-block";
	parent.appendChild(this._arrow);

	this._parent.appendChild(document.createTextNode("Padding: "));
	this._parent.appendChild(parent);
	this._parent.appendChild(this._apply);
	if (this._photo.hasAction(this._action)) { this._parent.appendChild(this._delete); }

	this._padding.setValue(this._action.getOptions().padding);

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
			options.padding = this._padding.getValue();
			this._action.setOptions(options);
			this._preview();
		break;
	}
}
