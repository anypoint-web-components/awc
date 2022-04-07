import { html, TemplateResult } from 'lit';
import { DemoPage } from './lib/DemoPage.js';
import { demoProperty } from './lib/decorators.js';
import './lib/interactive-demo.js';
import '../src/define/anypoint-checkbox.js';
import '../src/define/anypoint-switch.js';
import '../src/colors.js';

class ComponentPage extends DemoPage {
  @demoProperty()
  demoDisabled = false;

  @demoProperty()
  disabledSwitch = false;

  constructor() {
    super();
    this.componentName = 'anypoint-switch';
  }

  _toggleDisabled(): void {
    this.disabledSwitch = !this.disabledSwitch;
  }

  _demoTemplate(): TemplateResult {
    const {
      demoStates,
      anypoint,
      darkThemeActive,
      demoDisabled,
    } = this;
    return html`
      <section class="documentation-section">
        <h3>Interactive demo</h3>
        <p>
          This demo lets you preview the switch button element with various
          configuration options.
        </p>
        <interactive-demo
          .states="${demoStates}"
          @state-changed="${this._demoStateHandler}"
          ?dark="${darkThemeActive}"
        >
          <anypoint-switch
            slot="content"
            ?anypoint="${anypoint}"
            ?disabled="${demoDisabled}"
          >
            off/on
          </anypoint-switch>

          <label slot="options" id="mainOptionsLabel">Options</label>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="demoDisabled"
            @change="${this._toggleMainOption}">Disabled</anypoint-checkbox>

        </interactive-demo>
      </section>
    `;
  }

  _introductionTemplate(): TemplateResult {
    return html`
      <section class="documentation-section">
        <h3>Introduction</h3>
        <p>
          This component is based on Material Design switch and adjusted for
          Anypoint platform components.
        </p>
        <p>
          Anypoint web components are set of components that allows to build
          Anypoint enabled UI in open source projects.
        </p>
        <p>
          Switches toggle the state of a single setting on or off.
          They are the preferred way to adjust settings on mobile.
        </p>
      </section>
    `;
  }

  _usageTemplate(): TemplateResult {
    const {
      disabledSwitch
    } = this;
    return html`
      <section class="documentation-section">
        <h2>Usage</h2>
        <p>Anypoint chip comes with 2 pre-defied styles:</p>
        <ul>
          <li><b>Material Design</b> - Normal state</li>
          <li>
            <b>Anypoint</b> - To enable Anypoint theme
          </li>
        </ul>

        <p>
          See
          <a href="https://material.io/components/selection-controls/#switches"
            >switches</a
          >
          documentation in Material Design documentation for principles and
          anatomy of a switch button.
        </p>

        <h3>Disable in HTML template</h3>
        <anypoint-switch ?disabled="${disabledSwitch}">off/on</anypoint-switch>
        <button @click="${this._toggleDisabled}">Toggle disabled</button>
      </section>
    `;
  }

  contentTemplate(): TemplateResult {
    return html`
      <h2>Anypoint switch (toggle button)</h2>
      ${this._demoTemplate()}
      ${this._introductionTemplate()}
      ${this._usageTemplate()}
    `;
  }
}

const instance = new ComponentPage();
instance.render();
