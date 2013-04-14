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
	},

	average: function(id, mode) {
		var w = id.width;
		var h = id.height;

		for (var i=0;i<w*h;i++) {
			var r = id.data[4*i+0];
			var g = id.data[4*i+1];
			var b = id.data[4*i+2];

			switch (mode) {
				case 0: var x = (Math.max(r, g, b) + Math.min(r, g, b))/2; break;
				case 1: var x = 0.299*r+0.587*g+0.114*b; break;
				case 2: var x = (r+g+b)/3; break;
			}

			id.data[4*i+0] = x;
			id.data[4*i+1] = x;
			id.data[4*i+2] = x;
		}

		return id;
	},

	histogram: function(id) {
		var results = new Array(256*3);
		for (var i=0;i<results.length;i++) { results[i] = 0; }
		var w = id.width;
		var h = id.height;

		for (var i=0;i<w*h;i++) {
			var sum = id.data[4*i+0] + id.data[4*i+1] + id.data[4*i+2];
			results[sum]++;
		}

		return results;
	}
}
