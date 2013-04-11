UI.Linear = function(action, photo) {
	UI.call(this, action, photo);

	this._buildApply();

	this._a = document.createElement("input");
	this._a.type = "text";
	this._a.value = action.getOptions().a;
	this._a.addEventListener("change", this);

	this._b = document.createElement("input");
	this._b.type = "text";
	this._b.value = action.getOptions().b;
	this._b.addEventListener("change", this);
}
UI.Linear.prototype = Object.create(UI.prototype);

UI.Linear.prototype.show = function(parent) {
	UI.prototype.show.call(this, parent);

	parent.appendChild(this._a);
	parent.appendChild(this._b);
	parent.appendChild(this._apply);

	this._preview();
}

UI.Linear.prototype.handleEvent = function(e) {
	if (e.target == this._apply) {
		this._photo.setAction(this._action);
	} else {
		this._action.setOptions({a:parseFloat(this._a.value), b:parseFloat(this._b.value)});
		this._preview();
	}
}
