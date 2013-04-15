UI.Normalize = function(action, photo) {
	UI.call(this, action, photo);

	this._arrow = document.createElement("span");
	this._arrow.innerHTML = "▲";
	this._padding = document.createElement("input");
	this._padding.type = "text";
	this._padding.size = 2;

	this._width = 50;

	var opts = {
		min: 0,
		max: this._width,
		step: 1,
		width: this._width
	}
	this._slider = new Slider(this._arrow, this._padding, opts);
	this._slider.onchange = this;

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

	var span = document.createElement("span");
	span.innerHTML = "Padding:";
	span.style.marginRight = "15px";
	this._parent.appendChild(span);
	this._parent.appendChild(parent);
	this._parent.appendChild(this._padding);
	this._parent.appendChild(document.createElement("p"));
	this._parent.appendChild(this._apply);
	if (this._photo.hasAction(this._action)) { this._parent.appendChild(this._delete); }

	this._slider.setValue(this._action.getOptions().padding);

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
			options.padding = this._slider.getValue();
			this._action.setOptions(options);
			this._preview();
		break;
	}
}
