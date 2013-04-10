var Lib = {
	linear: function(id, a, b) {
		var w = id.width;
		var h = id.height;

		for (var i=0;i<w*h;i++) {
			id.data[4*i+0] = a*id.data[4*i+0]+b;
			id.data[4*i+1] = a*id.data[4*i+1]+b;
			id.data[4*i+2] = a*id.data[4*i+2]+b;
		}

		return id;
	}
}
