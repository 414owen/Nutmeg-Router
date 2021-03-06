(function(undefined) {

	var N = Nutmeg;
	eval(N.localScope);

	N.sub = function(path) {
		var options = {};
		var subs = [];
		function res() {
			subs = subs.concat([].slice.call(arguments));
			return res;
		}

		modifiers.forEach(function(m) {
			options[m[0]] = m[1];     // Set default
			res[m[0]] = function(a) { // Set modifier
				options[m[0]] = a;
				return res;
			}
		});

		res.render = function(segments, ind, container, params) {
			var urlseg = segments[ind];
			if (path === undefined && options.view) {
				options.transition(container, options.view(params));
				return true;
			}
			if (path[0] === ":") {
				params[path.slice(1)] = urlseg;
				urlseg = path;
			}
			if (path === urlseg) {
				if (ind + 1 === segments.length && options.view) {
					options.transition(container, options.view(params));
					return true;
				} else {
					for (var i = 0; i < subs.length; i++) {
						if (subs[i].render(segments, ind + 1, container, params)) {
							return true;
						}
					}
				}
			} 
		};

		return res;
	};

	var linkFn;
	var pushUrlFn;
	N.go = function() {return pushUrlFn.apply(null, arguments);};
	N.link = function() {return linkFn.apply(null, arguments);};

	N.router = function() {

		var subs = [];
		var options = {
			universal: true,
			hash: true,
			base: "",
			into: body
		};

		function more(opts) {
			if (typeof(opts) === "object" && !opts.length) {
				for (var key in opts) {options[key] = opts[key];}
			} else {
				for (var i = 0; i < arguments.length; i++) {
					var arg = arguments[i];
					if (arg.length) {
						more.apply(null, arg);
					} else {
						subs.push(arg);
					}
				}
			}
			return more;
		}

		function go(path) {
			for (var i = 0; i < subs.length; i++) {
				if (subs[i].render(path, 0, options.into, {})) {
					break;
				}
			}
			return more;
		}

		more.run = function() {
			var loc = '/';
			if (options.hash) {loc = window.location.href.split("#")[1] || '/';}
			else {
				loc = window.location.pathname;
				if (options.base) {loc = loc.split(options.base)[1] || '/';}
			}
			loc = loc.split("/").filter(function(a) {return a !== "";});
			if (loc.length === 0) loc.push("");
			return go(loc);
		}

		function pushUrl(to) {
			to = (options.hash ? "#/" : window.location.origin + "/" + 
				(options.base ? options.base + "/" : "")) + to;
			console.log("Going to:", to);
			window.history.pushState({}, "", to);
			return more.run();
		}

		if (options.universal) {
			linkFn = function(to) {
				return a.href(to).onclick(function(e) {
					e.preventDefault();
					pushUrl(to);
				});
			};
			pushUrlFn = pushUrl;
			window.onpopstate = more.run;
		}

		more.go = function(p) {go(p.split("/"));};
		return more.apply(null, arguments);
	};

	var modifiers = [
		["transition", function(c, n) {c.clear()(n);}],
		["view", false]
	];

})();
