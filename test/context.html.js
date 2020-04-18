import { Context, getContext } from '../src/context';
import { html, o } from 'sinuous';
import test from 'tape';

test('html, wrapped: empty Context', (t) => {
  let view = html`
    <div>
      <${Context}>
        <p>foo</p>
      <//>
    </div>
  `;

  t.equal(view.outerHTML, '<div><p>foo</p></div>');
  t.end();
});

test('html, wrapped: empty Context, multiple children', (t) => {
  let view = html`
    <div>
      <${Context}>
        foo
        <p>bar</p>
        <p>baz</p>
      <//>
    </div>
  `;

  t.equal(view.outerHTML, '<div>foo<p>bar</p><p>baz</p></div>');
  t.end();
});

test('html, wrapped: Context and getContext with key and observable', (t) => {
  let nested = () => {
    let c = getContext('foo');
    return html`<p>${c}</p>`;
  };

  let value = o(1);
  let view = html`
    <div>
      <${Context} foo=${value}>
        foo
        <div>
          <${nested} />
        </div>
        <p>bar</p>
      <//>
      <p>baz</p>
    </div>
  `;

  t.equal(
    view.outerHTML,
    '<div>foo<div><p>1</p></div><p>bar</p><p>baz</p></div>'
  );

  value(value() + 1);

  t.equal(
    view.outerHTML,
    '<div>foo<div><p>2</p></div><p>bar</p><p>baz</p></div>'
  );
  t.end();
});

test('html, wrapped: Context and getContext with observable and no key', (t) => {
  let nested = () => {
    let c = getContext();
    return html`<p>${c.foo}</p>`;
  };

  let value = o(1);
  let view = html`
    <div>
      <${Context} foo=${value}>
        <div>
          <${nested} />
        </div>
      <//>
    </div>
  `;

  t.equal(view.outerHTML, '<div><div><p>1</p></div></div>');

  value(value() + 1);

  t.equal(view.outerHTML, '<div><div><p>2</p></div></div>');
  t.end();
});

test('html, wrapped: multiple component children', (t) => {
  let nested1 = () => {
    let c = getContext();
    return html`<p>${c.foo}</p>`;
  };
  let nested2 = () => {
    let c = getContext('bar');
    return html`<p>${c}</p>`;
  };

  let value1 = o(1);
  let value2 = o(2);
  let view = html`
    <div>
      <${Context} foo=${value1} bar=${value2}>
        <div>
          <${nested1} />
          <${nested2} />
        </div>
      <//>
    </div>
  `;

  t.equal(view.outerHTML, '<div><div><p>1</p><p>2</p></div></div>');

  value1(value1() + 1);
  value2(value2() + 1);

  t.equal(view.outerHTML, '<div><div><p>2</p><p>3</p></div></div>');
  t.end();
});

test('html, wrapped: multiple component children without interior wrapper', (t) => {
  let nested1 = () => {
    let c = getContext();
    return html`<p>${c.foo}</p>`;
  };
  let nested2 = () => {
    let c = getContext('bar');
    return html`<p>${c}</p>`;
  };

  let value1 = o(1);
  let value2 = o(2);
  let view = html`
    <div>
      <${Context} foo=${value1} bar=${value2}>
        <${nested1} />
        <${nested2} />
      <//>
    </div>
  `;

  t.equal(view.outerHTML, '<div><p>1</p><p>2</p></div>');

  value1(value1() + 1);
  value2(value2() + 1);

  t.equal(view.outerHTML, '<div><p>2</p><p>3</p></div>');
  t.end();
});

test('html, wrapped: multiple component children nested', (t) => {
  let nested1 = () => {
    let c = getContext();
    return html`<p>${c.foo}</p>`;
  };
  let nested2 = (_, ...children) => {
    let c = getContext('bar');
    return html`
      ${children}
      <p>${c}</p>
    `;
  };

  let value1 = o(1);
  let value2 = o(2);
  let view = html`
    <div>
      <${Context} foo=${value1} bar=${value2}>
        <div>
          <${nested2}>
            <${nested1} />
          <//>
        </div>
      <//>
    </div>
  `;

  t.equal(view.outerHTML, '<div><div><p>1</p><p>2</p></div></div>');

  value1(value1() + 1);
  value2(value2() + 1);

  t.equal(view.outerHTML, '<div><div><p>2</p><p>3</p></div></div>');
  t.end();
});

test('html, wrapped: multiple Contexts with full shadowing and interior wrappers', (t) => {
  let nested1 = () => {
    let c = getContext();
    return html`<p>${c.foo}</p>
      <p>${c.bar}</p>`;
  };
  let nested2 = (_, ...children) => {
    let c = getContext();

    let val1 = () => c.foo() * 10;
    let val2 = () => c.bar() * 10;
    return html`
      <p>${c.foo}</p>
      <p>${c.bar}</p>
      <${Context} foo=${val1} bar=${val2}>
        <div>
          ${children}
        </div>
      <//>
    `;
  };

  let value1 = o(1);
  let value2 = o(2);
  let view = html`
    <div>
      <${Context} foo=${value1} bar=${value2}>
        <div>
          <${nested2}>
            <${nested1} />
          <//>
        </div>
      <//>
    </div>
  `;

  t.equal(
    view.outerHTML,
    '<div><div><p>1</p><p>2</p><div><p>10</p><p>20</p></div></div></div>'
  );

  value1(value1() + 1);
  value2(value2() + 1);

  t.equal(
    view.outerHTML,
    '<div><div><p>2</p><p>3</p><div><p>20</p><p>30</p></div></div></div>'
  );
  t.end();
});

test('html, wrapped: multiple Contexts with full shadowing and without interior wrappers', (t) => {
  let nested1 = () => {
    let c = getContext();
    return html`<p>${c.foo}</p>
      <p>${c.bar}</p>`;
  };
  let nested2 = (_, ...children) => {
    let c = getContext();

    let val1 = () => c.foo() * 10;
    let val2 = () => c.bar() * 10;
    return html`
      <p>${c.foo}</p>
      <p>${c.bar}</p>
      <${Context} foo=${val1} bar=${val2}>
        ${children}
      <//>
    `;
  };

  let value1 = o(1);
  let value2 = o(2);
  let view = html`
    <div>
      <${Context} foo=${value1} bar=${value2}>
        <${nested2}>
          <${nested1} />
        <//>
      <//>
    </div>
  `;

  t.equal(view.outerHTML, '<div><p>1</p><p>2</p><p>10</p><p>20</p></div>');

  value1(value1() + 1);
  value2(value2() + 1);

  t.equal(view.outerHTML, '<div><p>2</p><p>3</p><p>20</p><p>30</p></div>');
  t.end();
});

test('html, wrapped: multiple Contexts with partial shadowing and interior wrappers', (t) => {
  let nested1 = () => {
    let c = getContext();
    return html`<p>${c.foo}</p>
      <p>${c.bar}</p>`;
  };
  let nested2 = (_, ...children) => {
    let c = getContext();

    let val1 = () => c.foo() * 10;
    return html`
      <p>${c.foo}</p>
      <p>${c.bar}</p>
      <${Context} foo=${val1}>
        <div>
          ${children}
        </div>
      <//>
    `;
  };

  let value1 = o(1);
  let value2 = o(2);
  let view = html`
    <div>
      <${Context} foo=${value1} bar=${value2}>
        <div>
          <${nested2}>
            <${nested1} />
          <//>
        </div>
      <//>
    </div>
  `;

  t.equal(
    view.outerHTML,
    '<div><div><p>1</p><p>2</p><div><p>10</p><p>2</p></div></div></div>'
  );

  value1(value1() + 1);
  value2(value2() + 1);

  t.equal(
    view.outerHTML,
    '<div><div><p>2</p><p>3</p><div><p>20</p><p>3</p></div></div></div>'
  );
  t.end();
});

test('html, wrapped: multiple Contexts with partial shadowing and without interior wrappers', (t) => {
  let nested1 = () => {
    let c = getContext();
    return html`<p>${c.foo}</p>
      <p>${c.bar}</p>`;
  };
  let nested2 = (_, ...children) => {
    let c = getContext();

    let val1 = () => c.foo() * 10;
    return html`
      <p>${c.foo}</p>
      <p>${c.bar}</p>
      <${Context} foo=${val1}>
        ${children}
      <//>
    `;
  };

  let value1 = o(1);
  let value2 = o(2);
  let view = html`
    <div>
      <${Context} foo=${value1} bar=${value2}>
        <${nested2}>
          <${nested1} />
        <//>
      <//>
    </div>
  `;

  t.equal(view.outerHTML, '<div><p>1</p><p>2</p><p>10</p><p>2</p></div>');

  value1(value1() + 1);
  value2(value2() + 1);

  t.equal(view.outerHTML, '<div><p>2</p><p>3</p><p>20</p><p>3</p></div>');
  t.end();
});

test('html, wrapped: multiple Contexts with partial shadowing and interior wrappers and children as component', (t) => {
  let nested1 = () => {
    let c = getContext();
    return html`<p>${c.foo}</p>
      <p>${c.bar}</p>`;
  };
  let nested2 = (_, ...children) => {
    let c = getContext();

    let val1 = () => c.foo() * 10;
    return html`
      <p>${c.foo}</p>
      <p>${c.bar}</p>
      <${Context} foo=${val1}>
        <div>
          <${children} />
        </div>
      <//>
    `;
  };

  let value1 = o(1);
  let value2 = o(2);
  let view = html`
    <div>
      <${Context} foo=${value1} bar=${value2}>
        <div>
          <${nested2}>
            <${nested1} />
          <//>
        </div>
      <//>
    </div>
  `;

  t.equal(
    view.outerHTML,
    '<div><div><p>1</p><p>2</p><div><p>10</p><p>2</p></div></div></div>'
  );

  value1(value1() + 1);
  value2(value2() + 1);

  t.equal(
    view.outerHTML,
    '<div><div><p>2</p><p>3</p><div><p>20</p><p>3</p></div></div></div>'
  );
  t.end();
});

test('html, wrapped: multiple Contexts with partial shadowing and without interior wrappers and children as component', (t) => {
  let nested1 = () => {
    let c = getContext();
    return html`<p>${c.foo}</p>
      <p>${c.bar}</p>`;
  };
  let nested2 = (_, ...children) => {
    let c = getContext();

    let val1 = () => c.foo() * 10;
    return html`
      <p>${c.foo}</p>
      <p>${c.bar}</p>
      <${Context} foo=${val1}>
        <${children} />
      <//>
    `;
  };

  let value1 = o(1);
  let value2 = o(2);
  let view = html`
    <div>
      <${Context} foo=${value1} bar=${value2}>
        <${nested2}>
          <${nested1} />
        <//>
      <//>
    </div>
  `;

  t.equal(view.outerHTML, '<div><p>1</p><p>2</p><p>10</p><p>2</p></div>');

  value1(value1() + 1);
  value2(value2() + 1);

  t.equal(view.outerHTML, '<div><p>2</p><p>3</p><p>20</p><p>3</p></div>');
  t.end();
});

test('html, unwrapped: empty Context', (t) => {
  let component = () => html`
    <${Context}>
      foo
      <p>bar</p>
    <//>
  `;

  t.assert(component() instanceof DocumentFragment);
  t.equal(component().childNodes[0].textContent, 'foo');
  t.equal(component().childNodes[1].outerHTML, '<p>bar</p>');

  // Inject component into the dom
  let div = document.createElement('div');
  div.id = 'test-container';
  let body = document.querySelector('body');
  body.append(div);
  div.append(component());
  let p = document.querySelector('p');

  t.equal(p.textContent, 'bar');
  t.equal(div.textContent, 'foobar');

  div.remove();

  // Render component in another component
  let container = () => html`
    <div>
      <${component} />
    </div>
  `;

  t.equal(container().outerHTML, '<div>foo<p>bar</p></div>');

  t.end();
});

test('html, unwrapped: multiple Contexts with partial shadowing and deep nesting', (t) => {
  let nested1 = () => {
    let c = getContext();
    return html`<p>
        ${c.foo}
      </p>
      <p>
        ${c.bar}
      </p>`;
  };
  let nested2 = (_, ...children) => {
    let c = getContext();

    let val1 = () => c.foo() * 10;
    return html`
      <p>
        ${c.foo}
      </p>
      <p>
        ${c.bar}
      </p>
      <${Context} foo=${val1}>
        <${children} />
      <//>
    `;
  };

  let value1 = o(1);
  let value2 = o(2);

  let component = () => html`
    <${Context} foo=${value1} bar=${value2}>
      foo
      <p>
        bar
      </p>
      <${nested2}>
        <${nested1} />
        <${nested2}>
          <${nested1} />
        <//>
      <//>
      <p>
        baz
      </p>
    <//>
  `;

  // Inject component into the dom
  let div = document.createElement('div');
  div.id = 'test-container';
  let body = document.querySelector('body');
  body.append(div);
  div.append(component());

  t.equal(
    div.innerHTML,
    'foo<p>bar</p><p>1</p><p>2</p><p>10</p><p>2</p><p>10</p><p>2</p><p>100</p><p>2</p><p>baz</p>'
  );

  // Render component in another component
  let container = () => html`
    <div>
      <${component} />
    </div>
  `;

  t.equal(
    container().outerHTML,
    '<div>foo<p>bar</p><p>1</p><p>2</p><p>10</p><p>2</p><p>10</p><p>2</p><p>100</p><p>2</p><p>baz</p></div>'
  );

  value1(value1() + 1);
  value2(value2() + 1);

  t.equal(
    div.innerHTML,
    'foo<p>bar</p><p>2</p><p>3</p><p>20</p><p>3</p><p>20</p><p>3</p><p>200</p><p>3</p><p>baz</p>'
  );
  t.equal(
    container().outerHTML,
    '<div>foo<p>bar</p><p>2</p><p>3</p><p>20</p><p>3</p><p>20</p><p>3</p><p>200</p><p>3</p><p>baz</p></div>'
  );

  // Remove div from dom
  div.remove();

  t.end();
});
