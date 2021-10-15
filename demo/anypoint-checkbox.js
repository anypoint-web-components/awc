/* eslint-disable no-param-reassign */
import { html } from 'lit-html';
import { DemoPage } from './lib/DemoPage.js';
import './lib/interactive-demo.js';
import '../anypoint-radio-button.js';
import '../anypoint-radio-group.js';
import '../colors.js';
import '../anypoint-checkbox.js';

/** @typedef {import('../').AnypointCheckboxElement} AnypointCheckboxElement */

const hasFormAssociatedElements = 'attachInternals' in document.createElement('span');

class ComponentDemo extends DemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'demoDisabled'
    ]);
    this.componentName = 'anypoint-checkbox';
    this.darkThemeActive = false;
    this.demoDisabled = false;
  }

  _communicationHandler(e) {
    if (this.__cancelCommunicationChange) {
      return;
    }
    const nodes = /** @type AnypointCheckboxElement[] */ (Array.from(document.querySelectorAll('.communication-options anypoint-checkbox')));
    const state = e.target.checked;
    nodes.forEach((node) => {
      node.checked = state;
    });
  }

  _communicationItemHandler() {
    const nodes = /** @type AnypointCheckboxElement[] */ (Array.from(document.querySelectorAll('.communication-options anypoint-checkbox')));
    const checkedNodes = [];
    const notCheckedNodes = [];
    // at the time when event is dispatched the attribute is not yet reflected.
    nodes.forEach((node) => {
      if (node.checked) {
        checkedNodes[checkedNodes.length] = node;
      } else {
        notCheckedNodes[notCheckedNodes.length] = node;
      }
    });
    const indeterminate = !!checkedNodes.length && !!notCheckedNodes.length;
    const parent = /** @type AnypointCheckboxElement */ (document.querySelector('#communication'));
    if (indeterminate) {
      this.__cancelCommunicationChange = true;
      parent.checked = false;
      parent.indeterminate = true;
      this.__cancelCommunicationChange = false;
    } else {
      parent.indeterminate = false;
      if (checkedNodes.length) {
        parent.checked = true;
      } else {
        parent.checked = false;
      }
    }
  }

  _nativeSubmit(e) {
    e.preventDefault();
    const out = document.querySelector('#nativeFormValues');
    const fd = new FormData(e.target);
    let result = 'Collected values:\n';
    fd.forEach((value, name) => { result += `${name}: ${value}\n`; });
    // @ts-ignore
    out.innerText = result;
  }

  _demoTemplate() {
    const {
      demoStates,
      darkThemeActive,
      demoDisabled
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

        <anypoint-checkbox
          slot="content"
          ?disabled="${demoDisabled}"
          >
          Label
        </anypoint-checkbox>

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

  _usageTemplate() {
    return html`
    <section class="documentation-section">
      <h2>Usage</h2>

      <p>
        Checkbox allows to select one or more option from a set of options.
        If the user is expected to toggle a view, a switch should be used instead.
      </p>

      <p>
        See
        <a href="https://material.io/design/components/selection-controls.html#checkboxes"
          >Checkboxes</a
        >
        documentation in Material Design documentation for principles and
        anatomy of a checkbox.
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
          import '@anypoint-web-components/awc/anypoint-checkbox.js';
        </script>
      </head>
      <body>
        <anypoint-checkbox>Regular checkbox</anypoint-checkbox>
        <anypoint-checkbox checked>Checked checkbox</anypoint-checkbox>
        <anypoint-checkbox indeterminate>Indeterminate checkbox</anypoint-checkbox>
        <anypoint-checkbox required>Required checkbox</anypoint-checkbox>
        <anypoint-checkbox disabled>Disabled checkbox</anypoint-checkbox>
      </body>
    </html>`}
          </pre>
        </code>
      </details>

      <h3>Selection state</h3>

      <p>
        A checkbox can be <b>unselected</b>, <b>selected</b>, or <b>indeterminate</b>.
      </p>

      <h4>Indeterminate state</h4>
      <p>
        The indeterminate state is when a parent checkbox on complex selection group has
        child checkboxes that are both selected and unselected.
      </p>

      <div class="centered">
        <anypoint-checkbox
          indeterminate
          id="communication"
          @change="${this._communicationHandler}">Communication</anypoint-checkbox>
        <div class="communication-options">
          <anypoint-checkbox
            name="email"
            checked
            @change="${this._communicationItemHandler}">Email</anypoint-checkbox>
          <anypoint-checkbox
            name="sms"
            @change="${this._communicationItemHandler}">SMS</anypoint-checkbox>
          <anypoint-checkbox
            name="push"
            @change="${this._communicationItemHandler}">Push notification</anypoint-checkbox>
          <anypoint-checkbox
            name="mail"
            @change="${this._communicationItemHandler}">Mail</anypoint-checkbox>
        </div>
      </div>

      <details>
          <summary>Code example</summary>
          <code>
            <pre>
    ${`<anypoint-checkbox indeterminate>Communication</anypoint-checkbox>
    <div class="communication-options">
      <anypoint-checkbox name="email" checked>Email</anypoint-checkbox>
      <anypoint-checkbox name="sms">SMS</anypoint-checkbox>
      <anypoint-checkbox name="push">Push notification</anypoint-checkbox>
      <anypoint-checkbox name="mail">Mail</anypoint-checkbox>
    </div>`}
            </pre>
          </code>
      </details>
    </section>
    `;
  }

  _formTemplate() {
    return html`
    <section class="documentation-section">
      <h3>Form-associated custom elements</h3>
      <p>
        Form-associated custom elements enable web authors to define and create
        custom elements which participate in form submission.

        Learn more: <a href="https://www.chromestatus.com/feature/4708990554472448" target="_blank">Chrome status</a>
      </p>

      ${hasFormAssociatedElements ?
          html`<p>Your browser support this API</p>` :
          html`<p>Your browser <b>does not</b> support this API</p>`}

      <div class="centered">
        <form id="nativeForm" @submit="${this._nativeSubmit}">
          <fieldset>
            <anypoint-checkbox
              name="options"
              value="newsletter" required>Subscribe to our newsletter</anypoint-checkbox>
            <anypoint-checkbox
              name="options"
              value="accepted" checked required>Agree to terms and conditions</anypoint-checkbox>
            <anypoint-checkbox
              name="options"
              value="optional">This is optional</anypoint-checkbox>
            <anypoint-checkbox
              name="options"
              value="noop" disabled>This is never included</anypoint-checkbox>
          </fieldset>
          <button type="submit">Submit</button>
        </form>
        <div>
          <code id="nativeFormValues"></code>
        </div>
      </div>
    </section>
    `;
  }

  _workingWithFormsTemplate() {
    return html`<section class="documentation-section">
      <h2>Working with forms</h2>
      ${this._formTemplate()}
    </section>`;
  }

  contentTemplate() {
    return html`
      <h2>Anypoint Checkbox</h2>
      ${this._demoTemplate()}
      ${this._usageTemplate()}
      ${this._workingWithFormsTemplate()}
    `;
  }
}
const instance = new ComponentDemo();
instance.render();
