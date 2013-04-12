UI.Scale = function(action, photo) {
	UI.call(this, action, photo);

	this._size = [null, null];
	this._getSize();

	this._build();
}
UI.Scale.prototype = Object.create(UI.prototype);

UI.Scale.prototype.show = function(parent) {
	UI.prototype.show.call(this, parent);

	parent.appendChild(this._table);

	var options = this._action.getOptions();
	this._units.value = options.units;
	this._smooth.checked = options.smooth;
	if (this._units.value == "abs") {
		this._width.value = options.width;
		this._height.value = options.height;
	} else {
		this._width.value = 100*options.width;
		this._height.value = 100*options.height;
	}

	this._delete.style.display = (this._photo.hasAction(this._action) ? "" : "none");
	this._preview();
}

UI.Scale.prototype.handleEvent = function(e) {
	switch (e.type) {
		case "change":
			this._syncInputs(e);

			var options = this._action.getOptions();
			options.units = this._units.value;
			options.smooth = this._smooth.checked;
			if (this._units.value == "abs") {
				options.width = parseFloat(this._width.value);
				options.height = parseFloat(this._height.value);
			} else {
				options.width = parseFloat(this._width.value)/100;
				options.height = parseFloat(this._height.value)/100;
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

UI.Scale.prototype._build = function() {
	this._buildApply();
	this._buildDelete();
	this._table = document.createElement("table");

	this._width = document.createElement("input");
	this._width.type = "text";
	this._width.size = 5;
	this._width.addEventListener("change", this);

	this._height = document.createElement("input");
	this._height.type = "text";
	this._height.size = 5;
	this._height.addEventListener("change", this);

	this._units = document.createElement("select");
	var rel = document.createElement("option");
	rel.value = "rel";
	rel.innerHTML = "%";
	this._units.appendChild(rel);
	var abs = document.createElement("option");
	abs.value = "abs";
	abs.innerHTML = "px";
	this._units.appendChild(abs);
	this._units.addEventListener("change", this);

	this._aspect = document.createElement("input");
	this._aspect.type = "checkbox";
	this._aspect.id = "aspect";
	this._aspect.checked = true;
	this._aspect.addEventListener("change", this);

	var aspectLabel = document.createElement("label");
	aspectLabel.htmlFor = "aspect";
	aspectLabel.innerHTML = "Fixed ratio:";

	this._smooth = document.createElement("input");
	this._smooth.type = "checkbox";
	this._smooth.id = "smooth";
	this._smooth.addEventListener("change", this);

	var smoothLabel = document.createElement("label");
	smoothLabel.htmlFor = "smooth";
	smoothLabel.innerHTML = "Smooth:";

	this._table.appendChild(this._buildRow("Units:", this._units));
	this._table.appendChild(this._buildRow(aspectLabel, this._aspect));
	this._table.appendChild(this._buildRow("Width:", this._width));
	this._table.appendChild(this._buildRow("Height:", this._height));
	this._table.appendChild(this._buildRow(smoothLabel, this._smooth));
	this._table.appendChild(this._buildRow(this._apply, this._delete));
}

UI.Scale.prototype._syncInputs = function(e) {
	var aspect = this._aspect.checked;
	var ratio = this._size[0]/this._size[1];

	switch (e.target) {
		case this._aspect:
			if (!aspect) { return; }
			this._height.value = parseFloat(this._width.value) / ratio;
		break;

		case this._units:
			if (this._units.value == "abs") { /* rel => abs */
				this._width.value = this._size[0] * parseFloat(this._width.value) / 100;
				this._height.value = this._size[1] * parseFloat(this._height.value) / 100;
			} else { /* abs => rel */
				this._width.value = 100 * parseFloat(this._width.value) / this._size[0];
				this._height.value = 100 * parseFloat(this._height.value) / this._size[1];
			}
		break;

		case this._width:
			if (!aspect) { return; }
			if (this._units.value == "abs") {
				this._height.value = parseFloat(this._width.value) / ratio;
			} else {
				this._height.value = this._width.value;
			}
		break;

		case this._height:
			if (!aspect) { return; }
			if (this._units.value == "abs") {
				this._width.value = parseFloat(this._height.value) * ratio;
			} else {
				this._width.value = this._height.value;
			}
		break;
	}
}

UI.Scale.prototype._getSize = function() {
	var canvas = this._photo.getCanvas(this._action);
	this._size[0] = canvas.width;
	this._size[1] = canvas.height;
}