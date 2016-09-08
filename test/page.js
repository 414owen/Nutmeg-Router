window.onload = function() {
    for (var key in Nutmeg) {
        eval('var ' + key + '=Nutmeg[key]');
    }
    router(
        sub('test').view(
            div("Try using the browser's 'back' button")
        ),
        sub('').view(
            'Default Page', 
            link('test')(button('Go to another page'))
        )
    )
}
