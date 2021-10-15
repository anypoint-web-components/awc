/* eslint-disable lit-a11y/anchor-is-valid */
import { html } from 'lit-html';
import { DemoPage } from './lib/DemoPage.js';
import './lib/interactive-demo.js';
import '../anypoint-item.js';
import '../anypoint-listbox.js';
import '../anypoint-checkbox.js';
import '../anypoint-radio-button.js';
import '../anypoint-radio-group.js';
import './simple-dropdown.js';

class ComponentDemo extends DemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'demoDisabled',
      'demoNoAnimations',
      'demoVerticalAlign',
      'demoHorizontalAlign'
    ]);
    this.componentName = 'anypoint-dropdown';
    this.demoDisabled = false;
    this.demoNoAnimations = false;
    this.demoVerticalAlign = undefined;
    this.demoHorizontalAlign = undefined;
    this.items = [
      'allosaurus',
      'brontosaurus',
      'carcharodontosaurus',
      'diplodocus',
      'ekrixinatosaurus',
      'fukuiraptor',
      'gallimimus',
      'hadrosaurus',
      'iguanodon',
      'jainosaurus',
      'kritosaurus',
      'liaoceratops',
      'megalosaurus',
      'nemegtosaurus',
      'ornithomimus',
      'protoceratops',
      'quetecsaurus',
      'rajasaurus',
      'stegosaurus',
      'triceratops',
      'utahraptor',
      'vulcanodon',
      'wannanosaurus',
      'xenoceratops',
      'yandusaurus',
      'zephyrosaurus'
    ];
  }

  _toggleRadioOption(e) {
    const { name, checked, value } = e.target;
    if (!checked) {
      return;
    }
    this[name] = value;
  }

  _demoTemplate() {
    const {
      demoStates,
      darkThemeActive,
      demoDisabled,
      demoNoAnimations,
      demoVerticalAlign,
      demoHorizontalAlign
    } = this;
    return html`<section class="documentation-section">
    <h3>Interactive demo</h3>
    <p>
      This demo lets you preview the dropdown element with various
      configuration options.
    </p>
    <interactive-demo
      .states="${demoStates}"
      ?dark="${darkThemeActive}"
    >
      <simple-dropdown
        slot="content"
        ?noAnimations="${demoNoAnimations}"
        ?disabled="${demoDisabled}"
        .verticalAlign="${demoVerticalAlign}"
        .horizontalAlign="${demoHorizontalAlign}"
      >
        <button slot="dropdown-trigger">Toggle</button>
        <div slot="dropdown-content" class="random-content">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
          dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
          ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
          fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
          deserunt mollit anim id est laborum.
        </div>
      </simple-dropdown>

      <label slot="options" id="mainOptionsLabel">Options</label>
      <anypoint-checkbox
        aria-describedby="mainOptionsLabel"
        slot="options"
        name="demoDisabled"
        @change="${this._toggleMainOption}"
        >Disabled</anypoint-checkbox
      >
      <anypoint-checkbox
        aria-describedby="mainOptionsLabel"
        slot="options"
        name="demoNoAnimations"
        @change="${this._toggleMainOption}"
        >No animations</anypoint-checkbox
      >

      <label slot="options" id="mainVposLabel">Vertical alignment</label>
      <anypoint-radio-group
        slot="options"
        selectable="anypoint-radio-button"
        aria-labelledby="mainVposLabel"
      >
        <anypoint-radio-button
          @change="${this._toggleRadioOption}"
          name="demoVerticalAlign"
          value="top"
          checked
          >Top</anypoint-radio-button
        >
        <anypoint-radio-button
          @change="${this._toggleRadioOption}"
          name="demoVerticalAlign"
          value="bottom"
          >Bottom</anypoint-radio-button
        >
      </anypoint-radio-group>

      <label slot="options" id="mainHposLabel">Horizontal alignment</label>
      <anypoint-radio-group
        slot="options"
        selectable="anypoint-radio-button"
        aria-labelledby="mainHposLabel"
      >
        <anypoint-radio-button
          @change="${this._toggleRadioOption}"
          name="demoHorizontalAlign"
          value="left"
          checked
          >Left</anypoint-radio-button
        >
        <anypoint-radio-button
          @change="${this._toggleRadioOption}"
          name="demoHorizontalAlign"
          value="right"
          >Right</anypoint-radio-button
        >
      </anypoint-radio-group>
    </interactive-demo>
    </section>`;
  }

  _usageTemplate() {
    return html`
      <section class="documentation-section">
        <h2>Usage</h2>
        <p>
          Anypoint dropdown is an overlay that renders content in relation to
          other element.
        </p>

        <h3>Installation</h3>

        <code>npm install --save @anypoint-web-components/awc</code>

        <details>
          <summary>In a HTML document</summary>
          <code>
            <pre>
${`<html>
  <head>
    <script type="module">
      import '@anypoint-web-components/awc/anypoint-dropdown.js';
    </script>
    <style>
      #container {
        display: inline-block;
      }

      anypoint-dropdown {
        border: 1px solid gray;
        background: white;
        font-size: 2em;
      }
    </style>
  </head>
  <body>
    <div id="container">
      <button onclick="dropdown.open();">open the anypoint-dropdown</button>
      <anypoint-dropdown id="dropdown" noOverlap>
        <div slot="dropdown-content">Hello!</div>
      </anypoint-dropdown>
    </div>
  </body>
</html>`}
            </pre>
          </code>
        </details>

        <h3>Scroll actions</h3>

        <p>
          You can decide whether the overlay is closed or repositioned on
          document scroll by setting <code>scrollAction</code> to <code>refit</code>
          or <code>cancel</code>.
        </p>

        <h4>Refit on scroll</h4>

        <p>
          The position of the overlay is recalculated when document scrolls.
        </p>

        <simple-dropdown scrollAction="refit">
          <button slot="dropdown-trigger">Refit on scroll</button>
          <div slot="dropdown-content" class="random-content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
            ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum.
          </div>
        </simple-dropdown>

        <details>
          <summary>Code example</summary>
          <code>
            <pre>
${`<simple-dropdown scrollaction="refit">
  <button slot="dropdown-trigger">Refit on scroll</button>
  <div slot="dropdown-content" class="random-content">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
    dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
    ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
    deserunt mollit anim id est laborum.
  </div>
</simple-dropdown>`}
            </pre>
          </code>
        </details>

        <h4>Cancel on scroll</h4>

        <p>
          The overlay is closed when document scrolls.
        </p>

        <simple-dropdown scrollaction="cancel">
          <button slot="dropdown-trigger">Close on scroll</button>
          <div slot="dropdown-content" class="random-content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
            ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
            deserunt mollit anim id est laborum.
          </div>
        </simple-dropdown>

        <details>
          <summary>Code example</summary>
          <code>
            <pre>
${`<simple-dropdown scrollaction="cancel">
  <button slot="dropdown-trigger">Close on scroll</button>
  <div slot="dropdown-content" class="random-content">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
    dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
    ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
    deserunt mollit anim id est laborum.
  </div>
</simple-dropdown>`}
            </pre>
          </code>
        </details>

        <h3>Overlay content</h3>

        <p>
          The element can render any content. For example image or a list of items.
        </p>

        <simple-dropdown horizontalalign="left" verticalalign="bottom">
          <button slot="dropdown-trigger">Image content</button>
          <img src="./mulesoft-icon.svg" slot="dropdown-content" class="mulesoft-logo" alt=""/>
        </simple-dropdown>

        <details>
          <summary>Code example</summary>
          <code>
            <pre>
${`<simple-dropdown horizontalalign="left" verticalalign="bottom">
  <button slot="dropdown-trigger">Image content</button>
  <iron-image
    slot="dropdown-content"
    src="./mulesoft-icon.svg"
    sizing="cover"
    class="mulesoft-logo"
  ></iron-image>
</simple-dropdown>`}
            </pre>
          </code>
        </details>

        <simple-dropdown horizontalalign="right" verticalalign="bottom">
          <button slot="dropdown-trigger">Unordered list</button>
          <ul slot="dropdown-content" tabindex="0">
          ${this.items.map((item) => html`<li><a href="javascript:void(0)">${item}</a></li>`)}
          </ul>
        </simple-dropdown>

        <details>
          <summary>Code example</summary>
          <code>
            <pre>
${`<simple-dropdown horizontalalign="right" verticalalign="bottom">
  <button slot="dropdown-trigger">Unordered list</button>
  <ul slot="dropdown-content" tabindex="0">
    ${this.items.map((item) => `<li><a href="javascript:void(0)">${item}</a></li>`).join('\n    ')}
  </ul>
</simple-dropdown>`}
            </pre>
          </code>
        </details>

        <h3>Overlay with other Anypoint web components</h3>

        <simple-dropdown horizontalalign="right" verticalalign="bottom">
          <button slot="dropdown-trigger">Anypoint items</button>
          <div slot="dropdown-content">
          ${this.items.map((item) => html`<anypoint-item>${item}</anypoint-item>`)}
          </div>
        </simple-dropdown>

        <simple-dropdown horizontalalign="right" verticalalign="bottom">
          <button slot="dropdown-trigger">Anypoint listbox</button>
          <anypoint-listbox slot="dropdown-content">
          ${this.items.map((item) => html`<anypoint-item>${item}</anypoint-item>`)}
          </anypoint-listbox>
        </simple-dropdown>

      </section>
    `;
  }

  contentTemplate() {
    return html`
      <h2>Anypoint Dropdown</h2>
      ${this._demoTemplate()},
      ${this._usageTemplate()}
    `;
  }
}
const instance = new ComponentDemo();
instance.render();
