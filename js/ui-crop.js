UI.Crop = function(action, photo) {
	UI.call(this, action, photo);

	this._size = [null, null];
	this._selection = new Selection();
	this._selection.onchange = this;

	this._build();
}
UI.Crop.prototype = Object.create(UI.prototype);

UI.Crop.prototype.show = function(parent) {
	UI.prototype.show.call(this, parent);

	if (!this._photo.hasAction(this._action)) { /* configure defaults */
		var canvas = this._photo.getCanvas(this._action);
		var options = {
			x: Math.round(canvas.width/5),
			y: Math.round(canvas.height/5),
			w: Math.round(canvas.width*3/5),
			h: Math.round(canvas.height*3/5)
		}
		this._action.setOptions(options);
	}

	/* create preview canvas. only once, as opposed to other actions (they do it in _preview) */
	var canvas = this._photo.getCanvas(this._action);
	canvas = App.preview.draw(canvas, true);

	App.preview.showSelection(this._selection);
	parent.appendChild(this._table);
	parent.appendChild(this._apply);
	this._delete.style.display = (this._photo.hasAction(this._action) ? "" : "none");

	var options = this._action.getOptions();
	this._x.value = options.x;
	this._y.value = options.y;
	this._w.value = options.w;
	this._h.value = options.h;

	this._preview();
}

UI.Crop.prototype.hide = function() {
	App.preview.hideSelection(this._selection);
	UI.prototype.hide.call(this);
}

UI.Crop.prototype.handleEvent = function(e) {
	switch (e.type) {
		case "change":
			if (e.target == this._selection) {
				var data = this._selection.getPosition();
				var scale = App.preview.getScale();
				this._x.value = Math.round(data[0]/scale);
				this._y.value = Math.round(data[1]/scale);
				this._w.value = Math.round(data[2]/scale);
				this._h.value = Math.round(data[3]/scale);
			} else {
				this._syncInputs(e);
				this._preview();
			}
		break;

		case "click":
			if (e.target == this._apply) {
				this._action.setOptions(this._getOptions());
				this._photo.setAction(this._action);
			} else if (e.target == this._delete) {
				this._photo.deleteAction(this._action);
			}
		break;
	}
}

UI.Crop.prototype._build = function() {
	this._buildApply();
	this._buildDelete();

	this._table = document.createElement("table");

	this._x = this._buildInput();
	this._y = this._buildInput();
	this._w = this._buildInput();
	this._h = this._buildInput();

	this._table.appendChild(this._buildRow("Position:", this._x, ", ", this._y));
	this._table.appendChild(this._buildRow("Size:", this._w, "×", this._h));
}

UI.Crop.prototype._syncInputs = function(e) {

}

UI.Crop.prototype._preview = function() {
	var scale = App.preview.getScale();
	var options = this._getOptions();

	options.x *= scale;
	options.y *= scale;
	options.w *= scale;
	options.h *= scale;
	
	this._selection.setPosition(options.x, options.y, options.w, options.h);
}

UI.Crop.prototype._buildInput = function() {
	var input = document.createElement("input");
	input.type = "text";
	input.size = 3;
	input.addEventListener("change", this);
	return input;
}

UI.Crop.prototype._getOptions = function() {
	return {
		x: parseInt(this._x.value),
		y: parseInt(this._y.value),
		w: parseInt(this._w.value),
		h: parseInt(this._h.value)
	}
}
