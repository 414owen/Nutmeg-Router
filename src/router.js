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

    window.onpopstate = function(st) {
        evalLoc();
    }

    var R = N.router = function() {
        subs = arguments;
        evalLoc();
    }

    function evalLoc() {
        R.go(window.location.href.split('#')[1] || '');
    }

    R.eval = evalLoc;
    
    var URLvars;
    R.go = function(loc) {
        if (loc === '') {
            loc = '/';
        }
        URLvars = {};
        renderChildren(loc, body.clear(), subs);
    }

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
    }

    N.sub = function(path) {
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
            var match = false;
            var matched = function(newpath) {
                match = true;
                var view = this.view;
                if (view !== undefined) {
                    if (typeof(view) === 'function') {view = view(URLvars);}
                    container(view);
                }
                var newLoc = path.split(RegExp(this.subpath + '(.)'))[1];
                var fill = this.fill || container;
                renderChildren(newLoc, fill, subs);
            }.bind(this);

            var part = path.split('/')[1];
            var rest = path.slice(part.length + 1);
            if (path.indexOf(this.subpath) === 1) {
                matched(rest);
            } else if (this.subpath[0] === ':') {
                // Take out ':' and save variable
                URLvars[this.subpath.slice(1)] = part;
                matched(rest);
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
        "fill",
        "transision",
        "view"
    ].map(function(mod) {
        return [mod, function(m) {
            this[mod] = m;
        }];
    });

})();
