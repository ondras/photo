var Lib = {
	linear: function(id, def) {
		var w = id.width;
		var h = id.height;

		var ra = (def.r ? def.r.a : 1);
		var rb = (def.r ? def.r.b : 0);
		var ga = (def.g ? def.g.a : 1);
		var gb = (def.g ? def.g.b : 0);
		var ba = (def.b ? def.b.a : 1);
		var bb = (def.b ? def.b.b : 0);

		for (var i=0;i<w*h;i++) {
			id.data[4*i+0] = ra*id.data[4*i+0]+rb;
			id.data[4*i+1] = ga*id.data[4*i+1]+gb;
			id.data[4*i+2] = ba*id.data[4*i+2]+bb;
		}

		return id;
	}
}
