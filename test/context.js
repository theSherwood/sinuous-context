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

test('html, wrapped: Context and getContext with key and observable', (t) => {
  let nested = () => {
    let c = getContext('foo');
    return html`<p>${c}</p>`;
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
