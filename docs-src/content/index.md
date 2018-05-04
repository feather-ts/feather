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
Further more it has logic-less templates with a very simple binding syntax and no virtual dom diffing overhead. It is 
targeted at developers who are tired of the bloat and unnecessary complexity that has spread into frontend development.
If you enjoy talking about actions, intents, drivers, watchers, observables or sinks then feather-ts might not be for you.   

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
* Integrated media-query and element query support in components
* Runs in all major ever-green browsers (IE11 needs polyfills)
* Generates clean HTML without any trace of the framework
* No need to wrap your data objects or use awkward factories
* Component mixins on a single dom node
* Tiny (around 10kb gzipped)

Feather is a back to the basics tool and tries to make coding SPAs fun again. If you come back 
to your code months from now, you won't have to wonder what you did to make the framework work
or how the data flow was going. The code is flat and reduced to your own business logic without
any dogmatic constructs. 

## Intellij IDEA

Feather comes with an own [IDE plugin](https://plugins.jetbrains.com/plugin/9992-feather-ts-code-support) to help you with syntax 
highlighting and mistyped references. Grab it from the link or the official plugin repository.

## Differences to other frameworks

Foremost Feather-Ts is complete: it handles data observables, routing and component 
messaging out of the box, provides tools to fetch REST data from the 
server and offers convenient ways to write responsive components.

Another big difference to virtual dom libraries is that your components can
be mixed together. Usually frameworks map from a custom tag to a component class.
In feather you can bind components to CSS selectors, which means you can split
different logical parts into own components and mix them together in a single 
tag: `<div class="clickable open-in-viewport hide-on-scroll">` where each of the 
classes will encapsulate own behavioral logic.

Furthermore Feather components don't have to extend from a framework class. There
are only two interfaces to implement from and the data models are observed as they
come without any library wrappers.

And lastly the template language is logic-less, which makes the templates easy
to read, unlike jsx that clutters over time with maps, ternary operators and 
passed down properties. You can also render the same component with different 
templates. The binding syntax is very simple and you don't need to learn any 
new custom attributes for it. 

Feel free to inspect the following [code](https://github.com/feather-ts/todomvc/blob/master/src/typescript/)
and see for yourself how much you understand of it, without having even read the
full documentation.

## Production readiness

{{< note >}}
Please use Feather-Ts as an inspiration or for hobby projects only. If you want to have something production-ready,
I would recommend a framework with a bigger community and an extensive documentation, for example [React](https://reactjs.org/),
[Angular](https://angular.io/) or [Vue](https://vuejs.org/).
{{< /note >}}

