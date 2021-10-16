import { html } from 'lit-html';
import { clearAll } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import '@advanced-rest-client/arc-icons/arc-icon.js';
import { DemoPage } from './lib/DemoPage.js';
import './lib/interactive-demo.js';
import '../anypoint-checkbox.js';
import '../anypoint-chip.js';

class ComponentDemoPage extends DemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'demoRemovable',
      'demoDisabled',
      'demoLeadingIcon'
    ]);
    this.componentName = 'anypoint-chip';

    this.darkThemeActive = false;
    this.demoLeadingIcon = false;
    this.demoDisabled = false;
    this.demoRemovable = false;

    this.amenities = [
      { label: 'Elevator', selected: false, },
      { label: 'Washer / Dryer', selected: false, },
      { label: 'Fireplace', selected: false, },
      { label: 'Wheelchair access', selected: false, },
      { label: 'Dogs ok', selected: false, },
      { label: 'Cats ok', selected: false, }
    ];
  }

  get types() {
    return [
      'Extra soft',
      'Soft',
      'Medium',
      'Hard',
      'Extra hard'
    ];
  }

  _toggleAmenitiesFilter(e) {
    const index = Number(e.target.dataset.index);
    if (Number.isNaN(index)) {
      return;
    }
    const item = { ...this.amenities[index] };
    item.selected = !item.selected;
    this.amenities[index] = item;
    this.render();
  }

  _toggleTypesChoice(e) {
    const selectedClass = 'selected';
    const selected = document.querySelector(`.types .${selectedClass}`);
    if (selected) {
      selected.classList.remove(selectedClass);
    }
    e.currentTarget.classList.add(selectedClass);
  }

  _handleAction(e) {
    const { action } = e.currentTarget.dataset;
    if (!action) {
      return;
    }
    const toast = document.getElementById(`${action}Action`);
    // @ts-ignore
    toast.opened = true;
  }

  get partsTestMessage() {
    const p = document.createElement('span');
    // @ts-ignore
    const hasParts = p.part !== undefined;
    return hasParts ? html`<p>Your browser support CSS Shadow Parts</p>` :
      html`<p>Your browser do not support CSS Shadow Parts</p>`;
  }

  _demoTemplate() {
    const {
      demoStates,
      anypoint,
      darkThemeActive,
      demoLeadingIcon,
      demoRemovable,
      demoDisabled
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
            ?compatibility="${anypoint}"
            ?removable="${demoRemovable}"
            ?disabled="${demoDisabled}"
          >
            ${demoLeadingIcon ? html`<arc-icon icon="message" slot="icon"></arc-icon>`: ''}
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
          Chips are compact elements that represent an input, attribute, or action.
        </p>
      </section>
    `;
  }

  _usageTemplate() {
    return html`
      <section class="documentation-section">
        <h2>Usage</h2>
        <p>Anypoint chip comes with 2 predefined styles:</p>
        <ul>
          <li><b>Material</b> - Normal state</li>
          <li>
            <b>Compatibility</b> - To provide compatibility with Anypoint design
          </li>
        </ul>

        <p>
          See
          <a href="https://material.io/components/chips/"
            >chips</a
          >
          documentation in Material Defign documentation for principles and
          anatomy of a chip.
        </p>

        <h3>Input chips</h3>
        <p>
          Chips can be used in input elements representing a tag or category.
        </p>
        <div>
          <anypoint-chip removable="">
            <arc-icon icon="rateReview" slot="icon"></arc-icon>
            Portland
          </anypoint-chip>

          <anypoint-chip removable="">
            <arc-icon icon="refresh" slot="icon"></arc-icon>
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
            ${item.selected ? html`<arc-icon icon="search" slot="icon"></arc-icon>` : ''}
            ${item.label}
          </anypoint-chip>`)}
        </div>

        <h3>Action chips</h3>
        <p>
          Chips represents an action that can be taken in the UI.
        </p>
        <div class="wrap-horizontal actions">
          <anypoint-chip @click="${this._handleAction}" data-action="brightness">
            <arc-icon icon="search" slot="icon"></arc-icon>
            <span>Turn on lights</span>
          </anypoint-chip>

          <anypoint-chip @click="${this._handleAction}" data-action="alarm">
            <arc-icon icon="addCircleOutline" slot="icon"></arc-icon>
            <span>Set alarm</span>
          </anypoint-chip>

          <anypoint-chip @click="${this._handleAction}" data-action="clear">
            <arc-icon icon="clearAll" slot="icon"></arc-icon>
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
                <arc-icon icon="desktopWindows" slot="icon"></arc-icon>
                Styled text child
              </anypoint-chip>

              <anypoint-chip>
                <arc-icon icon="edit" slot="icon"></arc-icon>
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
              <arc-icon icon="expandMore" slot="icon"></arc-icon>
              Styled with CSS parts
            </anypoint-chip>

            <anypoint-chip>
              <arc-icon icon="expandLess" slot="icon"></arc-icon>
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

  contentTemplate() {
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