import { html } from 'lit-html';
import { DemoPage } from './lib/DemoPage.js';
import './lib/interactive-demo.js';
import '../anypoint-checkbox.js';
import '../colors.js';
import '../anypoint-item.js';
import '../anypoint-listbox.js';
import '../anypoint-input-combobox.js';

class ComponentDemoPage extends DemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'disabled',
      'noOverlap',
      'noAnimations',
      'fitPositionTarget',
      'noLabelFloat',
      'currentValue',
    ]);
    this.componentName = 'anypoint-combobox';
    this.disabled = false;
    this.noOverlap = false;
    this.noAnimations = false;
    this.fitPositionTarget = false;
    this.noLabelFloat = false;
    this.currentValue = '';

    this.items = [
      'Allosaurus',
      'Brontosaurus',
      'Carcharodontosaurus',
      'Diplodocus',
      'Ekrixinatosaurus',
      'Fukuiraptor',
      'Gallimimus',
      'Hadrosaurus',
      'Iguanodon',
      'Jainosaurus',
      'Kritosaurus',
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

  _inputHandler(e) {
    console.log(e.target.value);
    this.currentValue = e.target.value;
  }

  _changeHandler(e) {
    console.log(e.target.value);
    this.currentValue = e.target.value;
  }

  _demoTemplate() {
    const {
      demoStates,
      outlined,
      anypoint,
      darkThemeActive,
      disabled,
      noOverlap,
      noAnimations,
      fitPositionTarget,
      noLabelFloat,
      currentValue,
    } = this;
    return html`
      <section class="documentation-section">
        <h3>Interactive demo</h3>
        <p>
          This demo lets you preview the combo box element with various
          configuration options.
        </p>
        <interactive-demo
          .states="${demoStates}"
          @state-changed="${this._demoStateHandler}"
          ?dark="${darkThemeActive}"
        >
          <anypoint-input-combobox
            slot="content"
            ?anypoint="${anypoint}"
            ?outlined="${outlined}"
            ?disabled="${disabled}"
            ?noOverlap="${noOverlap}"
            ?noAnimations="${noAnimations}"
            ?fitPositionTarget="${fitPositionTarget}"
            ?noLabelFloat="${noLabelFloat}"
            @input="${this._inputHandler}"
            @change="${this._changeHandler}"
          >
            <label slot="label">Fruit name</label>
            <anypoint-listbox slot="dropdown-content" tabindex="-1" ?anypoint="${anypoint}">
            ${this.items.map((item) => html`<anypoint-item>${item}</anypoint-item>`)}
            </anypoint-listbox>
          </anypoint-input-combobox>

          <label slot="options" id="mainOptionsLabel">Options</label>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="disabled"
            @change="${this._toggleMainOption}"
          >Disabled</anypoint-checkbox>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="noOverlap"
            @change="${this._toggleMainOption}"
          >No overlap</anypoint-checkbox>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="noAnimations"
            @change="${this._toggleMainOption}"
          >No animations</anypoint-checkbox>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="fitPositionTarget"
            @change="${this._toggleMainOption}"
          >Fit content</anypoint-checkbox>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="noLabelFloat"
            @change="${this._toggleMainOption}"
          >No float label</anypoint-checkbox>
          
        </interactive-demo>

        <output>Current value: ${currentValue}</output>
      </section>
    `;
  }

  contentTemplate() {
    return html`
      <h2>Anypoint combo box</h2>
      ${this._demoTemplate()}
    `;
  }
}

const instance = new ComponentDemoPage();
instance.render();
