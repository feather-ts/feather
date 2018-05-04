---
date: 2016-04-02T00:00:00+00:00
title: Packaging & Deploying
---
## Packaging

You can use browserify, parcel-bundler or any other existing technology to pack and 
bundle feather applications.

## Imports

Right you can use all feather-ts parts by importing the files directly from NPM:

`import {Construct} from '@feather-ts/feather-ts'`

There will be a commonjs and es6 bundles distribution available too, but we recommend
to include only the bits and pieces required for your own app, instead of the full
bundled package.

