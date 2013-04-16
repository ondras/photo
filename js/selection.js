var Selection = function() {
	this._container = document.createElement("div");
	this._container.className = "selection";

	this._bg = document.createElement("div");
	this._container.appendChild(this._bg);
	this.setPosition(50, 50, 100, 100);
}

Selection.prototype.getContainer = function() {
	return this._container;
}

Selection.prototype.setPosition = function(x, y, w, h) {
	var C1 = "#000";
	var C2 = "rgba(0,0,0,0)";

	var g1 = "linear-gradient(to right,  "+C1+" 0%, "+C1+" "+x+"px, "+C2+" "+x+"px, "+C2+" "+ (x+w) + "px, "+C1+" "+(x+w)+"px, "+C1+" 100%)";
	var g2 = "linear-gradient(to bottom, "+C1+" 0%, "+C1+" "+y+"px, "+C2+" "+y+"px, "+C2+" "+ (y+h) + "px, "+C1+" "+(y+h)+"px, "+C1+" 100%)";

	this._bg.style.backgroundImage = g1+","+g2;
}
