---
date: 2016-04-06T00:00:00+00:00
title: A component framework.
type: index
---
_Feather-Ts_ is a light-weight and easily extendable _ui_ framework written in [TypeScript](https://www.typescriptlang.org/).
You can use it to write embeddable components or single page applications for mobile and desktop alike. Regardless of 
its tiny footprint it is self-contained and provides templating, routing, messaging, event handling and 
rest api integration out of the box.

It relies heavily on decorators and grants the developer the freedom to subclass their components from anything they want.
Further more it has logic-less templates with a very simple binding syntax and no dom diffing overhead. It is targeted at 
developers who are tired of the bloat and unnecessary complexity that has spread into frontend development. If you enjoy  
talking about actions, intents, drivers, watchers, or sinks then feather-ts might not be for you.   

Unlike many other frameworks feather doesn't utilize a virtual dom. This has pros and cons that you should consider before 
starting a project. It does not provide server-side rendering by itself, but this can be achieved with many other 
ready-made solutions. On the upside all dom calls are synchronous and you can write ui tests against the real dom without 
having to wait for the render loop to complete. 

### The framework offers the following features:

* Written in TypeScript
* Routing via hash or history API 
* Easy REST consumption
* Pure HTML templates without logic and a very simple binding syntax
* Event delegation out of the box
* Integrated media-query support in components
* Runs in all major ever-green browsers (IE11 needs polyfills)
* Generates clean HTML markup without any trace of the framework
* No need to wrap your data objects or use awkward factories

Feather is a back to the basics tool and tries to make coding SPAs fun again. If you come back 
to your code months from now, you won't have to wonder what you did to make the framework work
or how the data flow was going. The code is flat and reduced to your own business logic without
any dogmatic constructs you would need to follow. 

## Intellij IDEA

Feather comes with an own [IDE plugin](http://dist.feather-ts.com/feather.jar) to help you with syntax 
highlighting and mistyped references. Grab it from the link or the official plugin repository.
  
## Examples  
    
* <div>You can check out the todomvc demo from [here](http://todo.feather-ts.com).</div>
  
