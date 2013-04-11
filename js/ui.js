var UI = function(action) {
	this._action = action;
	this._previewCanvas = null;
}

UI.prototype.show = function(parent) {
	parent.innerHTML = "";
	if (App.photo) { this._previewCanvas = App.photo.getPreviewCanvas(this._action); }
}

UI.prototype._buildApply = function() {
	this._apply = document.createElement("input");
	this._apply.type = "button";
	this._apply.value = "Apply";
	this._apply.addEventListener("click", this);
}

UI.prototype._preview = function() {
	this._action.go(this._previewCanvas).then(function(canvas) {
		Preview.getCanvas().getContext("2d").drawImage(canvas, 0, 0);
	});
}