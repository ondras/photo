var UI = function(action, photo) {
	this._action = action;
	this._photo = photo;
	this._parent = null;
}

UI.prototype.show = function(parent) {
	this._parent = parent;
	parent.innerHTML = "<h2>" + this._action.getName() + "</h2>";
}

UI.prototype.hide = function() {
	this._parent.innerHTML = "";
}

UI.prototype.invalidatePreview = function() {
	this._preview();
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
	var canvas = this._photo.getCanvas(this._action);
	canvas = App.preview.draw(canvas, true); /* create preview canvas */

	this._action.go(canvas).then(function(canvas) {
		App.preview.draw(canvas, false); /* draw preview canvas */
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

UI.prototype._buildRow = function(a, b) {
	var row = document.createElement("tr");
	var td1 = document.createElement("td");
	var td2 = document.createElement("td");

	if (typeof(a) == "string") { td1.innerHTML = a; } else { td1.appendChild(a); }
	if (typeof(b) == "string") { td2.innerHTML = b; } else { td2.appendChild(b); }
	row.appendChild(td1);
	row.appendChild(td2);

	return row;
}
