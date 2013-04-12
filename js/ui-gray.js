UI.Gray = function(action, photo) {
	UI.call(this, action, photo);

	this._buildApply();
	this._buildDelete();

	var mode = action.getOptions().mode;
	this._modes = [];
	this._modes.push(this._buildItem(0, "Lightness", mode == 0));
	this._modes.push(this._buildItem(1, "Luminosity", mode == 1));
	this._modes.push(this._buildItem(2, "Average", mode == 2));
}
UI.Gray.prototype = Object.create(UI.prototype);

UI.Gray.prototype.show = function(parent) {
	UI.prototype.show.call(this, parent);

	for (var i=0;i<this._modes.length;i++) {
		parent.appendChild(this._modes[i]);
	}

	parent.appendChild(this._apply);
	if (this._photo.hasAction(this._action)) { parent.appendChild(this._delete); }

	this._preview();
}

UI.Gray.prototype.handleEvent = function(e) {
	switch (e.type) {
		case "change":
			var options = this._action.getOptions();
			for (var i=0;i<this._modes.length;i++) {
				var input = this._modes[i].querySelector("input");
				if (input.checked) { options.mode = parseInt(input.value); }
			}
			this._action.setOptions(options);
			this._preview();
		break;

		case "click":
			if (e.target == this._apply) {
				this._photo.setAction(this._action);
			} else if (e.target == this._delete) {
				this._photo.deleteAction(this._action);
			}
		break;
	}
}

UI.Gray.prototype._buildItem = function(value, label, checked) {
	var input = document.createElement("input");
	input.type = "radio";
	input.name = "gray";
	input.value = value;
	input.checked = checked;

	var result = document.createElement("label");
	result.innerHTML = " " + label;
	result.insertBefore(input, result.firstChild);

	input.addEventListener("change", this);
	return result;
}