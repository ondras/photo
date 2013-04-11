var UI = function(action) {
	this._action = action;
}

UI.prototype.show = function(parent) {
	parent.innerHTML = "";
}
