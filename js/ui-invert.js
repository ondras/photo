UI.Invert = function(action) {
	UI.call(this, action);

	this._apply = document.createElement("input");
	this._apply.type = "button";
	this._apply.value = "Apply";
	this._apply.addEventListener("click", this);

}
UI.Invert.prototype = Object.create(UI.prototype);

UI.Invert.prototype.show = function(parent) {
	UI.prototype.show.call(this, parent);

	parent.appendChild(this._apply);

	var previewCanvas = App.photo.getPreviewCanvas(this._action);
	this._action.preview(previewCanvas);
}

UI.Invert.prototype.handleEvent = function(e) {
	App.photo.setAction(this._action);
}