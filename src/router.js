(function(undefined) {

	var loc = window.location.href.split('#')[1] || '';
	Nutmeg.router = function() {
		Nutmeg.internal.eachInArr(arguments, function(sub) {
            sub.render(Nutmeg.body(), loc);
		});
	}

	/*

    sub.render() takes an element to render into, and a path to match on.
    If sub.path matches the front of the path argument, it renders itself
    into the element argument, then calls render on its children, with itself
    as the element to render into, and the path it was provided, without 
    sub.path at the front as the path.

	*/

	Nutmeg.sub = function(path) {
		function result() {
			eachArg(arguments, function(arg) {
                result.subs.push(arg);
			});
		}
        result.subs = [];
		result.subpath = path;
		subfuncs.forEach(function(subfunc) {
			result[subfunc[0]] = function() {
				subfunc[1].apply(result, arguments);
                return result;
			};
		});

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
        [["render", function(container, path) {
            var subs = this.subs;
            // index is 1 to skip slashes
            if (path.indexOf(this.subpath) === 1) {
                if (this.view !== undefined) {
                    container(this.view);
                }
                var newLoc = path.split(this.subPath)[1];
                subs.forEach(function(sub) {
                    sub.render(this.fill, newLoc);
                });
            }
        }]]
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
