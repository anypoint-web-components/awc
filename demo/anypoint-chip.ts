import { html, TemplateResult } from 'lit';
import { demoProperty } from './lib/decorators.js';
import { clearAll } from './lib/Icons.js';
import { DemoPage } from './lib/DemoPage.js';
import './lib/demo-icon.js';
import './lib/interactive-demo.js';
import '../src/define/anypoint-checkbox.js';
import '../src/define/anypoint-chip.js';

interface ChipInfo {
  label: string;
  selected: boolean;
}

class ComponentDemoPage extends DemoPage {
  @demoProperty() demoRemovable = false;

  @demoProperty() demoDisabled = false;

  @demoProperty() demoLeadingIcon = false;

  @demoProperty() toggles = false;

  amenities: ChipInfo[] = [
    { label: 'Elevator', selected: false, },
    { label: 'Washer / Dryer', selected: false, },
    { label: 'Fireplace', selected: false, },
    { label: 'Wheelchair access', selected: false, },
    { label: 'Dogs ok', selected: false, },
    { label: 'Cats ok', selected: false, }
  ];

  constructor() {
    super();
    this.componentName = 'anypoint-chip';
  }

  get types(): string[] {
    return [
      'Extra soft',
      'Soft',
      'Medium',
      'Hard',
      'Extra hard'
    ];
  }

  _toggleAmenitiesFilter(e: any): void {
    const index = Number(e.target.dataset.index);
    if (Number.isNaN(index)) {
      return;
    }
    const item = { ...this.amenities[index] };
    item.selected = !item.selected;
    this.amenities[index] = item;
    this.render();
  }

  _toggleTypesChoice(e: any): void {
    const selectedClass = 'selected';
    const selected = document.querySelector(`.types .${selectedClass}`);
    if (selected) {
      selected.classList.remove(selectedClass);
    }
    e.currentTarget.classList.add(selectedClass);
  }

  _handleAction(e: any): void {
    const { action } = e.currentTarget.dataset;
    if (!action) {
      return;
    }
    console.log('Handling action:', action);
  }

  get partsTestMessage(): TemplateResult {
    const p = document.createElement('span');
    // @ts-ignore
    const hasParts = p.part !== undefined;
    return hasParts ? html`<p>Your browser support CSS Shadow Parts</p>`
      : html`<p>Your browser do not support CSS Shadow Parts</p>`;
  }

  _demoTemplate(): TemplateResult {
    const {
      demoStates,
      anypoint,
      darkThemeActive,
      demoLeadingIcon,
      demoRemovable,
      demoDisabled,
      toggles,
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
          <anypoint-chip
            slot="content"
            ?anypoint="${anypoint}"
            ?removable="${demoRemovable}"
            ?disabled="${demoDisabled}"
            ?toggles="${toggles}"
          >
            ${demoLeadingIcon ? html`<demo-icon icon="message" slot="icon"></demo-icon>` : ''}
            Biking
          </anypoint-chip>

          <label slot="options" id="mainOptionsLabel">Options</label>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="demoLeadingIcon"
            @change="${this._toggleMainOption}">Leading icon</anypoint-checkbox>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="demoRemovable"
            @change="${this._toggleMainOption}">Removable</anypoint-checkbox>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="demoDisabled"
            @change="${this._toggleMainOption}">Disabled</anypoint-checkbox>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="toggles"
            @change="${this._toggleMainOption}">Toggles</anypoint-checkbox>

        </interactive-demo>
      </section>
    `;
  }

  _introductionTemplate(): TemplateResult {
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
          Chips are compact elements that represent an input, attribute, or action.
        </p>
      </section>
    `;
  }

  _usageTemplate(): TemplateResult {
    return html`
      <section class="documentation-section">
        <h2>Usage</h2>
        <p>Anypoint chip comes with 2 predefined styles:</p>
        <ul>
          <li><b>Material</b> - Normal state</li>
          <li>
            <b>Anypoint</b> - To enable Anypoint theme
          </li>
        </ul>

        <p>
          See
          <a href="https://material.io/components/chips/"
            >chips</a
          >
          documentation in Material Design documentation for principles and
          anatomy of a chip.
        </p>

        <h3>Input chips</h3>
        <p>
          Chips can be used in input elements representing a tag or category.
        </p>
        <div>
          <anypoint-chip removable="">
            <demo-icon icon="rateReview" slot="icon"></demo-icon>
            Portland
          </anypoint-chip>

          <anypoint-chip removable="">
            <demo-icon icon="refresh" slot="icon"></demo-icon>
            Biking
          </anypoint-chip>
        </div>

        <h3>Choice chips</h3>
        <p>
          Chips can represent one of selected options.
        </p>
        <div>
          <h4>Select type</h4>
          <div class="wrap-horizontal types">
          ${this.types.map((item) => html`<anypoint-chip @click="${this._toggleTypesChoice}">
            ${item}
          </anypoint-chip>`)}
          </div>
        </div>

        <h3>Filter chips</h3>
        <p>
          Chips represents an attribute.
        </p>
        <h4>Choose amenities</h4>
        <div class="wrap-horizontal">
          ${this.amenities.map((item, index) => html`<anypoint-chip
            @click="${this._toggleAmenitiesFilter}"
            toggles
            data-index="${index}">
            ${item.selected ? html`<demo-icon icon="search" slot="icon"></demo-icon>` : ''}
            ${item.label}
          </anypoint-chip>`)}
        </div>

        <h3>Action chips</h3>
        <p>
          Chips represents an action that can be taken in the UI.
        </p>
        <div class="wrap-horizontal actions">
          <anypoint-chip @click="${this._handleAction}" data-action="brightness">
            <demo-icon icon="search" slot="icon"></demo-icon>
            <span>Turn on lights</span>
          </anypoint-chip>

          <anypoint-chip @click="${this._handleAction}" data-action="alarm">
            <demo-icon icon="addCircleOutline" slot="icon"></demo-icon>
            <span>Set alarm</span>
          </anypoint-chip>

          <anypoint-chip @click="${this._handleAction}" data-action="clear">
            <demo-icon icon="clearAll" slot="icon"></demo-icon>
            <span>Clear all</span>
          </anypoint-chip>
        </div>

        <h3>Themed chips</h3>
        <p>
          The chips can be styled via CSS variables.
        </p>
        <section class="demo">
          <div class="wrap-horizontal actions">
            <div class="themed">
              <anypoint-chip>
                <demo-icon icon="desktopWindows" slot="icon"></demo-icon>
                Styled text child
              </anypoint-chip>

              <anypoint-chip>
                <demo-icon icon="edit" slot="icon"></demo-icon>
                <span>Styled element child</span>
              </anypoint-chip>
            </div>
          </div>
        </section>

        <h3>Themed chips with CSS parts</h3>
        <p>
          The chips can be styled via CSS parts.
        </p>
        ${this.partsTestMessage}
        <div class="wrap-horizontal actions">
          <div class="themed-parts">
            <anypoint-chip removable>
              <demo-icon icon="expandMore" slot="icon"></demo-icon>
              Styled with CSS parts
            </anypoint-chip>

            <anypoint-chip>
              <demo-icon icon="expandLess" slot="icon"></demo-icon>
              <span>Also styled with parts</span>
            </anypoint-chip>
          </div>
        </div>

        <h3>Custom "close" icon</h3>
        <p>
          The close icon can be replaced by other icon by setting
          <code>removeIcon</code> property. The value must be a <code>SVGTemplateResult</code>
          from <code>lit-html</code> library.
        </p>
        <div class="wrap-horizontal actions">
          <anypoint-chip .removeIcon="${clearAll}" removable>
            Custom icon
          </anypoint-chip>
        </div>
      </section>
    `;
  }

  contentTemplate(): TemplateResult {
    return html`
      <h2>Anypoint chip (pill)</h2>
      ${this._demoTemplate()}
      ${this._introductionTemplate()}
      ${this._usageTemplate()}
    `;
  }
}

const instance = new ComponentDemoPage();
instance.render();
