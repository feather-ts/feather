---
date: 2016-04-03T00:00:00+00:00
title: Examples
---

## Routing

Routing is simply done by having one page container component with a bunch of `@Route()` decorated 
methods and one single-item array binding for the pages to show. Now from within the routing methods 
replace the array item with a new page.

```
myPages: Page[] = []

@Route('/login')
onPath(params) {
    this.myPage.splice(0, 1, new LoginPage())  
}

@Route('/project/:id')
onPath(params) {
    const project = await this.fetchProject(params.id)
    this.myPage.splice(0, 1, new ProjectPage(project))  
}
```

## Swapping components
This can be also achieved by swapping elements in an array
```typescript
wichComponent = 0
components = [new Component1(), new Component2()]

@Template()
eitherOrExample() {
  return `<div {{components:componentToggle}}/>`
}

componentToggle = () => (el, idx) => idx === this.whichComponent
```

## Localization
Feather has the powerful feature of component mixins. Let's have a look at a component like this:
```typescript
@Construct({selector: 'Localisation'})
class Localisation implements Widget {

  translations: {[k: string]: string}

  init(el) {
      this.translations = await this.fetchTranslations()
      render(this, el) // render app
  }

  ...

  @Transformer()
  translate = (key: string) => this.translations[k]

}

@Construct({selector: '[key]'})
class LocalizedToken implements Widget {

  key: string

  init(el) {
      this.key = el.getAttribute('key')
      render(this, el)
  }

  @Template()
  renderApp() {
      return `{{key:translate}}`
  }
}
```
Now we can use in any component's template a `key` attribute to inject translated texts in it's body:
```typescript
@Template()
myHtml() {
  return `
    <h1 key="my.localized.key"/>
    <div>
        <label key="my.localized.labelkey"/>
    </div>
    `    
}
```

## Responsive Components
Those are done with @MediaQuery decorators and you will find an exmaple over there.

## Loading data
This is done via @Get(), @Post, etc decorators. See the fetch sections in decorators for further details.

## Gestures
Coming soon...

## Messaging
Component messaging can be achieved in various ways. When adding widgets to array, they are usually create like normal classes and a reference 
to the parent widget can be passed on. For widgets that are created from template tags (or other css selectors) one can use `findWidget(this, SubWidget)` or `findWidgets(this, SubWidget)` respectively. If you need to call your parent widget from the subwidget itself, you can pass on
a function as an attribute `<subwidget callback={{myWidgetFunction}}/>`. Feather will bind this function to the widget context automatically.

## Injecting HTML
This can be achieved with a simple helper that call render, used like so `<injected-html html="{{myhtmlprop}}"/>`:
```typescript
@Construct({selector: 'injected-html'})
class LocalizedToken implements Widget {

  html: string

  init(el) {
      el.innerHTML = html
  }
}
```

## TodoMVC

Someone once joked that UI frameworks are tools to add todo items
efficiently to a list. Feather also comes with a demo of the famous
[todo app](https://github.com/feather-ts/todomvc). Check out also
the source code to see how easy the application looks like and 
how little framework boilerplate it contains.
