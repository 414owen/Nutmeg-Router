window.onload = function() {
    for (var key in Nutmeg) {
        eval('var ' + key + '=Nutmeg[key]');
    }
    router(
        sub('test').view(
            div('Hello World!')
        ),
        sub('').view(
            div(
                'Default Page', 
                link('/test')(button('Go to another page'))
            )
        )
    )
}
