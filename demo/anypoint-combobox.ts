import { html, TemplateResult } from 'lit';
import { DemoPage } from './lib/DemoPage.js';
import { demoProperty } from './lib/decorators.js';
import './lib/interactive-demo.js';
import '../src/define/anypoint-checkbox.js';
import '../src/define/anypoint-combobox.js';
import '../src/colors.js';

const suggestions = ['Apple', 'Apricot', 'Avocado',
  'Banana', 'Bilberry', 'Blackberry', 'Blackcurrant', 'Blueberry',
  'Boysenberry', 'Cantaloupe', 'Currant', 'Cherry', 'Cherimoya',
  'Cloudberry', 'Coconut', 'Cranberry', 'Damson', 'Date', 'Dragonfruit',
  'Durian', 'Elderberry', 'Feijoa', 'Fig', 'Goji berry', 'Gooseberry',
  'Grape', 'Grapefruit', 'Guava', 'Huckleberry', 'Jabuticaba', 'Jackfruit',
  'Jambul', 'Jujube', 'Juniper berry', 'Kiwi fruit', 'Kumquat', 'Lemon',
  'Lime', 'Loquat', 'Lychee', 'Mango', 'Marion berry', 'Melon', 'Miracle fruit',
  'Mulberry', 'Nectarine', 'Olive', 'Orange'
];

class ComponentDemoPage extends DemoPage {
  @demoProperty()
  disabled = false;

  constructor() {
    super();
    this.componentName = 'anypoint-combobox';
  }

  _demoTemplate(): TemplateResult {
    const {
      demoStates,
      outlined,
      anypoint,
      darkThemeActive,
      disabled,
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
          <anypoint-combobox
            slot="content"
            ?anypoint="${anypoint}"
            ?outlined="${outlined}"
            ?disabled="${disabled}"
            .source="${suggestions}"
          >
            <label slot="label">Fruit name</label>
          </anypoint-combobox>

          <label slot="options" id="mainOptionsLabel">Options</label>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="disabled"
            @change="${this._toggleMainOption}"
          >Disabled</anypoint-checkbox>
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
      </section>
    `;
  }

  contentTemplate(): TemplateResult {
    return html`
      <h2>Anypoint combo box</h2>
      ${this._demoTemplate()}
      ${this._introductionTemplate()}
    `;
  }
}

const instance = new ComponentDemoPage();
instance.render();
