/*eslint no-unused-vars: "off"*/
/** @jsx */
import { h, o } from 'sinuous';
import { computed } from 'sinuous/observable';
import { Context, getContext } from '../src/context';
import test from 'tape';

test('jsx, wrapped: empty Context', (t) => {
  let view = (
    <div>
      <Context>
        <p>foo</p>
      </Context>
    </div>
  );
  t.equal(view.outerHTML, '<div><p>foo</p></div>');
  t.end();
});

test('jsx, wrapped: empty Context, multiple children', (t) => {
  let view = (
    <div>
      <Context>
        foo
        <p>bar</p>
        <p>baz</p>
      </Context>
    </div>
  );

  t.equal(view.outerHTML, '<div>foo<p>bar</p><p>baz</p></div>');
  t.end();
});

test('jsx, wrapped: Context and getContext with key and observable', (t) => {
  let Nested = () => {
    let c = getContext('foo');
    return <p>{c}</p>;
  };

  let value = o(1);
  let view = (
    <div>
      <Context foo={value}>
        foo
        <div>
          <Nested />
        </div>
        <p>bar</p>
      </Context>
      <p>baz</p>
    </div>
  );

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

test('jsx, wrapped: Context and getContext with observable and no key', (t) => {
  let Nested = () => {
    let c = getContext();
    return <p>{c.foo}</p>;
  };

  let value = o(1);
  let view = (
    <div>
      <Context foo={value}>
        foo
        <div>
          <Nested />
        </div>
        <p>bar</p>
      </Context>
      <p>baz</p>
    </div>
  );

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

test('jsx, wrapped: multiple component children', (t) => {
  let Nested1 = () => {
    let c = getContext();
    return <p>{c.foo}</p>;
  };
  let Nested2 = () => {
    let c = getContext('bar');
    return <p>{c}</p>;
  };

  let value1 = o(1);
  let value2 = o(2);
  let view = (
    <div>
      <Context foo={value1} bar={value2}>
        <div>
          <Nested1 />
          <Nested2 />
        </div>
      </Context>
    </div>
  );

  t.equal(view.outerHTML, '<div><div><p>1</p><p>2</p></div></div>');

  value1(value1() + 1);
  value2(value2() + 1);

  t.equal(view.outerHTML, '<div><div><p>2</p><p>3</p></div></div>');
  t.end();
});

test('jsx, wrapped: multiple component children without interior wrapper', (t) => {
  let Nested1 = () => {
    let c = getContext();
    return <p>{c.foo}</p>;
  };
  let Nested2 = () => {
    let c = getContext('bar');
    return <p>{c}</p>;
  };

  let value1 = o(1);
  let value2 = o(2);
  let view = (
    <div>
      <Context foo={value1} bar={value2}>
        <Nested1 />
        <Nested2 />
      </Context>
    </div>
  );

  t.equal(view.outerHTML, '<div><p>1</p><p>2</p></div>');

  value1(value1() + 1);
  value2(value2() + 1);

  t.equal(view.outerHTML, '<div><p>2</p><p>3</p></div>');
  t.end();
});

test('jsx, wrapped: multiple component children nested without interior wrapper', (t) => {
  let Nested1 = () => {
    let c = getContext();
    return <p>{c.foo}</p>;
  };
  let Nested2 = (_, ...children) => {
    let c = getContext('bar');
    return (
      <>
        {children}
        <p>{c}</p>
      </>
    );
  };

  let value1 = o(1);
  let value2 = o(2);
  let view = (
    <div>
      <Context foo={value1} bar={value2}>
        <Nested2>
          <Nested1 />
        </Nested2>
      </Context>
    </div>
  );

  t.equal(view.outerHTML, '<div><p>1</p><p>2</p></div>');

  value1(value1() + 1);
  value2(value2() + 1);

  t.equal(view.outerHTML, '<div><p>2</p><p>3</p></div>');
  t.end();
});

test('jsx, wrapped: multiple Contexts with full shadowing and interior wrappers', (t) => {
  let Nested1 = () => {
    let c = getContext();
    return (
      <>
        <p>{c.foo}</p>
        <p>{c.bar}</p>
      </>
    );
  };
  let Nested2 = (_, ...children) => {
    let c = getContext();

    let val1 = () => c.foo() * 10;
    let val2 = () => c.bar() * 10;
    return (
      <>
        <p>{c.foo}</p>
        <p>{c.bar}</p>
        <Context foo={val1} bar={val2}>
          <div>{children}</div>
        </Context>
      </>
    );
  };

  let value1 = o(1);
  let value2 = o(2);
  let view = (
    <div>
      <Context foo={value1} bar={value2}>
        <div>
          <Nested2>
            <Nested1 />
          </Nested2>
        </div>
      </Context>
    </div>
  );

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

test('jsx, wrapped: multiple Contexts with full shadowing and without interior wrappers', (t) => {
  let Nested1 = () => {
    let c = getContext();
    return (
      <>
        <p>{c.foo}</p>
        <p>{c.bar}</p>
      </>
    );
  };
  let Nested2 = (_, ...children) => {
    let c = getContext();
    let val1 = computed(() => c.foo() * 10);
    let val2 = computed(() => c.bar() * 10);
    return (
      <Context foo={val1} bar={val2}>
        {children}
      </Context>
    );
  };

  let value1 = o(1);
  let value2 = o(2);
  let view = (
    <div>
      <Context foo={value1} bar={value2}>
        <Nested2>
          <Nested1 />
        </Nested2>
      </Context>
    </div>
  );

  t.equal(view.outerHTML, '<div><p>10</p><p>20</p></div>');

  value1(value1() + 1);
  value2(value2() + 1);

  t.equal(view.outerHTML, '<div><p>20</p><p>30</p></div>');
  t.end();
});

test('jsx, wrapped: multiple Contexts with full shadowing and without interior wrappers (2)', (t) => {
  let Nested1 = () => {
    let c = getContext();
    return (
      <>
        <p>{c.foo}</p>
        <p>{c.bar}</p>
      </>
    );
  };
  let Nested2 = (_, ...children) => {
    let c = getContext();
    let val1 = computed(() => c.foo() * 10);
    let val2 = computed(() => c.bar() * 10);
    return (
      <>
        <p>{c.foo}</p>
        <p>{c.bar}</p>
        <Context foo={val1} bar={val2}>
          {children}
        </Context>
      </>
    );
  };

  let value1 = o(1);
  let value2 = o(2);
  let view = (
    <div>
      <Context foo={value1} bar={value2}>
        <Nested2>
          <Nested1 />
        </Nested2>
      </Context>
    </div>
  );

  t.equal(view.outerHTML, '<div><p>1</p><p>2</p><p>10</p><p>20</p></div>');

  value1(value1() + 1);
  value2(value2() + 1);

  t.equal(view.outerHTML, '<div><p>2</p><p>3</p><p>20</p><p>30</p></div>');
  t.end();
});

test('jsx, wrapped: multiple Contexts with partial shadowing and deep nesting', (t) => {
  let Nested1 = () => {
    let c = getContext();
    return (
      <>
        <p>{c.foo}</p>
        <p>{c.bar}</p>
      </>
    );
  };
  let Nested2 = (_, ...children) => {
    let c = getContext();

    let val1 = () => c.foo() * 10;
    return (
      <>
        <p>{c.foo}</p>
        <p>{c.bar}</p>
        <Context foo={val1}>{children}</Context>
      </>
    );
  };

  let value1 = o(1);
  let value2 = o(2);

  let Component = () => (
    <div>
      <Context foo={value1} bar={value2}>
        foo
        <p>bar</p>
        <Nested2>
          <Nested1 />
          <Nested2>
            <Nested1 />
          </Nested2>
        </Nested2>
        <p>baz</p>
      </Context>
    </div>
  );

  // Inject Component into the dom
  let div = document.createElement('div');
  div.id = 'test-container';
  let body = document.querySelector('body');
  body.append(div);
  div.append(Component());

  t.equal(
    div.innerHTML,
    '<div>foo<p>bar</p><p>1</p><p>2</p><p>10</p><p>2</p><p>10</p><p>2</p><p>100</p><p>2</p><p>baz</p></div>'
  );

  // Render Component in a container component
  let Container = () => (
    <div>
      <Component />
    </div>
  );

  t.equal(
    Container().outerHTML,
    '<div><div>foo<p>bar</p><p>1</p><p>2</p><p>10</p><p>2</p><p>10</p><p>2</p><p>100</p><p>2</p><p>baz</p></div></div>'
  );

  value1(value1() + 1);
  value2(value2() + 1);

  t.equal(
    div.innerHTML,
    '<div>foo<p>bar</p><p>2</p><p>3</p><p>20</p><p>3</p><p>20</p><p>3</p><p>200</p><p>3</p><p>baz</p></div>'
  );
  t.equal(
    Container().outerHTML,
    '<div><div>foo<p>bar</p><p>2</p><p>3</p><p>20</p><p>3</p><p>20</p><p>3</p><p>200</p><p>3</p><p>baz</p></div></div>'
  );

  // Remove div from dom
  div.remove();

  t.end();
});

test('jsx, unwrapped: multiple Contexts with partial shadowing and deep nesting', (t) => {
  let Nested1 = () => {
    let c = getContext();
    return (
      <>
        <p>{c.foo}</p>
        <p>{c.bar}</p>
      </>
    );
  };
  let Nested2 = (_, ...children) => {
    let c = getContext();

    let val1 = () => c.foo() * 10;
    return (
      <>
        <p>{c.foo}</p>
        <p>{c.bar}</p>
        <Context foo={val1}>{children}</Context>
      </>
    );
  };

  let value1 = o(1);
  let value2 = o(2);

  let Component = () => (
    <Context foo={value1} bar={value2}>
      foo
      <p>bar</p>
      <Nested2>
        <Nested1 />
        <Nested2>
          <Nested1 />
        </Nested2>
      </Nested2>
      <p>baz</p>
    </Context>
  );

  // Render Component in a container component
  let Container = () => (
    <div>
      <Component />
    </div>
  );

  t.equal(
    Container().outerHTML,
    '<div>foo<p>bar</p><p>1</p><p>2</p><p>10</p><p>2</p><p>10</p><p>2</p><p>100</p><p>2</p><p>baz</p></div>'
  );

  value1(value1() + 1);
  value2(value2() + 1);

  t.equal(
    Container().outerHTML,
    '<div>foo<p>bar</p><p>2</p><p>3</p><p>20</p><p>3</p><p>20</p><p>3</p><p>200</p><p>3</p><p>baz</p></div>'
  );

  t.end();
});
