Action.Open = function() {
	Action.call(this);
}
Action.Open.prototype = Object.create(Action.prototype);

Action.Open.prototype.go = function(file) {
	var promise = Action.prototype.go.call(this);

	var fr = new FileReader();
	Promise.event(fr, "load").then(function(e) {
		var img = document.createElement("img");
		img.src = e.target.result;
		return Promise.event(img, "load");
	}).then(function(e) {
		var canvas = document.createElement("canvas");
		canvas.width = e.target.width;
		canvas.height = e.target.height;
		var context = canvas.getContext("2d");
		context.drawImage(e.target, 0, 0, canvas.width, canvas.height);
		promise.fulfill(new Photo(canvas));
	});
	fr.readAsDataURL(file);

	return promise;
}
