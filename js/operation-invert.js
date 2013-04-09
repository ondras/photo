Operation.Invert = function() {
	Operation.call(this);
}
Operation.Invert.prototype = Object.create(Operation.prototype);

Operation.Invert.prototype.go = function() {
	var promise = Operation.prototype.go.call(this);
	var ts = Date.now();

	var w = this._source.width;
	var h = this._source.height;
	var id = this._source.getContext("2d").getImageData(0, 0, w, h);
	var worker = new Worker("js/worker-invert.js");
	worker.postMessage(id);
	
	worker.onmessage = function(e) {
		this._target = document.createElement("canvas");
		this._target.width = w;
		this._target.height = h;
		this._target.getContext("2d").putImageData(e.data, 0, 0);
		console.log(Date.now()-ts);
		promise.fulfill(this);
	}.bind(this);

	return promise;
}