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

	this._inputClipboard = document.createElement("div");
	this._inputClipboard.innerHTML = "&nbsp;";
	this._inputClipboard.style.display = "inline-block";
	this._inputClipboard.style.width = "20px";
	this._inputClipboard.style.border = "2px solid #000";
	this._inputClipboard.style.cursor = "pointer";
	this._inputClipboard.contentEditable = true;
	this._inputClipboard.addEventListener("keyup", this);
	this._row3 = this._buildRow("Paste:", this._inputClipboard);
}
UI.Open.prototype = Object.create(UI.prototype);

UI.Open.prototype.show = function(parent) {
	UI.prototype.show.call(this, parent);

	parent.appendChild(this._row1);
	parent.appendChild(document.createElement("br"));
	parent.appendChild(this._row2);
	parent.appendChild(document.createElement("br"));
	parent.appendChild(this._row3);
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

		case this._inputClipboard:
			var content = this._inputClipboard.innerHTML;
			this._inputClipboard.innerHTML = "&nbsp;";
			var re = content.match(/src=['"](data:image[^'"]+)/);
			if (re) {
				this._action.openURL(re[1]).then(function(photo) {
					App.setPhoto(photo);
				});
			}
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
