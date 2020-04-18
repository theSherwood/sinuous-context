import { api } from 'sinuous';

const pipe = (f, g) => (...args) => g(...f(...args));

api.insert = pipe(enableTracking, api.insert);
api.property = pipe(enableTracking, api.property);

let tracking = {};

// Wraps any dynamic content (observables, computeds, other components)
// embedded in components with hierarchical context tracking.
function enableTracking(el, value, ...args) {
  if (typeof value !== 'function') {
    return [el, value, ...args];
  }

  function tracker(...args) {
    const prevTracking = tracking;
    tracking = tracker._tracking;
    const result = value(...args);
    tracking = prevTracking;
    return result;
  }
  tracker._tracking = { ...tracking };

  return [el, tracker, ...args];
}

// Calls all the Sinuous component functions in the array of children
function getChildrenAsNodes(children) {
  return children.flatMap((child) => {
    if (Array.isArray(child)) {
      return getChildrenAsNodes(child);
    }
    while (typeof child === 'function') {
      child = child();
    }
    if (child instanceof DocumentFragment) {
      return getChildrenAsNodes(Array.from(child.children));
    }
    return child;
  });
}

/**
 * Used like a component. Pass `key: value` pairs as props.
 *
 * @example
 * let view = html`
 *    <${Context} key1=${value1} key2=${value2}>
 *      <${Component1} />
 *      <${Component2} />
 *      <div>
 *        <${Component3} />
 *      </div>
 *    <//>
 * `;
 *
 * @param {Object} context
 * @param  {...*} children
 * @returns {Function}
 */
function context(context, ...children) {
  function update() {
    const prevContext = tracking._ctx;
    tracking._ctx = { ...prevContext, ...update._ctx };
    const result = getChildrenAsNodes(children);
    tracking._ctx = prevContext;
    return result;
  }

  update._ctx = context;
  return update;
}

export { context, context as Context };

/**
 * If `key` is passed, returns the context value for that `key` that is
 * nearest in the context hierarchy; otherwise, returns an object of every
 * key/value pair visible from that level of the context hierarchy.
 *
 * @example
 * // assume context = { key1: value1, key2: value2 }
 * let c = getContext('key1') // c = value1
 *
 * @example
 * // assume context = { key1: value1, key2: value2 }
 * let c = getContext() // c = { key1: value1, key2: value2 }
 *
 * @param {String} [key] - This is probably the prop name.
 * @returns {*} Either the value assigned to `key` or all key/value pairs
 * at that level of the hierarchy.
 */
export function getContext(key) {
  return arguments.length === 0
    ? tracking && tracking._ctx
    : tracking && tracking._ctx && tracking._ctx[key];
}
