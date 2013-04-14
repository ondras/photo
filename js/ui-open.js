UI.Open = function(action) {
	UI.call(this, action, null);

	this._inputFile = document.createElement("input");
	this._inputFile.type = "file";
	this._inputFile.addEventListener("change", this);
	this._row1 = this._buildRow("Local:", this._inputFile);

	this._inputURL = document.createElement("input");
	this._inputURL.type = "text";
	this._inputURL.value = "sample.jpg";
	this._inputURLbutton = document.createElement("input");
	this._inputURLbutton.type = "button";
	this._inputURLbutton.value = "Load";
	this._inputURLbutton.addEventListener("click", this);
	this._row2 = this._buildRow("URL:", this._inputURL, this._inputURLbutton);
}
UI.Open.prototype = Object.create(UI.prototype);

UI.Open.prototype.show = function(parent) {
	UI.prototype.show.call(this, parent);

	parent.appendChild(this._row1);
	parent.appendChild(document.createElement("br"));
	parent.appendChild(this._row2);
}

UI.Open.prototype.handleEvent = function(e) {
	switch (e.target) {
		case this._inputURLbutton:
			this._action.openURL(this._inputURL.value).then(function(photo) {
				App.setPhoto(photo);
			});
		break;
		
		case this._inputFile:
			this._action.openFile(e.target.files[0]).then(function(photo) {
				App.setPhoto(photo);
			});
		break;
	}
}

UI.Open.prototype.invalidatePreview = function() {} /* no preview */

UI.Open.prototype._buildRow = function(label) {
	var result = document.createElement("label");
	result.innerHTML = label + " ";
	for (var i=1; i<arguments.length;i++) {
		result.appendChild(document.createTextNode(" "));
		result.appendChild(arguments[i]);
	}
	return result;
}
