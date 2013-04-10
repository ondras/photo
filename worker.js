importScripts("js/lib.js");

addEventListener("message", function(e) {
	var method = Lib[e.data.method];
	var result = method.apply(Lib, e.data.args);
	postMessage(result);
});
