/**
 * @license
 * Copyright (c) 2016 Owen Shepherd
 * This software is open-source under the MIT license.
 * The full license can be viewed here: https://opensource.org/licenses/MIT
 */

/**
 * @preserve
 * This is Nutmeg-Router. a tiny client-side URL parser
 * and Nutmeg element renderer.
 * Homepage: https://github.com/414owen/Nutmeg-Router
 */

(function(undefined) {
	var N = Nutmeg;

	for (var key in N)  {
		eval('var ' + key + '=N[key]');
	}

	function renderChildren(route, container, children) {
		for (var i = 0; i < children.length; i++) {
			if (children[i].render(container, route)) {break;}
		}
	}

	var R = N.router = function() {
		body.clear();
		window.onpopstate = function(st) {
			evalLoc();
		};
		var subs = arguments;
		evalLoc(subs);
	}

	function evalLoc(subs) {
		R.go(window.location.href.split('#')[1] || '', subs);
	}

	R.eval = evalLoc;

	var URLvars;
	R.go = function(loc, subs) {
		if (loc === '') {
			loc = '/';
		}
		URLvars = {};
		renderChildren(loc, body(), subs);
	};

	/*

	sub.render() takes an element to render into, and a path to match on.
	If sub.path matches the front of the path argument, it renders itself
	into the element argument, then calls render on its children, with itself
	as the element to render into, and the path it was provided, without 
	sub.path at the front as the path.

*/

	N.link = function(hashloc) {
		return div().onclick(function() {
			var loc = hashloc.length === 0 ? window.location.href.split('#')[0] : '#/' + hashloc;
			window.history.pushState(hashloc, '', loc);
			evalLoc();
		});
	};

	N.sub = function(path) {
		function result() {
			for (var arg in arguments) {
				result.subs.push(arguments[arg]);
			};
		}
		result.subs = [];
		result.subpath = path;
		modifiers.forEach(function(subfunc) {
			result[subfunc[0]] = function() {
				subfunc[1].apply(result, arguments);
				return result;
			};
		});

		result.render = function(container, path) {
			var subs = this.subs;
			var match = false;
			var matched = function(newpath) {
				match = true;
				var view = this.view;
				var transition = this.transition;
				if (view !== undefined) {
					if (typeof(view) === 'function') {view = view(URLvars);}
					if (transition !== undefined) {
						transition(container, view);
					} else {
						container(view);
					}
				}
				var newLoc = path.split(RegExp(this.subpath + '(.)'))[1];
				var fill = this.fill || container;
				renderChildren(newLoc, fill, subs);
			}.bind(this);

			var part = path.split('/')[1];
			if (this.subpath === undefined) {
				matched(path);
			} else {
				var rest = path.slice(part.length + 1);
				index = path.indexOf(this.subpath);
				if (this.subpath === '' && path === '' || this.subpath === part) {
					matched(rest);
				} else if (this.subpath[0] === ':') {
	// Take out ':' and save variable
					URLvars[this.subpath.slice(1)] = part;
					matched(rest);
				}
			}
			return match;
		};

		return result;
	};

	var modifiers = [
		"fill",
		"transition",
		"view"
	].map(function(mod) {
		return [mod, function(m) {
			this[mod] = m;
		}];
	});
})();
