Operation.Invert = function() {
	Operation.call(this);
}
Operation.Invert.prototype = Object.create(Operation.prototype);

Operation.Invert.prototype.go = function(data) {
	var promise = Operation.prototype.go.call(this, data);

	var w = data.width;
	var h = data.height;
	var worker = new Worker("worker.js");
	worker.postMessage({method:"invert", args:[data]});

	Promise.event(worker, "message").then(function(e) {
		debugger;
		promise.fulfill(e.data);
	});
	
	return promise;
}