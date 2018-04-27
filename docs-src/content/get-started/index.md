---
date: 2016-04-05T00:00:00+00:00
title: Getting started
---

## Installation

`npm install feather-ts --save`

## Components

Feather provides two interfaces to turn any `class` into a component: `Widget` and `ArrayWidget`.
`Widget` has a method `init(el: Element)` which is called when the component has been mounted 
to the dom. `ArrayWidget` tags classes that are added to arrays of a parent component. It has no 
init method, because initialization can be done in its constructor.

> Since feather has logic-less templates, the only way to swap out dom elements is via array bindings
> All decorators should be attached to the leaf class of a component.

## Mounting to the dom

The most common way to do this is to call `render(widget: Widget, el: Element)` inside your `init`
method. However, you might choose to load some backend data first and render the component
once the call has completed. 

```typescript

@Construct({selector: '.any-class'})
class MyWidget implements Widget {

  data: MyData

  init(el: Element) {
     this.data = await this.loadData()
     render(this, el)
  } 

  @Get({url: '/some/data'})
  async loadData() {}

  @Template()
  markup() {
    return `Hello {{data.name}}!`
  }

}
```

Furthermore you can also have renderless widgets, that just attach dom events or manipulate their childnodes. 

## Bootstrapping

Once you have written some components you need to kickstart feather. The recommended way is to create
an entry script that will contain a) imports of your initial components and b) the start call:

```typescript
import {start} from 'feather-ts/decorators/construct'
import './demo/app'

start()
```

The imports are required so the decorators can be run on the class before any widget is mounted to the dom.

## Templating

A widget should have at least one method decorated with `@Template()`. This method should return a string that
contains template bindings. Bindings in feather are written inside double curly brackets like this:

```
@Construct({selector: '.any-class'})
class MyWidget implements Widget {

  hidden = false
  children: MySubItems[] = []
  classNames = {
    bold: "bold"
  }
  some = {
    value: 'some text'
  }

  @Template()
  html() {
    return `
      <h1 hidden="{{hidden}}">This is {{some.value:uppercase}}</h1>
      <ul class="red {{classNames.bold}}" {{children}}/>
      <my-component/>
    `
  }

  init = (el: HTMLElement) => render(this, el)
  uppercase = (str: string) => str.toUpperCase()
}

```

Depending where the binding occurs, it will have different effects. Inside the curly brackets you can use dot notation 
to bind to deeper values. In each binding you can apply transformers that convert the property into something else
`{{some.value:uppercase}}`. The transformer `uppercase` should be a function in the class itself
or in any other(!) widget, as long as it is decorated with `@Transformer()`. You can also apply multiple transfomers
in a row like so: ```{{myprop:tohyphens:uppercase}}```.

Since this is the only syntax added to regular HTML the template is easy to read and understand even months
after writing the code.

### Sub-components

In the above example <my-component/> will create a new instance of a sub component, provided there is a  @Construct 
selector set to 'my-component'. You can pass data from the current widget by simple attribute bindings, like so:
`<my-component attr1={{prop1}} attr2={1+1}/>`. Single curlies will evaluate to a static value; this is useful for 
passing down numbers or booleans. If `prop1` is a function it is passed dowm as such but with the context bound to 
the current widget.

### Toggling elements
