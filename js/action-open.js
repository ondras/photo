Action.Open = function() {
	Action.call(this);
}
Action.Open.prototype = Object.create(Action.prototype);

Action.Open.prototype.go = function(file) {
	Photo.fromFile(file).then(App.setPhoto.bind(App));
}
