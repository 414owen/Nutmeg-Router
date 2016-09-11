# Nutmeg-Router

## How it works:  

Nutmeg is an alternative markup... Style, I guess?  
That's cool, but if you want to develop a functioning multi-page app  you have  
two options; either create a new Nutmeg script to represent every page of your  
site, with some shared scripts or whatever, or have some fancy single-page-app  
foo going on. 

Nutmeg-Router provides the following fancy single-page-app foo:

* Url Routing
* Browser history handling
* Component-sharing based on shared URIs

Here are some reasons you should use Nutmeg-Router:

* Navigating pages:
  * Requires no network access
  * Is instantaneous
  * Supports fancy page transitions
* Your server:
  * Serves less files
* Your code:
  * Can be shared far more easily across pages
  * Requires only one set of Nutmeg boilerplate
  * Is (even) smaller

Here are some reasons to not use Nutmeg-Router:

* You care about 'people' who use IE9-

## What does it look like

### A Basic Example

In this basic example, we assume you hava the domain name 'nutmeg-rocks.com'.
When a 'sub' matches, it renders the view provided on page.

```js
router(

    // Matches nutmeg-rocks.com/#/projects
    sub('projects').view(my-projects-page),

    // Matches nutmeg-rocks.com/#/about-me
    sub('about-me').view(about-me-page),

    // Matches everything else, including nothing
    sub('').view(landing-page)

);
```

### A More Advanced Example

```js
router(

    // Matches /projects and renders the base page
    sub('projects').view(projects).fill(elem)(

        // Matches /projects/Nutmeg and renders project-specific stuff into elem
        sub('Nutmeg').view(nutmeg-project),

        // Matches /projects/LSystems and transitions to 'l-systems-project'
        // using the 'fancyass' transition.
        sub('LSystems').view(l-systems-project).transition(fancyass)
    ),

    sub('greetMe')(

        // Matches /greetMe/*anything* and passes the value of anything to greetName,
        // if greetName is a function
        sub(':name').view(greetName)
    )

    sub('aboutMe')
);
```

## Some explanations

### router()

router() is the base function for defining a URL routing scheme.
It will set up your page so that browser history is managed for
you, and start evaluating subfolders ('sub').

### sub()

sub() is the way of defining a (virtual) subdirectory in your domain 
scheme. It takes one parameter, a string, which matches a part of the 
URL.

### Matching

For all examples we will use the domain nutmeg-rocks.com.
There are four types of matching:

#### Specified Match

This is where you type in the literal of a path segment, for example,
we could define:

```js
router(
    sub('projects').view(page)
)
```

Which would match nutmeg-rocks.com/#/projects, and render `page` on-screen.

#### Empty Match

```js
router(
    sub('').view(whatever)
)

This will only match the root of the current subpath, ie: nutmeg-rocks.com

#### Unconditional Match 

```js
render(
    sub().view(genericpage)
)
```

Matches Anything whatsoever in the current subpath.

#### Variable Match 

```js
render(
    sub(':name').view(greeter)
)
```

This matches anything, and passes the value of the url part into greeter, 
provided greeter is a function. For example, if we visit
`nutmeg-rocks.com/#/owen`, greeter() will be passed in this object:

```js
{ name: "owen" }
```

More formally, the function gets passes an object where all defined URL
params used to get to the path are the keys to their values in the URL.

### View

The view is the element to be rendered, it can either be a nutmeg
element,  or a function that returns a nutmeg element. If it's a
function, it is  passed an object with all the URL variables accumulated
to get up to that  sub.  

### Transitions

Nutmeg supports transitions between subs. A transition is a function, so
it's easy to define your own. The transition function is passed in the
container and the new view. Here is an example of a transition function
I used on [414owen.github.io](414owen.github.io):


```js
function pageChange(container, newPage) {
    var bod = body();
    bod.style({backgroundColor: foreground});
    window.setTimeout(function() {
        bod.clear().style(style.body)(newPage);
    }, pageChangeTime);
}
```
