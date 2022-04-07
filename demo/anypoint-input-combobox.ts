import { html, TemplateResult } from 'lit';
import { demoProperty } from './lib/decorators.js';
import { DemoPage } from './lib/DemoPage.js';
import './lib/interactive-demo.js';
import '../src/colors.js';
import '../src/define/anypoint-checkbox.js';
import '../src/define/anypoint-item.js';
import '../src/define/anypoint-listbox.js';
import '../src/define/anypoint-input-combobox.js';

class ComponentDemoPage extends DemoPage {
  @demoProperty()
  disabled = false;

  @demoProperty()
  noAnimations = false;

  @demoProperty()
  fitPositionTarget = false;

  @demoProperty()
  noLabelFloat = false;

  @demoProperty()
  currentValue = '';

  items: string[] = [
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

  constructor() {
    super();
    this.componentName = 'anypoint-combobox';
  }

  _inputHandler(e: any): void {
    console.log(e.target.value);
    this.currentValue = e.target.value;
  }

  _changeHandler(e: any): void {
    console.log(e.target.value);
    this.currentValue = e.target.value;
  }

  _demoTemplate(): TemplateResult {
    const {
      demoStates,
      outlined,
      anypoint,
      darkThemeActive,
      disabled,
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

  contentTemplate(): TemplateResult {
    return html`
      <h2>Anypoint combo box</h2>
      ${this._demoTemplate()}
    `;
  }
}

const instance = new ComponentDemoPage();
instance.render();
