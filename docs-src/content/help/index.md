---
date: 2016-04-01T00:00:00+00:00
title: Help
---

## IE11 support
Feather-ts comes without old browser support. However it does work
with IE11, if polyfills are provided. A minimal polyfill can be
imported via `import '@feather-ts/feather-dist/polyfills'`. 
Additionally you will need to add Promise and Fetch polyfills
yourself.

## Bindings and DOM writes
Feather has no virtual dom, but since the templates are logic less
the dom writes are optimized in place. You get maximum performance
without the overhead of diffing a parts of the DOM tree. 
Because of that feather plays nicely with others and doesn't care if 
the DOM is modified by external scripts.

## Scaffolding
No CLI tools exists as of yet, but you can just copy any of the 
github projects under `https://github.com/feather-ts`

## Issues
Report bugs to the github [tracker](https://github.com/feather-ts/feather/issues).
