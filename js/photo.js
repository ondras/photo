var Photo = function(canvas) {
	this._canvases = [canvas];
	this._historyIndex = 0; /* -1 = last; >-1 = after that many actions */
	this._previewCanvas = null;
	this._actions = [];
	
	
	
	this._historySelect = document.createElement("select");
	this._historySelect.size = 2;
	this._historySelect.className = "history";
	var o = document.createElement("option");
	o.innerHTML = "History";
	this._historySelect.appendChild(o);
	this._historySelect.addEventListener("change", this);
	
	this.setHistoryIndex();
}

Photo.prototype.handleEvent = function(e) {
	App.resetActions();
	this.setHistoryIndex(e.target.selectedIndex);
}

Photo.prototype.getCanvas = function() {
	return this._canvases[Math.max(0, this._historyIndex-2)];
}

Photo.prototype.getPreviewCanvas = function() {
	return this._previewCanvas;
}

Photo.prototype.getHistorySelect = function() {
	return this._historySelect;
}

Photo.prototype.setAction = function(action) {
	action.go(this.getCanvas()).then(function(canvas) {

		if (this._historyIndex == -1) { /* new action */
		
			this._addHistory(action, canvas);

		} else { /* modification of an existing action */

			this._canvases[this._historyIndex-1] = canvas;
			this.setHistoryIndex(this._historyIndex+1);
			if (this._historyIndex < this._actions.length) { /* not last, continue */
				this.setAction(this._actions[this._historyIndex]);
			}

		}
	}.bind(this));
}

Photo.prototype.setHistoryIndex = function(index) {
	this._historyIndex = index;
	this._historySelect.selectedIndex = index;
	
	this._createPreviewCanvas();
	Preview.getCanvas().getContext("2d").drawImage(this._previewCanvas, 0, 0);

	if (index < 1) { return; }

	var action = this._actions[index-1];
	var name = "";
	for (var p in Action) { /* fixme bad practice */
		if (action instanceof Action[p]) { name = p; }
	}
	var ui = new UI[name](action, this);
	App.showUI(ui);
}

Photo.prototype._addHistory = function(action, canvas) {
	this._actions.push(action);
	this._canvases.push(canvas);

	var o = document.createElement("option");
	o.innerHTML = action.getName();
	this._historySelect.appendChild(o);
	
	App.resetActions();
}

Photo.prototype._createPreviewCanvas = function() {
	var source = this.getCanvas();
	var target = Preview.getCanvas();

	this._previewCanvas = document.createElement("canvas");
	this._previewCanvas.width = target.width;
	this._previewCanvas.height = target.height;
	this._previewCanvas.getContext("2d").drawImage(source, 0, 0, target.width, target.height);
}

