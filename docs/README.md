# API

###

- [context(context, ...children)](#context) ⇒ <code>function</code>
- [getContext([key])](#getContext) ⇒ <code>\*</code>

<a name="context"></a>

### context(context, ...children) ⇒ <code>function</code>

Used like a component. Pass `key: value` pairs as props.

**Kind**: global function

| Param       | Type                |
| ----------- | ------------------- |
| context     | <code>Object</code> |
| ...children | <code>\*</code>     |

**Example**

```js
let view = html`
  <${Context} key1=${value1} key2=${value2}>
    <${Component1} />
    <${Component2} />
    <div>
      <${Component3} />
    </div>
  <//>
`;
```

---

<a name="getContext"></a>

### getContext([key]) ⇒ <code>\*</code>

If `key` is passed, returns the context value for that `key` that is
nearest in the context hierarchy; otherwise, returns an object of every
key/value pair visible from that level of the context hierarchy.

**Kind**: global function  
**Returns**: <code>\*</code> - Either the value assigned to `key` or all key/value pairs
at that level of the hierarchy.

| Param | Type                | Description                     |
| ----- | ------------------- | ------------------------------- |
| [key] | <code>String</code> | This is probably the prop name. |

**Example**

```js
// assume context = { key1: value1, key2: value2 }
let c = getContext('key1'); // c = value1
```

**Example**

```js
// assume context = { key1: value1, key2: value2 }
let c = getContext(); // c = { key1: value1, key2: value2 }
```

---

# The End
