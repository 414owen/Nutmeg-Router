window.onload = function() {
    for (var key in Nutmeg) {
        eval('var ' + key + '=Nutmeg[key]');
    }
    debugger;
}

