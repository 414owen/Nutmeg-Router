# Nutmeg-Router

## How it works:  

Nutmeg is an alternative markup... Style, I guess?  
That's cool, but if you want to develop a functioning multi-page app  
you have two options; either create a new Nutmeg script to represent  
every page of your site, with some shared scripts or whatever, or  
have some fancy one-page-app thing going on. 

Nutmeg-Router provides the following fancy one-page-app things:

* Url Routing
* Browser history handling
* Component-sharing based on shared URIs

Here are some reasons you should use Nutmeg-Router:

* Navigating pages:
  * Requires no network access
  * Is instantaneous
  * Can have fancy transitions
* Your server:
  * Serves less files
* Your code:
  * Can be shared far more easily across pages
  * Requires only one set of Nutmeg boilerplate
  * Is (even) smaller

Here are some reasons to not use Nutmeg-Router:

* You care about 'people' who use IE9-

## What does it look like

### Basics

In this basic example

```js
router(
	sub('projects').view(my-projects-page),
	// 
	sub('about-me').view(about-me-page),
	// Default, for matching everything else
	sub('').view(landing-page)
)
```