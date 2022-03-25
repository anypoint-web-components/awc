/* eslint-disable lit-a11y/no-autofocus */
import { html, TemplateResult } from 'lit';
import { demoProperty } from './lib/decorators.js';
import { DemoPage } from './lib/DemoPage.js';
import './lib/interactive-demo.js';
import '../define/anypoint-checkbox.js';
import '../define/anypoint-button.js';
import '../define/anypoint-dialog.js';
import '../define/anypoint-dialog-scrollable.js';
import '../colors.js';

class ComponentDemoPage extends DemoPage {
  @demoProperty()
  demoDisabled = false;

  @demoProperty()
  hasTitle = true;

  @demoProperty()
  hasActions = true;

  @demoProperty()
  modal = false;

  @demoProperty()
  nested = false;

  @demoProperty()
  scrolled = false;

  constructor() {
    super();
    this.componentName = 'anypoint-dialog';
  }

  _openHandler(): void {
    // @ts-ignore
    document.getElementById('dialog').opened = true;
  }

  _nestedHandler(): void {
    // @ts-ignore
    document.getElementById('nested').opened = true;
  }

  _demoTemplate(): TemplateResult {
    const {
      demoStates,
      anypoint,
      darkThemeActive,
      hasTitle,
      hasActions,
      modal,
      nested,
      scrolled
    } = this;
    return html`
      <section class="documentation-section">
        <h3>Interactive demo</h3>
        <p>
          This demo lets you preview the text field element with various
          configuration options.
        </p>


        <interactive-demo
          .states="${demoStates}"
          @state-changed="${this._demoStateHandler}"
          ?dark="${darkThemeActive}"
        >
          <anypoint-button
            slot="content"
            ?anypoint="${anypoint}"
            @click="${this._openHandler}"
          >
            Open dialog
          </anypoint-button>

          <label slot="options" id="mainOptionsLabel">Options</label>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="hasTitle"
            checked
            @change="${this._toggleMainOption}">With title</anypoint-checkbox>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="hasActions"
            checked
            @change="${this._toggleMainOption}">With actions</anypoint-checkbox>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="modal"
            @change="${this._toggleMainOption}">Modal</anypoint-checkbox>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="nested"
            @change="${this._toggleMainOption}">Nested</anypoint-checkbox>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="scrolled"
            @change="${this._toggleMainOption}">Scrolled</anypoint-checkbox>
        </interactive-demo>


        <anypoint-dialog
          id="dialog"
          ?anypoint="${anypoint}"
          ?modal="${modal}">
          ${hasTitle ? html`<h6 class="title">Dialog Title</h6>` : ''}
          ${scrolled ? this.scrollableContent() : this.regularContent()}
          ${hasActions ? html`<div class="buttons">
            ${nested ? html`<anypoint-button
              @click="${this._nestedHandler}"
              ?anypoint="${anypoint}">Open nested</anypoint-button>` : ''}
            <anypoint-button
              data-dialog-dismiss
              ?anypoint="${anypoint}">Cancel</anypoint-button>
            <anypoint-button
              data-dialog-confirm
              autofocus
              ?anypoint="${anypoint}">OK</anypoint-button>
          </div>` : ''}
        </anypoint-dialog>

        <anypoint-dialog
          id="nested"
          ?anypoint="${anypoint}">
          <h6 class="title">Nested dialog</h6>

          <p>
            This appears above the first dialog
          </p>

          <div class="buttons">
            <anypoint-button data-dialog-confirm autofocus>OK</anypoint-button>
          </div>
        </anypoint-dialog>
      </section>
    `;
  }

  scrollableContent(): TemplateResult {
    const content = new Array(20).fill(0).map(() => html`<p class="whitespace">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex
    ea commodo consequat. Duis aute
    irure dolor in reprehenderit in voluptate velit esse cillum dolore
    eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
    sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`);
    return html`
    <anypoint-dialog-scrollable>
      ${content}
    </anypoint-dialog-scrollable>
    `;
  }

  regularContent(): TemplateResult {
    return html`<p class="whitespace">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex
    ea commodo consequat. Duis aute
    irure dolor in reprehenderit in voluptate velit esse cillum dolore
    eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
    sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>`;
  }

  _introductionTemplate(): TemplateResult {
    return html`
      <section class="documentation-section">
        <h3>Introduction</h3>
        <p>
          This component is based on Material Design dialog and adjusted for
          Anypoint platform components.
        </p>
        <p>
          Anypoint web components are set of components that allows to build
          Anypoint enabled UI in open source projects.
        </p>
        <p>
          Dialogs inform users about a task and can contain critical information,
          require decisions, or involve multiple tasks.
        </p>
      </section>
    `;
  }

  _usageTemplate(): TemplateResult {
    return html`
      <section class="documentation-section">
        <h2>Usage</h2>
        <p>Anypoint dialog comes with 2 predefied styles:</p>
        <ul>
          <li><b>Material Design</b> - Normal state</li>
          <li>
            <b>Anypoint</b> - To enable Anypoint theme
          </li>
        </ul>

        <h3>Basic usage</h3>

        <p>
          The dialog can have a header (h2 or .title) and action buttons that are
          inside .buttons container.
        </p>

        <p>
          Button with "data-dialog-dismiss" attribute will dismiss the dialog with
          "confirmed" property on a detail object of "overlay-closed" event set to false.
        </p>

        <p>
          Button with "data-dialog-confirm" attribute will close the dialog with
          "confirmed" property on a detail object of "overlay-closed" event set to true.
        </p>

        <details>
          <summary>Code example</summary>
          <code>
            <pre>
            ${`<anypoint-dialog>
              <h2>Dialog title</h2>
              <p>Dialog content</p>
              <div class="buttons">
                <anypoint-button data-dialog-dismiss>Cancel</anypoint-button>
                <anypoint-button data-dialog-confirm autofocus>OK</anypoint-button>
              </div>
            </anypoint-dialog>`}
            </pre>
          </code>
        </details>

        <h3>Scrollable dialogs</h3>
        <p>
          If the content of the dialog may exceed window size then use
          "anypoint-dialog-scrollable" as a content wrapper.
        </p>

        <details>
          <summary>Code example</summary>
          <code>
            <pre>
            ${`<anypoint-dialog>
              <h2>Dialog title</h2>
              <anypoint-dialog-scrollable>
                <p>Long content...</p>
              </anypoint-dialog-scrollable>
              <div class="buttons">
                <anypoint-button data-dialog-dismiss>Cancel</anypoint-button>
                <anypoint-button data-dialog-confirm autofocus>OK</anypoint-button>
              </div>
            </anypoint-dialog>`}
            </pre>
          </code>
        </details>
      </section>
    `;
  }

  contentTemplate(): TemplateResult {
    return html`
      <h2>Anypoint dialog</h2>
      ${this._demoTemplate()}
      ${this._introductionTemplate()}
      ${this._usageTemplate()}
    `;
  }
}

const instance = new ComponentDemoPage();
instance.render();
