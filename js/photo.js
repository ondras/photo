var Photo = function(canvas) {
	this._canvases = [canvas];
	this._actions = [];
	
	this._historySelect = document.createElement("select");
	this._historySelect.size = 2;
	this._historySelect.className = "history";
	var o = document.createElement("option");
	o.innerHTML = "History";
	this._historySelect.appendChild(o);
	var o = document.createElement("option");
	o.innerHTML = "Open image";
	this._historySelect.appendChild(o);
	this._historySelect.selectedIndex = 0;
	this._historySelect.addEventListener("change", this);
}

/**
 * Reset the selectbox => show the last preview canvas 
 */
Photo.prototype.resetHistory = function() {
	this._historySelect.selectedIndex = 0;
	App.preview.draw(this._canvases[this._canvases.length-1], true); /* draw the last state */
	App.showUI(null); /* hide UI, if there was some */
}

/**
 * Return canvas for an action
 */
Photo.prototype.getCanvas = function(action) {
	var index = this._actions.indexOf(action);
	return this._canvases[index == -1 ? this._canvases.length-1 : index];
}

Photo.prototype.hasAction = function(action) {
	return (this._actions.indexOf(action) != -1);
}

Photo.prototype.getHistorySelect = function() {
	return this._historySelect;
}

Photo.prototype.invalidatePreview = function() {
	if (this._historySelect.selectedIndex == 1) { /* show (and re-create) first state */
		this._showFirstPreview();
	} else { /* show last state; might be overwritten by an action */
		App.preview.draw(this._canvases[this._canvases.length-1], true);
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
				this.resetHistory(); /* leave our selectbox, draw last */
			}

		}
	}.bind(this));
}

Photo.prototype.deleteAction = function(action) {
	var index = this._actions.indexOf(action);
	this._actions.splice(index, 1);
	this._canvases.splice(index+1, 1);
	var option = this._historySelect.options[index+2];
	option.parentNode.removeChild(option);

	if (index == this._actions.length) { /* was last */
		this.resetHistory();
	} else { /* not last; re-run all next actions */
		this.setAction(this._actions[index]);
	}
}

Photo.prototype.handleEvent = function(e) {
	App.resetActions();
	var index = e.target.selectedIndex;

	if (index == 0) { /* special case: show the last version */
		this.resetHistory();
		return; 
	}

	if (index == 1) { /* special case: show the first preview canvas */
		this._showFirstPreview();
		return; 
	}

	var action = this._actions[index-2];
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
	this.resetHistory(); /* show last preview, reset select */
}

Photo.prototype._showFirstPreview = function() {
	App.preview.draw(this._canvases[0], true); /* draw first state */
}
