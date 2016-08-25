function NutmegRouter(func) {
	var funcs = {};
	function eachArg(args, f) {
		for (var i = 0; i < args.length; i++) {
			f(args[i]);
		}
	}

	var loc = window.location.split('#')[1];

	funcs.sub = function(name) {
		this.paths = [];
		function result() {
			this.name = name;
			eachArg(arguments, function(arg) {
				arg.get().forEach(function(child) {
					paths.push(name + '/' + child);
				})
			});
		}

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

	var subfuncs = [
		["view", function() {
			this.transition(view);
		}],
		["transition", function(view) {
            
		}],
		["get", function() {

		}],
        ["path", function(path) {
            this.path = path;
        }]  
	];

	if (func !== undefined) {

    }
}

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
