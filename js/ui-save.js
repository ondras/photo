UI.Save = function(action, photo) {
	UI.call(this, action, photo);

	this._buildApply();
	this._content = document.createElement("div");
}
UI.Save.prototype = Object.create(UI.prototype);

UI.Save.prototype.show = function(parent) {
	UI.prototype.show.call(this, parent);

	parent.appendChild(this._apply);
	parent.appendChild(this._content);
}

UI.Save.prototype.handleEvent = function(e) {
	switch (e.type) {
		case "click":
			var type = "image/jpeg";
			var canvas = this._photo.getCanvas(this._action);
			this._action.go(canvas, type).then(this._showLink.bind(this));
		break;
	}
}

UI.Save.prototype._showLink = function(data) {
	var link = document.createElement("a");
	link.download = "image";
	link.innerHTML = "click to download";
	link.href = data;

	this._content.innerHTML = "";
	this._content.appendChild(link);
}
