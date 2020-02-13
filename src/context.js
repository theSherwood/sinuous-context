const pipe = (f, g) => (...args) => g(...f(...args));

let tracking = {};

function enableTracking(el, value, ...args) {
  if (typeof value !== "function") {
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

function getChildrenAsNodes(children) {
  return children.map(child => {
    while (typeof child === "function") {
      child = child();
    }
    return child;
  });
}

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

export function getContext(key) {
  return arguments.length === 0
    ? tracking && tracking._ctx
    : tracking && tracking._ctx && tracking._ctx[key];
}

export function enableContext(api) {
  api.insert = pipe(enableTracking, api.insert);
  api.property = pipe(enableTracking, api.property);
}
