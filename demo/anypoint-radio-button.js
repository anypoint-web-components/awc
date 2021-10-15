import { html } from 'lit-html';
import { DemoPage } from './lib/DemoPage.js';
import './lib/interactive-demo.js';
import '../anypoint-checkbox.js';
import '../anypoint-radio-button.js';
import '../anypoint-radio-group.js';

class ComponentDemo extends DemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'disabled'
    ]);
    this.componentName = 'anypoint-radio-button';
    this.disabled = false;
  }

  _changeHandler(e) {
    const node = e.target;
    console.log('change', node.name, node.value, node.checked);
  }

  _demoTemplate() {
    const {
      demoStates,
      darkThemeActive,
      disabled,
    } = this;
    return html`<section class="documentation-section">
      <h3>Interactive demo</h3>
      <p>
        This demo lets you preview the radio button in a radio group with various
        configuration options.
      </p>
      <interactive-demo
        .states="${demoStates}"
        ?dark="${darkThemeActive}"
      >
        <label id="mainLabel">Radio group</label>
        <anypoint-radio-group
          aria-labelledby="mainLabel"
          slot="content"
          ?disabled="${disabled}"
          >
          <anypoint-radio-button name="fruit" value="apple" @change="${this._changeHandler}">Apple</anypoint-radio-button>
          <anypoint-radio-button name="fruit" value="banana" @change="${this._changeHandler}">Banana</anypoint-radio-button>
          <anypoint-radio-button name="fruit" value="orange" @change="${this._changeHandler}">Orange</anypoint-radio-button>
        </anypoint-radio-group>

        <label slot="options" id="mainOptionsLabel">Options</label>
        <anypoint-checkbox
          aria-describedby="mainOptionsLabel"
          slot="options"
          name="demoDisabled"
          @change="${this._toggleMainOption}"
          >Disabled</anypoint-checkbox
        >
      </interactive-demo>
    </section>`;
  }

  contentTemplate() {
    return html`
      <h2>Anypoint Radio Button</h2>
      ${this._demoTemplate()}
      <section class="documentation-section">
        <h3>Introduction</h3>
        <p>
          This component is based on Material Design radio button and adjusted for
          Anypoint platform components.
        </p>
        <p>
          Anypoint web components are set of components that allows to build
          Anypoint enabled UI in open source projects.
        </p>
        <p>
          An element to render accessible radio buttons that can be groupped in
          a radio group.
        </p>
      </section>
      <section class="documentation-section">
        <h2>Usage</h2>

        <p>
          Radio buttons are used to select one of predefined options.
          Radio buttons should be used when the user must see all available options. Consider using a dropdown
          list if the options can be collapsed.
        </p>

        <p>
          See
          <a href="https://material.io/design/components/selection-controls.html#radio-buttons"
            >Radio buttons</a
          >
          documentation in Material Design documentation for principles and
          anatomy of radio buttons.
        </p>

        <h3>Installation</h3>

        <code>npm install --save @anypoint-web-components/anypoint-radio-button</code>

        <details>
          <summary>In a HTML document</summary>
          <code>
            <pre>
      ${`<html>
        <head>
          <script type="module">
            import '@anypoint-web-components/anypoint-radio-button/anypoint-radio-button.js';
            import '@anypoint-web-components/anypoint-radio-button/anypoint-radio-group.js';
          </script>
        </head>
        <body>
          <anypoint-radio-group>
            <anypoint-radio-button name="fruit">Apple</anypoint-radio-button>
            <anypoint-radio-button name="fruit">Banana</anypoint-radio-button>
            <anypoint-radio-button name="fruit">Orange</anypoint-radio-button>
          </anypoint-radio-group>
        </body>
      </html>`}
            </pre>
          </code>
        </details>

        <h3>Radio group</h3>

        <p>
          Radio button by itself does not provide much of useful functionality as single
          element cannot know anything about other radio buttons in the document.<br/>
          To fully support radio buttons use <code>anypoint-radio-group</code> with combination
          with radio buttons.
        </p>

        <p>
          Radio group allows to manage selection of a button and keeps single button selected.
          It also provides accessibility support for screen readers and keyboard operations.
        </p>

        <p>
          Note, unlike native radio inputs, radio group element does not check for name
          of the button when managing selection. All buttons inside the group element
          are considered single group.
        </p>

        <h3>Selection</h3>

        <p>
          The group element works best with <code>anypoint-radio-button</code> but it will
          work with any element that has <code>role=radio</code>, including native radio input.
        </p>

        <p>
          The group element provides common interface for anypoint elements that manages selection.
          This means that <code>selected</code>, <code>selectedItem</code>, and <code>attrforselected</code>
          is supported.
        </p>

        <h4>Selectable elements</h4>
        <p>
          By default every child element that has <code>role=radio</code> or is <code>input[type=radio]</code>
          is considered a selectable element. This can be changed by setting <code>selectable</code> property.
          However, for accessibility, this behavior should not be changed.
        </p>

        <label class="block-label" id="label1">Select a fruit:</label>
        <anypoint-radio-group aria-labelledby="label1">
          <anypoint-radio-button name="fruit">Apple</anypoint-radio-button>
          <anypoint-radio-button name="fruit">Banana</anypoint-radio-button>
          <anypoint-radio-button name="fruit">Orange</anypoint-radio-button>
          <input type="radio" name="fruit" id="nativeInput"/>
          <label for="nativeInput">I am native</label>
        </anypoint-radio-group>

        <details>
            <summary>Code example</summary>
            <code>
              <pre>
      ${`<label id="label1">Select a fruit:</label>
      <anypoint-radio-group aria-labelledby="label1">
        <anypoint-radio-button name="fruit">Apple</anypoint-radio-button>
        <anypoint-radio-button name="fruit">Banana</anypoint-radio-button>
        <anypoint-radio-button name="fruit">Orange</anypoint-radio-button>
        <input type="radio" name="fruit" id="nativeInput"/>
        <label for="nativeInput">I am native</label>
      </anypoint-radio-group>`}
              </pre>
            </code>
        </details>

        <h4>Selection via checked attribute</h4>

        <p>
          Like native radio button, set <code>checked</code> attribute to select
          a checkbox.
        </p>

        <p>
          Only last checked radio button in the children list keeps the selection
        </p>

        <label class="block-label" id="label2">Select a fruit:</label>
        <anypoint-radio-group aria-labelledby="label2">
          <anypoint-radio-button name="fruit" checked>Apple</anypoint-radio-button>
          <anypoint-radio-button name="fruit">Banana</anypoint-radio-button>
          <anypoint-radio-button name="fruit" checked>Orange</anypoint-radio-button>
        </anypoint-radio-group>

        <details>
            <summary>Code example</summary>
            <code>
              <pre>
      ${`<label id="label2">Select a fruit:</label>
      <anypoint-radio-group aria-labelledby="label2">
        <anypoint-radio-button name="fruit" checked>Apple</anypoint-radio-button>
        <anypoint-radio-button name="fruit">Banana</anypoint-radio-button>
        <anypoint-radio-button name="fruit" checked>Orange</anypoint-radio-button>
      </anypoint-radio-group>`}
              </pre>
            </code>
        </details>

        <h4>Selection via index</h4>

        <p>
          To select a radio button set <code>selected</code> value to the index of the selectable element.
        </p>

        <label class="block-label" id="label3">Select a fruit:</label>
        <anypoint-radio-group aria-labelledby="label3" selected="1">
          <anypoint-radio-button name="fruit">Apple</anypoint-radio-button>
          <anypoint-radio-button name="fruit">Banana</anypoint-radio-button>
          <anypoint-radio-button name="fruit">Orange</anypoint-radio-button>
        </anypoint-radio-group>

        <details>
            <summary>Code example</summary>
            <code>
              <pre>
      ${`<label id="label3">Select a fruit:</label>
      <anypoint-radio-group aria-labelledby="label3" selected="1">
        <anypoint-radio-button name="fruit">Apple</anypoint-radio-button>
        <anypoint-radio-button name="fruit">Banana</anypoint-radio-button>
        <anypoint-radio-button name="fruit">Orange</anypoint-radio-button>
      </anypoint-radio-group>`}
              </pre>
            </code>
        </details>

        <h4>Selection via attrforselected</h4>

        <p>
          Alternatively a selection can be made by using <code>attrforselected</code>
          attribute which points to a attribute set on a children with selection value.
        </p>

        <label class="block-label" id="label4">Select a fruit:</label>
        <anypoint-radio-group aria-labelledby="label4" selected="banana" attrforselected="data-label">
          <anypoint-radio-button name="fruit" data-label="apple">Apple</anypoint-radio-button>
          <anypoint-radio-button name="fruit" data-label="banana">Banana</anypoint-radio-button>
          <anypoint-radio-button name="fruit" data-label="orange">Orange</anypoint-radio-button>
        </anypoint-radio-group>

        <details>
            <summary>Code example</summary>
            <code>
              <pre>
      ${`<label id="label4">Select a fruit:</label>
      <anypoint-radio-group aria-labelledby="label4" selected="banana" attrforselected="label">
        <anypoint-radio-button name="fruit" label="apple">Apple</anypoint-radio-button>
        <anypoint-radio-button name="fruit" label="banana">Banana</anypoint-radio-button>
        <anypoint-radio-button name="fruit" label="orange">Orange</anypoint-radio-button>
      </anypoint-radio-group>`}
              </pre>
            </code>
        </details>

      </section>
    `;
  }
}
const instance = new ComponentDemo();
instance.render();
