var UI = function(action, photo) {
	this._action = action;
	this._photo = photo;
}

UI.prototype.show = function(parent) {
	parent.innerHTML = "";
}

UI.prototype._buildApply = function() {
	this._apply = document.createElement("input");
	this._apply.type = "button";
	this._apply.value = "Apply";
	this._apply.addEventListener("click", this);
}

UI.prototype._preview = function() {
	this._action.go(this._photo.getPreviewCanvas()).then(function(canvas) {
		Preview.getCanvas().getContext("2d").drawImage(canvas, 0, 0);
	});
}
