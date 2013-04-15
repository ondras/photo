UI.Balance = function(action, photo) {
	UI.call(this, action, photo);
	
	this._width = 256;

	this._arrows = [];
	this._sliders = [];
	this._inputs = [];

	var opts = {
		min: -128,
		max: 128,
		step: 2,
		width: this._width
	}

	for (var i=0;i<3;i++) {
		var arrow = document.createElement("span");
		arrow.innerHTML = "▲";
		var input = document.createElement("input");
		input.type = "text";
		input.size = 2;
		input.style.marginLeft = "15px";
		
		var slider = new Slider(arrow, input, opts);
		slider.onchange = this;

		this._arrows.push(arrow);
		this._inputs.push(input);
		this._sliders.push(slider);
	}

	this._buildApply();
	this._buildDelete();

}
UI.Balance.prototype = Object.create(UI.prototype);

UI.Balance.prototype.show = function(parent) {
	UI.prototype.show.call(this, parent);
	
	var gradients = [
		["#0ff", "#f00"],
		["#f0f", "#0f0"],
		["#ff0", "#00f"]
	];
	
	for (var i=0;i<3;i++) {
		var parent = document.createElement("div");
		this._gradient(parent, gradients[i]);
		parent.className = "slider";
		parent.style.width = this._width+"px";
		parent.style.display = "inline-block";
		parent.appendChild(this._arrows[i]);

		this._parent.appendChild(parent);
		this._parent.appendChild(this._inputs[i]);
		this._parent.appendChild(document.createElement("p"));
	}

	this._parent.appendChild(this._apply);
	if (this._photo.hasAction(this._action)) { this._parent.appendChild(this._delete); }
	
	var options = this._action.getOptions();
	this._sliders[0].setValue(options.r);
	this._sliders[1].setValue(options.g);
	this._sliders[2].setValue(options.b);

	this._preview();
}

UI.Balance.prototype.handleEvent = function(e) {
	switch (e.type) {
		case "click":
			if (e.target == this._apply) {
				this._photo.setAction(this._action);
			} else if (e.target == this._delete) {
				this._photo.deleteAction(this._action);
			}
		break;

		case "change":
			var options = this._action.getOptions();
			options.r = this._sliders[0].getValue();
			options.g = this._sliders[1].getValue();
			options.b = this._sliders[2].getValue();
			this._action.setOptions(options);
			this._preview();
		break;
	}
}

UI.Balance.prototype._gradient = function(node, gradient) {
	node.style.height = "10px";
	node.style.backgroundImage = "linear-gradient(to right, " + gradient.join(",") + ")";
}
