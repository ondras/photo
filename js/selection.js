var Selection = function() {
	this._position = [0, 0];
	this._size = [0, 0];
	this._padding = 60;

	this._container = document.createElement("div");
	this._container.className = "selection";

	this._bg = document.createElement("div");
	this._container.appendChild(this._bg);

	this._drag = document.createElement("div");
	this._drag.style.position = "absolute";
	this._container.appendChild(this._drag);

	this._parts = [];
	this._partsDef = this._generatePartsDef();
	for (var i=0;i<this._partsDef.length;i++) {
		var def = this._partsDef[i];
		var part = document.createElement("div");
		if ("left" in def) { part.style.left = def.left + "px"; }
		if ("top" in def) { part.style.top = def.top + "px"; }
		if ("right" in def) { part.style.right = def.right + "px"; }
		if ("bottom" in def) { part.style.bottom = def.bottom + "px"; }
		if (def.width) { part.style.width = def.width+"px"; }
		if (def.height) { part.style.height = def.height+"px"; }
		this._parts.push(part);
		this._drag.appendChild(part);
	}

	this.setPosition(50, 50, 100, 100);

	this._drag.addEventListener("mousedown", this);
	this._event = {
		x: 0,
		y: 0,
		node: null
	};

	this.onchange = null;
}

Selection.prototype.getContainer = function() {
	return this._container;
}

Selection.prototype.setPosition = function(x, y, w, h) {
	this._position[0] = x;
	this._position[1] = y;
	this._size[0] = w;
	this._size[1] = h;

	this._redraw();
}

Selection.prototype.getPosition = function() {
	return this._position.concat(this._size);
}

Selection.prototype.handleEvent = function(e) {
	e.stopPropagation();
	e.preventDefault();

	switch (e.type) {
		case "mousedown":
			document.addEventListener("mousemove", this);
			document.addEventListener("mouseup", this);
			this._event.x = e.clientX;
			this._event.y = e.clientY;
			this._event.node = e.target;
		break;

		case "mousemove":
			var dx = e.clientX - this._event.x;
			var dy = e.clientY - this._event.y;
			var deltas = [dx, dy];

			var index = this._parts.indexOf(this._event.node);
			if (index == -1) {
				this._tryMove(deltas);
			} else {
				this._tryResize(deltas, this._partsDef[index]);
			}
			this._event.x = e.clientX + (deltas[0]-dx);
			this._event.y = e.clientY + (deltas[1]-dy);
		break;

		case "mouseup":
			document.removeEventListener("mousemove", this);
			document.removeEventListener("mouseup", this);
		break;
	}
}

Selection.prototype._redraw = function() {
	var x = this._position[0];
	var y = this._position[1];
	var w = this._size[0];
	var h = this._size[1];
	var C1 = "#000";
	var C2 = "rgba(0,0,0,0)";

	var g1 = "linear-gradient(to right,  "+C1+" 0%, "+C1+" "+x+"px, "+C2+" "+x+"px, "+C2+" "+ (x+w) + "px, "+C1+" "+(x+w)+"px, "+C1+" 100%)";
	var g2 = "linear-gradient(to bottom, "+C1+" 0%, "+C1+" "+y+"px, "+C2+" "+y+"px, "+C2+" "+ (y+h) + "px, "+C1+" "+(y+h)+"px, "+C1+" 100%)";

	this._bg.style.backgroundImage = g1+","+g2;

	this._drag.style.left = x+"px";
	this._drag.style.top = y+"px";
	this._drag.style.width = w+"px";
	this._drag.style.height = h+"px";

	for (var i=0;i<this._parts.length;i++) {
		var part = this._parts[i];
		var def = this._partsDef[i];
		if (!def.width) { part.style.width = (w-2*this._padding)+"px"; }
		if (!def.height) { part.style.height = (h-2*this._padding)+"px"; }
	}

}

Selection.prototype._tryMove = function(deltas) {
	var avail = [this._container.offsetWidth, this._container.offsetHeight];

	for (var i=0;i<deltas.length;i++) {
		var delta = deltas[i];
		if (delta < 0) {
			delta = Math.max(delta, -this._position[i]);
		} else {
			delta = Math.min(delta, avail[i] - (this._position[i]+this._size[i]));
		}
		deltas[i] = delta;
		this._position[i] += delta;
	}

	this._redraw();

	if (this.onchange) { this.onchange.handleEvent({target:this, type:"change"}); }
}

Selection.prototype._tryResize = function(deltas, def) {
	var avail = [this._container.offsetWidth, this._container.offsetHeight];
	var defPos = [def.x, def.y];
	var defSize = [def.w, def.h];

	for (var i=0;i<deltas.length;i++) {
		if (!defSize[i]) { continue; }
		var delta = deltas[i];

		if (defPos[i]) { /* move+resize */

			if (delta < 0) { /* mouse left/up */
				delta = Math.max(delta, -this._position[i]);
			} else { /* mouse right/down */
				delta = Math.min(delta, this._size[i]);
			}
			this._size[i] -= delta;
			this._position[i] += delta;

		} else { /* resize only */
			if (delta < 0) { /* mouse left/up */
				delta = Math.max(delta, -this._size[i]);
			} else { /* mouse right/down */
				delta = Math.min(delta, avail[i] - (this._position[i]+this._size[i]));
			}
			this._size[i] += delta;
		}

		deltas[i] = delta;
	}

	this._redraw();

	if (this.onchange) { this.onchange.handleEvent({target:this, type:"change"}); }
}

Selection.prototype._generatePartsDef = function() {
	var p = this._padding;
	return [
		{ /* left top */
			left:0, top:0,
			width:p, height:p,
			x:1, y:1, w:1, h:1
		},
		{ /* top */
			left:p, top:0,
			width:0, height:p,
			x:0, y:1, w:0, h:1
		},
		{ /* right top */
			right:0, top:0,
			width:p, height:p,
			x:0, y:1, w:1, h:1
		},
		{ /* right */
			right:0, top:p,
			width:p, height:0,
			x:0, y:0, w:1, h:0
		},
		{ /* right bottom */
			right:0, bottom:0,
			width:p, height:p,
			x:0, y:0, w:1, h:1
		},
		{ /* bottom */
			left:p, bottom:0,
			width:0, height:p,
			x:0, y:0, w:0, h:1
		},
		{ /* left bottom */
			left:0, bottom:0,
			width:p, height:p,
			x:1, y:0, w:1, h:1
		},
		{ /* left */
			left:0, top:p,
			width:p, height:0,
			x:1, y:0, w:1, h:0
		}
	];
}