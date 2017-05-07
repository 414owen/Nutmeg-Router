# Nutmeg-Router

- [Introduction](#introduction)
- [What does it look like](#what-does-it-look-like)
  - [A Basic Example](#a-basic-example)
  - [A More Advanced Example](#a-more-advanced-example)
- [Some explanations](#some-explanations)
  - [router()](#router)
  - [sub()](#sub)
  - [Matching](#matching)
    - [Specified Match](#specified-match)
    - [Empty String Match](#empty-string-match)
    - [Unconditional Match](#unconditional-match)
    - [Variable Match](#variable-match)
  - [Nesting](#nesting)
  - [View](#view)
  - [Changing Pages](#changing-pages)
  - [Transitions](#transitions)
  - [Router Options](#router-options)

## Introduction

Nutmeg is an alternative markup... Style, I guess? That's cool, but if you  
want to develop a functioning multi-page app? You have two options, either  
create a new Nutmeg script to represent every page of your site, with some  
shared scripts or whatnot, or have some fancy single-page-app routing foo going  
on.

Nutmeg-Router provides the following fancy single-page-app routing foo:

* Hash and non-hash based URL Routing
* Browser history handling

That's it. It doesn't have child route component nesting, it doesn't push and  
pop state objects, it just renders the right component based on a URL. This is  
because the abstraction of your website should be left to you. Nutmeg and  
Nutmeg Router abstract away the inbuilt DOM functions, and URL routing, but I  
know nothing about your site, so best leave everything else to you.

Here are some reasons you should use Nutmeg-Router:

* Navigating pages:
  * Requires no network access
  * Is instantaneous
  * Supports fancy custom page transitions (bring your own)
* Your server:
  * Serves less files
* Your pages:
  * Can be shared

Here are some reasons to not use Nutmeg-Router:

* You care about so-called-people who use IE9-

## What does it look like

### A Basic Example

In this basic example, we assume you have the domain name `nutmeg-rocks.com`.  
When a 'sub' matches, it renders the view provided on page.

```js
router(

    // Matches nutmeg-rocks.com/#/projects
    sub('projects').view(myProjectsPage),

    // Matches nutmeg-rocks.com/#/about-me
    sub('about-me').view(aboutMePage),

    // Matches anything else
    sub().view(landingPage)

).run();
```

Nutmeg Router's default behaviour is to use hash-URL routing. A view is a  
function that is called when a route matches, and must return a Nutmeg element.  
The router function can be called as many times as you want, and it always  
returns itself. This is useful if you want to add more routes at some point  
(kind of an odd thing to do, but hey, go for it!). To make the routing happen,  
you need to call .run() on the result.

### A More Advanced Example

```js
router({hash: false, base: 'testing'})(

    // Matches nutmeg-rocks.com/testing/projects and renders the base page
    sub('projects').view(projects)(

        // Matches nutmeg-rocks.com/testing/projects/Nutmeg
        sub('nutmeg').view(nutmegProject),

        // Matches nutmeg-rocks.com/testing/projects/LSystems and transitions
        // to 'lSystemsProject' using the 'fancyass' transition.
        sub('lsystems').view(lSystemProject).transition(fancyass)
    ),

    sub('greet')(

        // Matches /greet/* and passes the value of the :name path segment to
        // the view function, (which would usually not be inline
        sub(':name').view(function(params) {return div('Hello ' + params.name);})
    ),

    // Landing page
    sub().view(aboutMe)
).run();
```

Okay, lots of new things here. Firstly, we're not using hash-URLs anymore.  
This still won't refresh the page upon navigation, as Nutmeg Router uses the  
HTML5 History API, however you're going to have to set up your server to make  
sure all accesses to the given URLs serve up the correct site, because  
otherwise linking someone to `nutmeg-rocks.com/testing/projects/greet/owen`  
will return a 404.

Also, we're using 'testing' as a base. This means that all routing will be done  
relative to that path segment, i.e. `nutmeg-rocks.com/testing` will be the base.

We now have nested routes. If someone goes to
`nutmeg-rocks.com/testing/projects`  they'll be greeted with the projects page,
however if they go to  `nutmeg-rocks.com/testing/projects/lsystems`, they'll be
given the `lSystemsProject` page (it will transition to the page using the
`fancyass()`)

Now that you've got a taste, we'll go through everything in greater detail.

## Some explanations

### router()

router() is the base function for defining a URL routing scheme. It will set  
up your page so that browser history is managed for you, and start evaluating  
subfolders (`sub`s).

### sub()

`sub()` is the way of defining a (virtual) subdirectory in your domain scheme.  
It takes one parameter, a string, which matches a part of the URL.

### Matching

For all examples we will use the domain `nutmeg-rocks.com`. There are four  
types of matching:

#### Specified Match

This is where you type in the literal of a path segment, for example,  
we could define:

```js
router(
    sub('projects').view(page)
)
```

Which would match `nutmeg-rocks.com/#/projects`, and render `page` on-screen.

#### Empty String Match

```js
router(
    sub('').view(whatever)
)
```

This will only match the root of the current document, ie: `nutmeg-rocks.com`  
This isn't used for the root of a `sub`, because you can attach a view  
directly, as above in [Specified Match](#Specified-match).

#### Unconditional Match 

```js
router(
    sub().view(genericpage)
)
```

Matches Anything whatsoever in the current subpath.

#### Variable Match 

```js
router(
    sub(':name').view(greeter)
)
```

This matches anything, and passes the value of the url parameterinto greeter,  
provided greeter is a function. For example, if we visit  
`nutmeg-rocks.com/#/owen`, `greeter()` will be passed this object:  
`{ name: "owen" }`.

More formally, the function gets passes an object where all defined URL  
parameters used to get to the path are the keys to their values in the URL.

### Nesting

Here is the complete router for the development branch of my website. It should  
be pretty easy to see how nesting works from this. There are a bunch of  
top-level subs, e.g. `owen.cafe/projects`, then there is a page at  
`owen.cafe/blog` which displays the `postList` view, then there is a blog post  
viewer page, that accepts `owen.cafe/blog/*`, and renders the correct post  
based on what `*` was.

```
router({hash: false, base: "testing"})(

    sub("about-me").view(me),
    sub("projects").view(projects),
    sub("contact").view(contact),
    sub("blog").view(postList)(
        sub(":postid").view(blogPost)
    ),
    sub("hello")(
        sub(":name").view(function(params) {return "Hello " + params.name;})
    ),
    sub('').view(main),
    sub().view(div("Page not found :("))

).run();
```

### View

The view is the element to be rendered, it can either be a nutmeg  
element, or a function that returns a nutmeg element. If it's a  
function, it is passed an object with all the URL variables accumulated  
to get up to that sub.

### Changing Pages

Nutmeg Router defines a 'link' element inside the Nutmeg object, so if you've  
imported Nutmeg, you'll have it. It's not quite a normal nutmeg element, the  
first time you call it is with the path to push, the second time is with the  
Nutmeg elements to become clickable. Here's an example.

```js
// link supports anything Nutmeg elements support, like text or numbers
link("projects/iota")("Go to iota")

// Or other Nutmeg elements
link("projects/iota")(
    div("Go to iota")
)
```

You can also change page programatically by keeping a reference to the router  
object and calling `.go()` on it.

```js
var route = router(
    sub("home").view(home),
    sub("projects").view(projects)
).run();

...

route.go("projects")
```

Both approaches edit the URL correctly according to your router options.

### Transitions

Nutmeg supports transitions between subs. A transition is a function, so it's
easy to define your own. The transition function is passed in the container and  
the new view. Here is an example of a transition function  that fades the  
background to black (body had a transition style applied to it), then replaces  
the body with the new view and fades back to light grey.


```js
function pageChange(container, newPage) {
    var bod = body();
    bod.style({backgroundColor: foreground});
    window.setTimeout(function() {
        bod.clear().style(style.body)(newPage);
    }, pageChangeTime);
}
```

To add a page transition, simply add it to your `sub`:

```js
router(
    sub("home").transition(pageChange).view(div("Hello, World!")),
    sub("other").view(otherView)
).run()
```

Here, when we go to `home` (see [Changing Pages](#changing-pages)), the  
pageChange function will be called to perform the change.

### Router Options

| Option    | Type           | Default | Purpose                                         |
| --------- | -------------- | ------- | -------                                         |
| universal | boolean        | true    | Whether to listen to location changes           |
| hash      | boolean        | true    | Whether to use hash-URLs instead of normal URLs |
| base      | string         | ""      | Defines base path to calculate all routes from  |
| into      | Nutmeg Element | body    | Element into which the routes are rendered      |
