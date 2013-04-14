Action.Open = function() {
	Action.call(this);
	this._name = "Open image";
}
Action.Open.prototype = Object.create(Action.prototype);

Action.Open.prototype.openFile = function(file) {
	var promise = new Promise();
	App.showThrobber("Loading local file...");

	var fr = new FileReader();
	Promise.event(fr, "load").then(function(e) {
		App.hideThrobber();
		return this.openURL(e.target.result);
	}.bind(this)).then(function(photo) {
		promise.fulfill(photo);
	});
	fr.readAsDataURL(file);

	return promise;
}

Action.Open.prototype.openURL = function(url) {
	var promise = new Promise();
	App.showThrobber("Loading image...");

	var img = document.createElement("img");
	img.src = url;
	Promise.event(img, "load").then(function(e) {
		var canvas = document.createElement("canvas");
		canvas.width = e.target.width;
		canvas.height = e.target.height;
		var context = canvas.getContext("2d");
		context.drawImage(e.target, 0, 0, canvas.width, canvas.height);
		App.hideThrobber();
		promise.fulfill(new Photo(canvas));
	});
	
	return promise;
}
