(function(undefined) {

    for (var key in Nutmeg)  {
        eval('var ' + key + '=Nutmeg[key]');
    }

    function renderChildren(route, container, children) {
        for (var i = 0; i < children.length; i++) {
            if (children[i].render(container, route)) {break;}
        }
    }

	Nutmeg.router = function() {
        var subs = arguments;
        this.current = {
            eval: function() {
                renderChildren(window.location.href.split('#')[1] || '',
                               body(), subs);
            }
        }
        this.current.eval();
	}

	/*

    sub.render() takes an element to render into, and a path to match on.
    If sub.path matches the front of the path argument, it renders itself
    into the element argument, then calls render on its children, with itself
    as the element to render into, and the path it was provided, without 
    sub.path at the front as the path.

	*/

    Nutmeg.goto = function(hashloc) {
        return div.apply(null, arguments)
                   .onclick(function() {
                       window.location.href = window.location.href.split('#') +
                                              '#' + hashloc;
                       router.current.eval();
                   });
    }

	Nutmeg.sub = function(path) {
		function result() {
			eachArg(arguments, function(arg) {
                result.subs.push(arg);
			});
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
            // index is 1, in order to skip slashes
            var match = path.indexOf(this.subpath) === 1 || path === this.subpath;
            if (match) {
                if (this.view !== undefined) {
                    container(this.view);
                }
                var newLoc = path.split(RegExp(this.subpath + '(.)'))[1];
                var fill = this.fill || container;
                renderChildren(newLoc, fill, subs);
            }
            return match;
        };
		return result;
	};

	function pageChange(newPage) {
	    var bod = body();
	    bod.style({backgroundColor: foreground});
	    window.setTimeout(function() {
	        bod.clear();
	        bod(newPage);
	        bod.style({backgroundColor: background});
	    }, Math.ceil((transitionTime + 0.1) * 1000));
	}

	var modifiers = [
		"view",
        "fill",
		"transision",
		"path"
	].map(function(mod) {
		return [mod, function(m) {
			this[mod] = m;
		}];
	});

    var subfuncs = modifiers.concat(
            );
})();

/*
router(
	sub('projects')(
		sub('Nutmeg')(
			sub('Core').view(nutmegCore),
			sub('Router').view(nutmegRouter)
		)
	),
	sub('about')(

	)
)
*/
