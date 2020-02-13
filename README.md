# sinuous-context

This package provides a simple context api for [Sinuous](https://github.com/luwes/sinuous).

## Installation:

There are three ways to consume sinuous-context

### ESM

Run the following inside your project directory:

`npm install sinuous-context`

There is no configuration. You can use it wherever you are using [Sinuous](https://github.com/luwes/sinuous).

[CodeSandbox](https://codesandbox.io/s/sinuous-context-esm-t3swm)

### Script/CDN

Put this into your HTML:

`<script src="https://unpkg.com/sinuous-context/dist/min.js"></script>`

Consumed this way, sinuous-context must configure [Sinuous](https://github.com/luwes/sinuous). This script take will put the variable `sinuousContext` into the global scope. Let's assume you have fetched [Sinuous](https://github.com/luwes/sinuous) in a similar fashion:

`<script src="https://unpkg.com/sinuous/dist/all.js"></script>`

You need to wrap the `api` property from [Sinuous](https://github.com/luwes/sinuous). Something like this:

`window.sinuousContext.enableContext(window.S.api)`

[CodeSandbox](https://codesandbox.io/s/sinuous-context-cdn-lupwk)

### Module

Consumed this way, sinuous-context must be configured similar to the Script/CDN method. For example:

```
<script
  type="module"
  src="https://unpkg.com/sinuous@0.24.0/module/all.js"
></script>
<script
  type="module"
  src="https://unpkg.com/sinuous-context@0.0.3/dist/module.js"
></script>
<script type="module">
  import { sinuous } from "https://unpkg.com/sinuous@0.24.0/module/all.js";
  import {
    enableContext,
    Context,
    getContext
  } from "https://unpkg.com/sinuous-context@0.0.3/dist/module.js";
  let { html, api } = sinuous;
  
  enableContext(api);

  /*  
    ...  Sinuous App ...
  */

</script>
```

[CodeSandbox](https://codesandbox.io/s/sinuous-context-module-7d78u)

## Usage:

Apart from `enableContext`, which is available for configuring [Sinuous](https://github.com/luwes/sinuous) on both the Script/CDN and Module distributions of sinuous-context (the ESM method of installation does the configuration itself), there are 3 exports from sinuous-context.

1. `context` : a context of context provider style component
2. `Context` : an alias of `context` for those who prefer capitalized component names
3. `getContext` : a function that returns the context available at the call site's place in the component hierarchy

### `context`

`context` (and `Context`) take any arbitrary parameter name and value. [Sinuous](https://github.com/luwes/sinuous) observables or computed may be passed as values, as can any non-reactive value (strings, numbers, objects, arrays, functions).

For example:

```
import { context } from "sinuous-context";

function someComponent() {

  ...

  return html`
    <${context}
      foo=${someFunc}
      bar=${someObservable}
      baz=${someString}
    >
      <${someOtherComponent} />
      <div>
        <${andAnotherComponent} />
      </div>
    <//>
  `;
}
```

### `getContext`

This part is straightforward. Pass a key to `getContext` to get a particular value, or pass nothing to get all context available at that part of the tree:

```
import { getContext } from "sinuous-context";

function someOtherComponent() {
  let fooFunc = getContext("foo");        // someFunc
  let barObservable = getContext("bar");  // someObservable

  fooFunc();

  return html`<p>${barObservable}</p>`;
}

function andAnotherComponent() {
  let allContext = getContext();

  console.log(allContext);
  // { foo: someFunc, bar: someObservable, baz: someString }

  return html`
    ...
  `;
}
```

### Hierarchy

As anyone who has used context apis in frameworks like React or Svelte will know, a context api should provide a form a dynamic scope or hierarchical shadowing. sinuous-context does this. For example:

```
import { html } from "sinuous";
import { context, getContext } from "sinuous-context";

export function outerComponent() {
  return html`
    <${context} a=${10} b=${2}>
      <${nested} />             // 20
      <${context} b=${4.5}>
        <${nested} />           // 45
      <//>
    <//>
  `;
}

function nested() {
  let allContext = getContext();
  return html`
    <div>${allContext.a * allContext.b}</div>
  `;
}
```

### Issues and Quirks

For the time being, children that are going to be using `getContext` need to be rendered as components.

Don't do this:
```
...
  <p>
    ${children}
  </p>
...
```

Do this instead:
```
...
  <p>
    <${children} />
  </p>
...
```

Failure to do this will result in all downstream children getting incorrect context.


## Acknowledgments and Thanks:

[Wesley Luyten](https://github.com/luwes) 

- Author of [Sinuous](https://github.com/luwes/sinuous)
- The principal code of sinuous-context is taken directly from [this codesandbox](https://codesandbox.io/s/sinuous-context-6vz16) by Wesley Luyten. The only real changes to this code that sinuous-context brings are changes to the api. As such, this package is hugely indebted to him. 

[Ryan Carniato](https://github.com/ryansolid)

- Author of [Solid](https://github.com/ryansolid/solid)
- Godfather of fine-grained reactive frontend frameworks
- Ryan Carniato provided a lot of guidance to both Wesley Luyten and myself as we tried to figure out a way to make a context api work for [Sinuous](https://github.com/luwes/sinuous)