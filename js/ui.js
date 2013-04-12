var UI = function(action, photo) {
	this._action = action;
	this._photo = photo;
}

UI.prototype.show = function(parent) {
	parent.innerHTML = "";
}

UI.prototype._buildApply = function() {
	this._apply = this._buildButton("Apply");
	this._apply.className = "apply";
}

UI.prototype._buildDelete = function() {
	this._delete = this._buildButton("Delete");
	this._delete.className = "delete";
}

UI.prototype._preview = function() {
	var canvas = this._photo.getPreviewCanvas(this._action);
	this._action.go(canvas).then(function(canvas) {
		Preview.getCanvas().getContext("2d").drawImage(canvas, 0, 0);
	});
}

UI.prototype._buildButton = function(value) {
	var result = document.createElement("button");
	result.innerHTML = value;
	result.addEventListener("click", this);
	return result;
}

UI.prototype._buildCheckbox = function(label, checked) {
	var result = document.createElement("label");
	result.innerHTML = " " + label;

	var input = document.createElement("input");
	input.type = "checkbox";
	input.checked = checked;
	input.addEventListener("change", this);

	result.insertBefore(input, result.firstChild);
	return result;
}

UI.prototype._getCheckboxState = function(label) {
	return label.querySelector("input").checked;
}