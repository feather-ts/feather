---
date: 2016-04-04T00:00:00+00:00
title: Decorators
---

## Construct

`@Construct({selector: string, singleton: boolean})`

The only class decorator in feather that indicates where in the DOM this component should be mounted to. You can mount
components to arbitrary css selectors, which allows to create mixins of components. The singleton flag is used in 
combination with the `@Inject` decorator.
Each widget should implement the interface `Widget` or `ArrayWidget` respectively.

> Make sure the classes are imported in the correct order. If a widget references another 
widget in its template, the referenced one must be imported first. Without an import the
@Construct() decorator is never executed!                

## AfterMount

`@AfterMount()`

Feather generates the entire component hierarchy off-screen in document fragments for performance reasons. If one needs
to evauate values, such as bounding client rects, one needs to know when the component has been attached to the visible DOM.
Methods decorated with this will be called when exactly this has happened. Array widgets will call the method every time
they have been added or re-added to their visible array containers.

## Inject

`@Inject()`

If a component is flagged as a singleton in @Construct() it can be inject into any other component via @Inject. Please
note that the property name must match the decapitalized class name of your widget. If the singleton is called MyApp, then
you should use `@Inject() myApp: MyApp`.

## InArray

`@InArray()`

Similar to `@Inject` you can inject the parent array to its children. Sometimes it might be useful to have access to the 
siblings from within the child widget. You can name the property as you wish, i.e. `@InArray() parentArray: Item[]`

## Template

`@Template(name?: string)`

Each widget should have at least one method decorated with `@Template()`. The name parameter is optional but can be used
to declare different markup versions of the same widget. This can be later used to render the same array in two different
ways or when doing responsive components beyond the css capabilities. The method name is irrelevant but it should return
a string with the markup.

### Array bindings

One special case of bindings applies to array properties. This can be bound in the simplest case 
like this:`<ul {{myArrayProperty}}/>`.

> Please note that the array *must* contain other widgets of the type `ArrayWidget`. ArrayWidget must also have only one root element
in their @Template decorated method.

Like with other property bindings you can use transformers here - to show the array's size for example. However, if the transformer returns a function
it is used to filter array elements from the dom. Let's have a look:

```typescript
myArray = [new ArrayItem(), new ArrayItem()]

@Template()
markUp() {
  <ul {{myArray:onlyEven}}/>
  <span>Size of the array: {{myArray:size}}</span>
}

onlyEven = () => (el: ArrayItem, idx: number) => idx % 2 === 0
size = (arr: any[]) => arr.length // or this.myArray.length
```

Now let's assume ArrayItem has two decorated methods one with `@Template('a')` and one with `@Template('b')`. You can tell the array binding which
template to use when rendering its children by simply adding a `template="a"` attribute to the binding:

```typescript
@Template()
markUp() {
  <ul {{myArray:onlyEven}} template="a"/>
  <ul {{myArray}} template="b"/>
}
```

This will render the same array twice, once with only even elements and via template A and once the full array where each child is rendered with template B.

> Currently feather cannot intercept index-based array access like this: `myArr[i] = new ChildWidget()`. Please use
splice instead: `myArr.splice(i, 1, new ChildWidget())`. There are plans to use array proxies in the
future which will allow this.

### Boolean attribute bindings
A special case are boolean properties bound in attributes: `<span hidden="{{isHidden}}"/>`. If they are true the attribute is a valueless property: 
`<span hidden/>` and just `<span/>`, if false. 

### String attribute bindings
When strings are bound to attributes or inside a class attribute, each will be removed respectively when the property evaluates to `undefined`.

### Special attributes
Binding to attributes `checked`, `value` or `selectedIndex` will set the bound property value via javascript and not via dom.

### Template attribute
As mentioned in array bindings already, there is the `template` attribute to tell feather how to render elements in a list. 
To make things even more flexible you can assign a dynamic binding to the template attribute: `template={{view}}`. 
Now whenever the `view` property changes the array will be re-rendered. One can also add the template attribute to any
other tag and inject other templates into the current one.

## Computed

`@Computed(...props: string[])`

When binding a method inside a template `{{myMethod}}` you need to tell feather which properties the method relies on to
evaluate its return value. This is done via the props arguments. Now whenever any of the properties changes it will redraw
the function binding. 

> There is no need to add array properties to props.

## On

```typescript
@On({
  event?: string | string[],
  selector?: string, 
  preventDefault?: boolean, 
  scope?: Scope, 
  options?: boolean | AddEventListenerOptions
})
```

`event` can be either a string or an array of strings, for example 'click' or ['focusout', 'blur']. If event is not present
it will have the value of the method name. For simplicity you can write `On({}) click() {...}`
`selector` a css selector that should match an element inside the template. If present event's will on fire if the event.target
matches this selector. If it is not set at all the event fires directly on the root element of the template
`preventDefault` small helper to call ev.preventDefault() before your widget's method is invoked
`scope` Defaults to Scope.Delegate. If set to Scope.Direct the event is bound directly the the element matching the selector.

> One special scope is Scope.UntilMatch. Usually event lookup stops at the root element, but here we can listen to events that
were fired on widgets further down the dom tree.

`options` Default event listener options or capture flag. See w3c specs for further details.

## Fetch

`@Get(), @Post(), @Delete(), @Put()`

Four decorators that invoke fetch to communicate with your backend. Each of them takes the fetch [config](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request) extended by two additional values `{..., url: string, processor?: (req: Response) => any}`. Processor is set to
`(res) => res.json()` by default to allow json based calls.
You can load data in two ways. Either you use `await` and leave the method empty:

```typescript
init(el: Element) {
  const data = await this.fetchData()
  // do stuff with data
  render(this, el)
}

@Get({url: '/server/data'})
async fetchData() {}

```

Or you process your data in the fetchData, which requires you to change the signature like so:

```typescript
init(el: Element) {
  this.fetchData()  
}

@Get({url: '/server/data'})
fetchData(res?: MyData) {
  // do stuff with data
  render(this, el)
}
```

Sending data to your backend is done in a similar way except that you invoke your decorated method with the payload

```typescript
this.postData(dataToPost)
...

@Post(...)
postData(postedData, res?: Result) {...}
```

To catch fetch errors annotate any method with 
```typescript
@FetchError(status: number)
onError(err: Error) {....}
```

## Local storage

Feather comes with built-in local storage support which makes it very easy to keep the UI state between page loads.
There are two essential decorators:

`@LocalStorage()`

This can be used to store properties of a widget into local storage. The storage key `<parent.property>` is calculated automatically. 
If your widget has a property or method called `id`, `name`, `title` it will use that to get the parent token for the key. If not, it
will default to the class name. 

There is one exception when using this decorator with arrays. We need to tell feather which prototype to use to recreate the children.
For technical reasons of import orders we need to use a function to that: `@LocalStorage(() => MyChildClass) items: MyChildClass[] = []`

In a second step we need to tell feather which properties inside of MyChildClass should be serialized. This can be done by decorating
them with `@Storable()` inside the MyChildClass.

## Media Query

`@MediaQuery(mediaquery)`

Decorate methods with this and the method will be called whenever the media query parameter matches or the view port resizes to match it.
Usually used instead of the init() method, like so:

```typescript
@Construct({selector: '.something'})
export class Responsive implements Widget {

    init = (el: Element) => 0

    @MediaQuery('all and (max-width: 768px)')
    mobile(el: Element) {
        render(this, el, 'mobile')
    }

    @MediaQuery('all and (min-width: 768px)')
    desktop(el: Element) {
        render(this, el, 'desktop')
    }

    @Template('desktop')
    markup1() {
        return `desktop<icon icon="bla"/>`
    }

    @Template('mobile')
    markup2() {
        return `mobile`
    }
}
```

## ElementQuery

`@ElementQuery(fn: (element: Element) => boolean, ...events: string[])`

Similar to MediaQueries you can write responsive components reacting to an element query. The query function is 
re-evaluated when one of the `window` attached `events` from the parameter list triggers. If none are given it 
triggers on window resize, but you can change this to a scroll or orientation event for example. Unlike media 
queries element queries can only run when the component has been mounted to the dom. Make sure your render method 
is neutral enough to avoid any content flicker when one of the element queries triggers.

> Never call `render` inside `ElementQuery` decorated methods: it will result in an infinite loop. 

## Router

`@Route('/:path')`

Triggers when the route matches the current location. Feather supports hash based urls but also HTML5's history API. If you want to enable hash based routing add an attribute `routing="hash"` anywhere in your document. For example `<html routing="hash">`.

Route parsing is very basic and supports only :path and *path tokens. The called method is passed an object where the properties correspond to the named tokens in the route

```typescript
  interface MyRoute {
    path: string
    id: string
  }  
  ....
  @Route('/:path/:id')
  locationPath(route: MyRoute) {
    // ...
  }
```

When using historyAPI make sure all your document urls load the original document on the server-side. Unlike with hash routing links must be intercepted and manually routed. The routing module exposes one method `navigate(path)` which can be used to navigate to new routes.

## Template node

`@TemplateNode(selector: string)`

A small helper that will populate properties decorated with an element from within the template. The property is only available 
after render() was called.

## Transformer

`@Transformer()`

You can place transformers anywhere across your widget classes as long as you decorate them with this.

## Batch

`@Batch()`

There is a common usecase where one toggles a bunch of properties in items of a bound array.
For example changing a property for each array item in a loop would redraw the parent widget
every time an item changes. To tell feather to update the parent only once you can annotate
a method with this decorator (make sure @Batch is the last decorator on the method):

```typescript
@Click('label[for="toggle-all"]')
@Batch()
toggleAll() {
    const state = !this.allCompleted()
    this.todos.forEach(t => t.completed = state)
}
```


