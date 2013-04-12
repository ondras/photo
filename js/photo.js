var Photo = function(canvas) {
	this._canvases = [canvas];
	this._previewCanvas = null;
	this._actions = [];
	
	this._historySelect = document.createElement("select");
	this._historySelect.size = 2;
	this._historySelect.className = "history";
	var o = document.createElement("option");
	o.innerHTML = "History";
	this._historySelect.appendChild(o);
	this._historySelect.addEventListener("change", this);
}

/**
 * Reset the selectbox => show the last preview canvas 
 */
Photo.prototype.resetHistory = function() {
	this._historySelect.selectedIndex = -1;
	App.preview.draw(this._previewCanvas);
	App.showUI(null); /* hide UI, if there was some */
}

/**
 * Return canvas for an action
 */
Photo.prototype.getCanvas = function(action) {
	var index = this._actions.indexOf(action);
	return this._canvases[index == -1 ? this._canvases.length-1 : index];
}

/**
 * Return preview canvas for an action.
 * Implemented in Photo (as opposed to an UI), so we can cache the _previewCanvas for unknown actions
 */
Photo.prototype.getPreviewCanvas = function(action) {
	var index = this._actions.indexOf(action);
	if (index == -1) { return this._previewCanvas; }

	var largeCanvas = this.getCanvas(action);
	return App.preview.createCanvas(largeCanvas);
}

Photo.prototype.hasAction = function(action) {
	return (this._actions.indexOf(action) != -1);
}

Photo.prototype.getHistorySelect = function() {
	return this._historySelect;
}

Photo.prototype.invalidatePreview = function() {
	this._createLastPreviewCanvas(); /* not valid anymore */

	if (this._historySelect.selectedIndex == 0) { /* show (and re-create) first state */
		this._showFirstPreview();
	} else { /* show last state; might be overwritten by an action */
		App.preview.draw(this._previewCanvas);
	}
}

Photo.prototype.setAction = function(action) {
	action.go(this.getCanvas(action)).then(function(canvas) {
		var index = this._actions.indexOf(action);

		if (index == -1) { /* new action */
		
			this._addHistory(action, canvas);

		} else { /* modification of an existing action */

			index++;
			this._canvases[index] = canvas;

			if (index < this._actions.length) { /* not last, continue */
				this.setAction(this._actions[index]);
			} else { /* last one */
				this._createLastPreviewCanvas();
				this.resetHistory(); /* leave our selectbox */
			}

		}
	}.bind(this));
}

Photo.prototype.deleteAction = function(action) {
	var index = this._actions.indexOf(action);
	this._actions.splice(index, 1);
	this._canvases.splice(index+1, 1);
	var option = this._historySelect.options[index+1];
	option.parentNode.removeChild(option);

	if (index == this._actions.length) { /* was last */
		this._createLastPreviewCanvas();
		this.resetHistory();
	} else { /* not last; re-run all next actions */
		this.setAction(this._actions[index]);
	}
}

Photo.prototype.handleEvent = function(e) {
	App.resetActions();
	var index = e.target.selectedIndex;

	if (index == 0) { /* special case: show the first preview canvas */
		this._showFirstPreview();
		return; 
	}

	var action = this._actions[index-1];
	var name = "";
	for (var p in Action) { /* fixme bad practice */
		if (action instanceof Action[p]) { name = p; }
	}
	var ui = new UI[name](action, this);
	App.showUI(ui);
}

/**
 * Add a new item to the history chain
 */
Photo.prototype._addHistory = function(action, canvas) {
	this._actions.push(action);
	this._canvases.push(canvas);

	var o = document.createElement("option");
	o.innerHTML = action.getName();
	this._historySelect.appendChild(o);
	
	App.resetActions();

	this._createLastPreviewCanvas(); /* update last preview */
	this.resetHistory(); /* show last preview, reset select */
}

Photo.prototype._createLastPreviewCanvas = function() {
	this._previewCanvas = App.preview.createCanvas(this._canvases[this._canvases.length-1]);
}

Photo.prototype._showFirstPreview = function() {
	var canvas = App.preview.createCanvas(this._canvases[0]);
	App.preview.draw(canvas);
}
