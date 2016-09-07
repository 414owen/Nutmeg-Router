(function(undefined) {

	Nutmeg.router = function() {
		Nutmeg.internal.eachInArr(arguments, function(sub) {
            sub.render(document.body, '');
		});
	}

	var loc = window.location.href.split('#')[1];

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
                subs.push(arg);
			});
		}
        result.subs = [];
		result.path = path;
		subfuncs.forEach(function(subfunc) {
			result[subfunc[0]] = function() {
				subfunc[1].apply(result, arguments);
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
		"transision",
		"path"
	].map(function(mod) {
		return [mod, function(m) {
			this[m] = m;
		}];
	});

    var subfuncs = modifiers.concat(
        ["render", function(container, path) {
            var view;
            var subs = this.subs;
            for (var key in subs) {
                var sub = subs[key];
                if (path.indexOf(sub.path) === 0) {
                    var s = sub.render();
                    if (this.view === undefined) {
                        view = s;
                    } else {view = this.view(s);}
                    container(view);
                    break;
                }
            }
            return view;
        }]
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
