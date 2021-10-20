import { html } from 'lit-html';
import { DemoPage } from './lib/DemoPage.js';
import './lib/interactive-demo.js';
import '../color-selector.js';
import '../color-input-selector.js';

class ComponentPage extends DemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'value',
    ]);
    this.componentName = 'Color selector';
    this.value = '#ff0000';
  }

  _valueHandler(e) {
    this.value = e.target.value;
    console.log(e.target.value, e.target.enabled);
  }


  _demoTemplate() {
    const {
      demoStates,
      darkThemeActive,
      value
    } = this;
    return html`
      <section class="documentation-section">
        <h3>Interactive demo</h3>
        <p>
          This demo lets you preview the color selector element with various
          configuration options.
        </p>

        <interactive-demo
          .states="${demoStates}"
          @state-changed="${this._demoStateHandler}"
          ?dark="${darkThemeActive}"
        >
          <color-selector
            .value="${value}"
            @change="${this._valueHandler}"
            slot="content"
          ></color-selector>
        </interactive-demo>
      </section>

      <section class="documentation-section">
        <h3>Input color selector</h3>
        <interactive-demo
          .states="${demoStates}"
          @state-changed="${this._demoStateHandler}"
          ?dark="${darkThemeActive}"
        >
          <color-input-selector
            .value="${value}"
            @change="${this._valueHandler}"
            slot="content"
          >
            Select a color
          </color-input-selector>
        </interactive-demo>
      </section>
    `;
  }

  contentTemplate() {
    return html`
      <h2>Color selector</h2>
      ${this._demoTemplate()}
    `;
  }
}

const instance = new ComponentPage();
instance.render();
