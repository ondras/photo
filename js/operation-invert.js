Operation.Invert = function() {
	Operation.call(this);
}
Operation.Invert.prototype = Object.create(Operation.prototype);

Operation.Invert.prototype.go = function() {
	var promise = Operation.prototype.go.call(this);
	var w = this._source.width;
	var h = this._source.height;
	var id = this._source.getContext("2d").getImageData(0, 0, w, h);
	for (var i=0;i<w*h;i++) {
		id.data[4*i+0] = 255-id.data[4*i+0];
		id.data[4*i+1] = 255-id.data[4*i+1];
		id.data[4*i+2] = 255-id.data[4*i+2];
	}

	this._target = document.createElement("canvas");
	this._target.width = w;
	this._target.height = h;
	this._target.getContext("2d").putImageData(id, 0, 0);
	promise.fulfill(this);

	return promise;
}