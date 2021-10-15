import { html } from 'lit-html';
import { DemoPage } from './lib/DemoPage.js';
import './lib/interactive-demo.js';
import '../anypoint-icon-button.js';
import '../anypoint-item.js';
import '../anypoint-icon-item.js';
import '../anypoint-item-body.js';

class ComponentDemo extends DemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'demoCompatibility',
      'twoLineCompatibility',
      'iconCompatibility',
      'demoWithIcon',
      'demoTwoLines',
      'complexCompatibility',
      'linksCompatibility'
    ]);
    this._componentName = 'anypoint-dropdown-menu';
    this.demoStates = ['Material Design', 'Anypoint'];
    this._mainDemoStateHandler = this._mainDemoStateHandler.bind(this);
    this._twoLineDemoStateHandler = this._twoLineDemoStateHandler.bind(this);
    this._iconDemoStateHandler = this._iconDemoStateHandler.bind(this);
    this._toggleDemoOption = this._toggleDemoOption.bind(this);
    this._complexStateHandler = this._complexStateHandler.bind(this);
    this._linksStateHandler = this._linksStateHandler.bind(this);
  }

  _mainDemoStateHandler(e) {
    const state = e.detail.value;
    switch (state) {
      case 0:
        this.demoCompatibility = false;
        break;
      case 1:
        this.demoCompatibility = true;
        break;
    }
  }

  _twoLineDemoStateHandler(e) {
    const state = e.detail.value;
    switch (state) {
      case 0:
        this.twoLineCompatibility = false;
        break;
      case 1:
        this.twoLineCompatibility = true;
        break;
    }
  }

  _iconDemoStateHandler(e) {
    const state = e.detail.value;
    switch (state) {
      case 0:
        this.iconCompatibility = false;
        break;
      case 1:
        this.iconCompatibility = true;
        break;
    }
  }

  _complexStateHandler(e) {
    const state = e.detail.value;
    switch (state) {
      case 0:
        this.complexCompatibility = false;
        break;
      case 1:
        this.complexCompatibility = true;
        break;
    }
  }

  _linksStateHandler(e) {
    const state = e.detail.value;
    switch (state) {
      case 0:
        this.linksCompatibility = false;
        break;
      case 1:
        this.linksCompatibility = true;
        break;
    }
  }

  _toggleDemoOption(e) {
    const { name, checked } = e.target;
    this[name] = checked;
  }

  _demoTemplate() {
    const {
      demoStates,
      darkThemeActive,
      demoCompatibility
    } = this;
    return html`<section class="documentation-section">
    <h3>Interactive demo</h3>
    <p>
      This demo lets you preview the dropdown menu element with various
      configuration options.
    </p>
    <interactive-demo
      .states="${demoStates}"
      @state-changed="${this._mainDemoStateHandler}"
      ?dark="${darkThemeActive}"
    >
      <div
        role="listbox"
        slot="content">
        <anypoint-item ?compatibility="${demoCompatibility}">
          Option 1
        </anypoint-item>
        <anypoint-item ?compatibility="${demoCompatibility}">
          Option 2
        </anypoint-item>
        <anypoint-item ?compatibility="${demoCompatibility}">
          Option 3
        </anypoint-item>
        <anypoint-item ?compatibility="${demoCompatibility}">
          <p>Paragraph as a child</p>
        </anypoint-item>
      </div>
    </interactive-demo>
    </section>`;
  }

  _introductionTemplate() {
    return html`
      <section class="documentation-section">
        <h3>Introduction</h3>
        <p>
          This component is based on Material Design list item and adjusted for
          Anypoint platform components.
        </p>
        <p>
          Anypoint web components are set of components that allows to build
          Anypoint enabled UI in open source projects.
        </p>
        <p>
          A list item to be used in menus and list views.
        </p>
      </section>
    `;
  }

  _twoLineDemoTemplate() {
    const {
      demoStates,
      darkThemeActive,
      twoLineCompatibility
    } = this;
    return html`<section class="documentation-section">
    <h3>Two line list item</h3>
    <p>
      Two line item allows you to create a list with main and secondary
      information.
    </p>

    <p>
      The secondary label should have <code>secondary</code> attribute
    </p>
    <interactive-demo
      .states="${demoStates}"
      @state-changed="${this._twoLineDemoStateHandler}"
      ?dark="${darkThemeActive}"
    >
      <div
        role="listbox"
        slot="content">
        <anypoint-item ?compatibility="${twoLineCompatibility}">
          <anypoint-item-body twoline ?compatibility="${twoLineCompatibility}">
            <div>Pawel Psztyc</div>
            <div data-secondary>Sr. Software Engineer</div>
          </anypoint-item-body>
        </anypoint-item>

        <anypoint-item ?compatibility="${twoLineCompatibility}">
          <anypoint-item-body twoline ?compatibility="${twoLineCompatibility}">
            <div>John Smith</div>
            <div data-secondary>QA specialist</div>
          </anypoint-item-body>
        </anypoint-item>

        <anypoint-item ?compatibility="${twoLineCompatibility}">
          <anypoint-item-body twoline ?compatibility="${twoLineCompatibility}">
            <div>John Q. Public</div>
            <div data-secondary>Interaction designer</div>
          </anypoint-item-body>
        </anypoint-item>
      </div>
    </interactive-demo>
    </section>`;
  }

  _iconDemoTemplate() {
    const {
      demoStates,
      darkThemeActive,
      iconCompatibility
    } = this;
    return html`<section class="documentation-section">
    <h3>Icon item</h3>
    <p>
      You can add a leading icon to the element.
    </p>
    <interactive-demo
      .states="${demoStates}"
      @state-changed="${this._iconDemoStateHandler}"
      ?dark="${darkThemeActive}"
    >
      <div
        role="listbox"
        slot="content">
        <anypoint-icon-item ?compatibility="${iconCompatibility}">
          <iron-icon icon="anypoint:add" slot="item-icon"></iron-icon> Add
        </anypoint-icon-item>
        <anypoint-icon-item ?compatibility="${iconCompatibility}">
          <iron-icon icon="anypoint:refresh" slot="item-icon"></iron-icon> Refresh
        </anypoint-icon-item>
        <anypoint-icon-item ?compatibility="${iconCompatibility}">
          <span slot="item-icon" class="circle"></span> Refresh
        </anypoint-icon-item>
      </div>
    </interactive-demo>
    </section>`;
  }

  _complexDemoTemplate() {
    const {
      demoStates,
      darkThemeActive,
      complexCompatibility
    } = this;
    return html`<section class="documentation-section">
    <h3>Complex layouts</h3>
    <p>
      Complex layouts are usually a combination of all these elements.
    </p>

    <interactive-demo
      .states="${demoStates}"
      @state-changed="${this._complexStateHandler}"
      ?dark="${darkThemeActive}"
    >
      <div
        role="listbox"
        slot="content">
        <anypoint-icon-item ?compatibility="${complexCompatibility}">
          <div class="avatar blue" slot="item-icon"></div>
          <anypoint-item-body twoline ?compatibility="${complexCompatibility}">
            <div>Photos</div>
            <div data-secondary>Jan 9, 2014</div>
          </anypoint-item-body>
          <anypoint-icon-button
            ?compatibility="${complexCompatibility}"
            aria-label="Activate to toggle favourite">
            <iron-icon icon="star" alt="favourite this!"></iron-icon>
          </anypoint-icon-button>
        </anypoint-icon-item>

        <anypoint-icon-item ?compatibility="${complexCompatibility}">
          <div class="avatar" slot="item-icon"></div>
          <anypoint-item-body twoline ?compatibility="${complexCompatibility}">
            <div>Recipes</div>
            <div data-secondary>Jan 17, 2014</div>
          </anypoint-item-body>
          <anypoint-icon-button
            ?compatibility="${complexCompatibility}"
            aria-label="Activate to toggle favourite">
            <iron-icon icon="star" alt="favourite this!"></iron-icon>
          </anypoint-icon-button>
        </anypoint-icon-item>
      </div>
    </interactive-demo>
    </section>`;
  }

  _linksTemplate() {
    const {
      demoStates,
      darkThemeActive,
      linksCompatibility
    } = this;
    return html`<section class="documentation-section">
    <h3>Item as a link</h3>
    <p>
      <code>anypoint-items</code> can be used as links. Wrap the item in the <code>a</code> element.
    </p>

    <interactive-demo
      .states="${demoStates}"
      @state-changed="${this._linksStateHandler}"
      ?dark="${darkThemeActive}"
    >
      <div
        role="listbox"
        slot="content">
        <a class="anypoint-item-link" href="#inbox" tabindex="-1">
          <anypoint-item ?compatibility="${linksCompatibility}">Inbox</anypoint-item>
        </a>
        <a class="anypoint-item-link" href="#starred" tabindex="-1">
          <anypoint-item ?compatibility="${linksCompatibility}">Starred</anypoint-item>
        </a>
        <a class="anypoint-item-link" href="#sent" tabindex="-1">
          <anypoint-item ?compatibility="${linksCompatibility}">Sent mail</anypoint-item>
        </a>
      </div>
    </interactive-demo>
    </section>`;
  }

  contentTemplate() {
    return html`
    <h2>Anypoint item</h2>
    ${this._demoTemplate()}
    ${this._introductionTemplate()}
    ${this._twoLineDemoTemplate()}
    ${this._iconDemoTemplate()}
    ${this._complexDemoTemplate()}
    ${this._linksTemplate()}`;
  }
}

const instance = new ComponentDemo();
instance.render();
