import { html } from 'lit-html';
import '@advanced-rest-client/arc-icons/arc-icon.js';
import { DemoPage } from './lib/DemoPage.js';
import './lib/interactive-demo.js';
import '../anypoint-checkbox.js';
import '../anypoint-item.js';
import '../anypoint-listbox.js';
import '../anypoint-icon-button.js';
import '../anypoint-menu-button.js';

class ComponentDemoPage extends DemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'disabled',
      'ignoreSelect',
      'noOverlap',
      'closeOnActivate'
    ]);
    this.componentName = 'anypoint-menu-button';
    this.closeOnActivate = false;
    this.noOverlap = false;
    this.ignoreSelect = false;
    this.disabled = false;
  }

  _demoTemplate() {
    const {
      demoStates,
      anypoint,
      darkThemeActive,
      disabled,
      ignoreSelect,
      noOverlap,
      closeOnActivate,
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
          <anypoint-menu-button
            slot="content"
            ?anypoint="${anypoint}"
            ?disabled="${disabled}"
            ?ignoreSelect="${ignoreSelect}"
            ?noOverlap="${noOverlap}"
            ?closeOnActivate="${closeOnActivate}"
          >
            <anypoint-icon-button
              slot="dropdown-trigger"
              aria-label="activate for context menu"
              ?anypoint="${anypoint}">
              <arc-icon icon="menu"></arc-icon>
            </anypoint-icon-button>
            <anypoint-listbox
              slot="dropdown-content"
              ?anypoint="${anypoint}">
              <anypoint-item>alpha</anypoint-item>
              <anypoint-item>beta</anypoint-item>
              <anypoint-item>gamma</anypoint-item>
              <anypoint-item>delta</anypoint-item>
              <anypoint-item>epsilon</anypoint-item>
            </anypoint-listbox>
          </anypoint-menu-button>

          <label slot="options" id="mainOptionsLabel">Options</label>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="demoIgnoreSelect"
            @change="${this._toggleMainOption}">Ignore select</anypoint-checkbox>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="demoDisabled"
            @change="${this._toggleMainOption}">Disabled</anypoint-checkbox>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="noOverlap"
            @change="${this._toggleMainOption}">No overlap</anypoint-checkbox>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="closeOnActivate"
            @change="${this._toggleMainOption}">Close on activate</anypoint-checkbox>

        </interactive-demo>
      </section>
    `;
  }

  _introductionTemplate() {
    return html`
      <section class="documentation-section">
        <h3>Introduction</h3>
        <p>
          This component is based on Material Design chip and adjusted for
          Anypoint platform components.
        </p>
        <p>
          Anypoint web components are set of components that allows to build
          Anypoint enabled UI in open source projects.
        </p>
        <p>
          Menu button renders a trigger icon button which, once activated, renders
          a dropdown menu. The button is to be used as a context action list.
        </p>
      </section>
    `;
  }

  _usageTemplate() {
    return html`
      <section class="documentation-section">
        <h2>Usage</h2>
        <p>Anypoint menu button comes with 2 predefined styles:</p>
        <ul>
          <li><b>Material Design</b> - Normal state</li>
          <li>
            <b>Anypoint</b> - To enable Anypoint theme
          </li>
        </ul>

        <h3>Basic usage</h3>

        <p>
          The element accepts another element as a trigger button via "dropdown-trigger" slot.
          When the user click on the trigger the menu will pop up.
          The trigger can be any element but suggested ones are button, anypoint-button, or anypoint-icon-button.
        </p>

        <p>
          Dropdown content can be any HTML element. It is handled via "dropdown-content" slot.
          Menu button should be used with list items so suggested dropdown content is
          anypoint-listbox with anypoint-item.
        </p>

        <details>
          <summary>Code example</summary>
          <code>
            <pre>
            ${`<anypoint-menu-button>
              <anypoint-icon-button
                slot="dropdown-trigger"
                aria-label="activate for context menu">
                <arc-icon icon="menu" alt="menu"></arc-icon>
              </anypoint-icon-button>
              <anypoint-listbox
                slot="dropdown-content">
                <anypoint-item>alpha</anypoint-item>
                <anypoint-item>beta</anypoint-item>
                <anypoint-item>gamma</anypoint-item>
                <anypoint-item>delta</anypoint-item>
                <anypoint-item>epsilon</anypoint-item>
              </anypoint-listbox>
            </anypoint-menu-button>`}
            </pre>
          </code>
        </details>
      </section>
    `;
  }

  contentTemplate() {
    return html`
      <h2>Anypoint menu button</h2>
      ${this._demoTemplate()}
      ${this._introductionTemplate()}
      ${this._usageTemplate()}
    `;
  }
}

const instance = new ComponentDemoPage();
instance.render();
