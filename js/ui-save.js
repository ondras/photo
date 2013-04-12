UI.Save = function(action, photo) {
	UI.call(this, action, photo);

	this._build();
}
UI.Save.prototype = Object.create(UI.prototype);

UI.Save.prototype.show = function(parent) {
	UI.prototype.show.call(this, parent);

	parent.appendChild(this._table);
	this._syncExt();
}

UI.Save.prototype.handleEvent = function(e) {
	switch (e.type) {
		case "click":
			var type = this._types[this._type.selectedIndex].mime;
			var quality = parseInt(this._quality.value);
			var canvas = this._photo.getCanvas(this._action);
			this._action.go(canvas, type, quality).then(this._showLink.bind(this));
		break;

		case "change":
			this._syncExt();
		break;
	}
}

UI.Save.prototype._showLink = function(data) {
	var link = document.createElement("a");
	link.download = this._name.value;
	link.innerHTML = "click to download";
	link.href = data;

	this._content.innerHTML = "";
	this._content.appendChild(link);
}

UI.Save.prototype._syncExt = function() {
	var name = this._name.value;
	var type = this._types[this._type.selectedIndex];
	this._quality.disabled = (type.mime != "image/jpeg");
	var ext = type.ext;

	var r = name.match(/(.*)\.(\S+)\s*$/);
	if (r) {
		var oldName = r[1];
		var oldExt = r[2];
		if (oldExt.toLowerCase() != ext.toLowerCase()) {
			name = oldName + "." + ext;
		}
	} else {
		name += "." + ext;
	}

	this._name.value = name;
}

UI.Save.prototype._build = function() {
	this._table = document.createElement("table");

	this._type = document.createElement("select");
	this._types = [
		{mime:"image/jpeg", label:"JPG", ext:"jpg"},
		{mime:"image/png", label:"PNG", ext:"png"},
		{mime:"image/gif", label:"GIF", ext:"gif"}
	];
	for (var i=0;i<this._types.length;i++) {
		var o = document.createElement("option");
		o.innerHTML = this._types[i].label;
		this._type.appendChild(o);
	}
	this._type.addEventListener("change", this);

	this._quality = document.createElement("input");
	this._quality.size = 3;
	this._quality.value = 97;

	this._name = document.createElement("input");
	this._name.value = "image";

	this._save = this._buildButton("Save");
	this._save.className = "save";

	this._content = document.createElement("div");

	this._table.appendChild(this._buildRow("Name:", this._name));
	this._table.appendChild(this._buildRow("Type:", this._type));
	this._table.appendChild(this._buildRow("Quality:", this._quality));
	this._table.appendChild(this._buildRow(this._save, this._content));
}

UI.Save.prototype._buildRow = function(a, b) {
	var row = document.createElement("tr");
	var td1 = document.createElement("td");
	var td2 = document.createElement("td");

	if (typeof(a) == "string") { td1.innerHTML = a; } else { td1.appendChild(a); }
	if (typeof(b) == "string") { td2.innerHTML = b; } else { td2.appendChild(b); }
	row.appendChild(td1);
	row.appendChild(td2);

	return row;
}