var Preview = function(node) {
	this._node = node;
	this._canvas = document.createElement("canvas");
	this._canvas.style.position = "absolute";
	this._canvas.title = "(ctrl-wheel or shift-wheel to zoom)";
	this._node.appendChild(this._canvas);

	this._zoom = document.createElement("div");
	this._zoom.id = "zoom";
	this._node.appendChild(this._zoom);

	this._zooms = [
		{label:"5%",    scale:1/20},
		{label:"12.5%", scale:1/8},
		{label:"25%",   scale:1/4},
		{label:"33%",   scale:1/3},
		{label:"50%",   scale:1/2},
		{label:"75%",   scale:3/4},
		{label:"100%",  scale:1},
		{label:"125%",  scale:5/4},
		{label:"150%",  scale:3/2},
		{label:"200%",  scale:2},
		{label:"300%",  scale:3},
		{label:"400%",  scale:4},
		{label:"800%",  scale:8},
		{label:"1600%", scale:16}
	];
	this._zoomIndex = -1;

	this._canvas.addEventListener("wheel", this);
	this._canvas.addEventListener("mousewheel", this);
}

/**
 * @param {canvas} canvas
 * @param {bool} autoScale automatically apply current scale?
 * @returns {canvas}
 */
Preview.prototype.draw = function(canvas, autoScale) {
	if (autoScale) {
		var scale = this._zooms[this._zoomIndex].scale;

		/* we have this much space */
		var availWidth = this._node.offsetWidth;
		var availHeight = this._node.offsetHeight;

		/* large image size */
		var originalWidth = canvas.width;
		var originalHeight = canvas.height;

		/* preview size */
		var width = Math.round(originalWidth * scale);
		var height = Math.round(originalHeight * scale);

		/* resize & reposition our canvas */
		this._canvas.width = width;
		this._canvas.height = height;
		var left = (width > availWidth ? 0 : (availWidth-width)/2);
		var top = (height > availHeight ? 0 : (availHeight-height)/2);
		this._canvas.style.left = Math.round(left) + "px";
		this._canvas.style.top = Math.round(top) + "px";

		/* scroll to center */
		this._node.scrollLeft = Math.round((width-availWidth)/2);
		this._node.scrollTop = Math.round((height-availHeight)/2);

		/* draw */
		this._canvas.getContext("2d").drawImage(canvas, 0, 0, this._canvas.width, this._canvas.height);

	} else {
		var context = this._canvas.getContext("2d");
		context.clearRect(0, 0, this._canvas.width, this._canvas.height);
		context.drawImage(canvas, (this._canvas.width-canvas.width)/2, (this._canvas.height-canvas.height)/2);
	}

	return this._canvas;
}

Preview.prototype.computeZoom = function(canvas) {
	/* we have this much space */
	var availWidth = this._node.offsetWidth;
	var availHeight = this._node.offsetHeight;

	var canvasWidth = canvas.width;
	var canvasHeight = canvas.height;

	/* need to scale this much to fit */
	var scaleWidth = availWidth/canvasWidth;
	var scaleHeight = availHeight/canvasHeight;
	var scale = Math.min(scaleWidth, scaleHeight);

	/* find closest lower allowed scale (but <= 1) */
	var index = 0;
	for (var i=0;i<this._zooms.length;i++) {
		var zoom = this._zooms[i];
		if (zoom.scale <= 1 && zoom.scale <= scale) { index = i; }
	}
	this._setZoom(index);
}

Preview.prototype.handleEvent = function(e) {
	if (!e.ctrlKey && !e.shiftKey) { return; }
	e.preventDefault();

	var dir = 1;
	if (e.wheelDelta && e.wheelDelta < 0) { dir = -1; }
	if (e.deltaY && e.deltaY > 0) { dir = -1; }

	this._setZoom(this._zoomIndex + dir);
}

Preview.prototype._setZoom = function(index) {
	if (index < 0 || index >= this._zooms.length) { return false; } /* out of range */
	this._zoomIndex = index;
	var item = this._zooms[index];

	this._zoom.innerHTML = item.label;
	App.invalidatePreview(); /* notify others */
}
