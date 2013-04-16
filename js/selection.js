var Selection = function() {
	this._position = [0, 0];
	this._size = [0, 0];

	this._container = document.createElement("div");
	this._container.className = "selection";

	this._bg = document.createElement("div");
	this._container.appendChild(this._bg);

	this._drag = document.createElement("div");
	this._drag.style.position = "absolute";
	this._container.appendChild(this._drag);
	this.setPosition(50, 50, 100, 100);

	this._drag.addEventListener("mousedown", this);
	this._event = {};

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
		break;

		case "mousemove":
			var dx = e.clientX - this._event.x;
			var dy = e.clientY - this._event.y;
			var deltas = [dx, dy];
			this._tryMove(deltas);
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
