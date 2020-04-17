import { Context } from "../src/context";
import { html } from "sinuous";
import test from "tape";

test("Context renders its contents when wrapped", (t) => {
  let view = html`
    <div>
      <${Context}>
        <p>foo</p>
      <//>
    </div>
  `;

  t.equal(view.outerHTML, "<div><p>foo</p></div>");
  t.end();
});
