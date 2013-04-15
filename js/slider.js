var Slider = function(node, input, options) {
	this.onchange = null;
	this._node = node;
	this._input = input;
	this._node.style.cursor = "move";
	this._left = null;
	
	this._clientX = null;
	this._startLeft = null;
	
	this._options = {
		width: 150,
		min: 0,
		max: 100,
		value: 50,
		step: 1
	}
	for (var p in options) { this._options[p] = options[p]; }
	this.setValue(this._options.value);
	
	this._node.addEventListener("mousedown", this);
	if (this._input) { this._input.addEventListener("change", this); }
}

Slider.prototype.getValue = function() {
	return this._leftToValue(this._left);
}

Slider.prototype.setValue = function(value) {
	if (this._input) { this._input.value = value; }
	this._left = this._valueToLeft(value);
	this._node.style.left = this._left + "px";
	this._node.title = value;
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
			if (newValue < this._options.min || newValue > this._options.max) { 
				newValue = Math.max(newValue, this._options.min);
				newValue = Math.min(newValue, this._options.max);
				dx = this._valueToLeft(newValue) - this._startLeft;
			}
			if (this._input) { this._input.value = newValue; }
			this._left = this._startLeft + dx;
			this._node.style.left = this._left+"px";
		break;

		case "mouseup":
			document.removeEventListener("mousemove", this);
			document.removeEventListener("mouseup", this);
			this.setValue(this._leftToValue(this._left));
			if (this.onchange) { this.onchange.handleEvent({type:"change", target:this}); }
		break;
		
		case "change":
			var value = parseFloat(this._input.value); 
			if (this._options.step) { /* round to step */
				value = this._options.step * Math.round(value / this._options.step);
			}
			value = Math.max(value, this._options.min);
			value = Math.min(value, this._options.max);
			this.setValue(value);
			if (this.onchange) { this.onchange.handleEvent({type:"change", target:this}); }
		break;
	}
}

Slider.prototype._valueToLeft = function(value) {
	var diff = value-this._options.min;
	var step = this._options.width/(this._options.max-this._options.min);
	var center = diff*step;
	return Math.round(center - this._node.offsetWidth/2);
}

Slider.prototype._leftToValue = function(left) {
	var center = left + this._node.offsetWidth/2;
	var step = this._options.width/(this._options.max-this._options.min);
	var diff = center/step;
	var value = this._options.min + diff;
	if (this._options.step) { /* round to step */
		value = this._options.step * Math.round(value / this._options.step);
	}
	return value;
}
