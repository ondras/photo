var Slider = function(node, options) {
	this._node = node;
	this._nodeWidth = node.offsetWidth;
	this._left = null;
	
	this._clientX = null;
	this._startLeft = null;
	
	this._options = {
		width: 150,
		min: 0,
		max: 100,
		value: 50
	}
	for (var p in options) { this._options[p] = options[p]; }
	this.setValue(this._options.value);
	
	this._node.addEventListener("mousedown", this);
}

Slider.prototype.getValue = function() {
	return this._value;
}

Slider.prototype.setValue = function(value) {
	this._left = this._valueToLeft(value);
	this._node.style.left = this._left + "px";
}

Slider.prototype.handleEvent = function(e) {
	switch (e.type) {
		case "mousedown":
			e.preventDefault();
			this._clientX = e.clientX;
			this._startLeft = this._left;
			document.addEventListener("mousemove", this);
			document.addEventListener("mouseup", this);
		break;

		case "mousemove":
			var dx = e.clientX - this._clientX;
			var newValue = this._leftToValue(this._startLeft + dx);
			if (newValue < this._options.min || newValue > this._options.max) { return; }
			this._left = this._startLeft + dx;
			this._node.style.left = this._left+"px";
		break;

		case "mouseup":
			document.removeEventListener("mousemove", this);
			document.removeEventListener("mouseup", this);
			this.setValue(this._leftToValue(this._left));
		break;
	}
}

Slider.prototype._valueToLeft = function(value) {
	var diff = value-this._options.min;
	var step = this._options.width/(this._options.max-this._options.min);
	var center = diff*step;
	return center - this._nodeWidth/2;
}

Slider.prototype._leftToValue = function(left) {
	var center = left + this._nodeWidth/2;
	var step = this._options.width/(this._options.max-this._options.min);
	var diff = center/step;
	return this._options.min + diff;
}
