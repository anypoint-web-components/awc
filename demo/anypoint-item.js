import { html } from 'lit-html';
import { DemoPage } from './lib/DemoPage.js';
import '@advanced-rest-client/arc-icons/arc-icon.js'
import './lib/interactive-demo.js';
import '../anypoint-icon-button.js';
import '../anypoint-item.js';
import '../anypoint-icon-item.js';
import '../anypoint-item-body.js';

class ComponentDemo extends DemoPage {
  constructor() {
    super();
    this.componentName = 'anypoint-dropdown-menu';
  }


  _demoTemplate() {
    const {
      demoStates,
      darkThemeActive,
      anypoint,
    } = this;
    return html`<section class="documentation-section">
    <h3>Interactive demo</h3>
    <p>
      This demo lets you preview the dropdown menu element with various
      configuration options.
    </p>
    <interactive-demo
      .states="${demoStates}"
      @state-changed="${this._demoStateHandler}"
      ?dark="${darkThemeActive}"
    >
      <div
        role="listbox"
        slot="content">
        <anypoint-item ?anypoint="${anypoint}">
          Option 1
        </anypoint-item>
        <anypoint-item ?anypoint="${anypoint}">
          Option 2
        </anypoint-item>
        <anypoint-item ?anypoint="${anypoint}">
          Option 3
        </anypoint-item>
        <anypoint-item ?anypoint="${anypoint}">
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
      anypoint
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
      @state-changed="${this._demoStateHandler}"
      ?dark="${darkThemeActive}"
    >
      <div
        role="listbox"
        slot="content">
        <anypoint-item ?anypoint="${anypoint}">
          <anypoint-item-body twoline ?anypoint="${anypoint}">
            <div>Pawel Psztyc</div>
            <div data-secondary>Sr. Software Engineer</div>
          </anypoint-item-body>
        </anypoint-item>

        <anypoint-item ?anypoint="${anypoint}">
          <anypoint-item-body twoline ?anypoint="${anypoint}">
            <div>John Smith</div>
            <div data-secondary>QA specialist</div>
          </anypoint-item-body>
        </anypoint-item>

        <anypoint-item ?anypoint="${anypoint}">
          <anypoint-item-body twoline ?anypoint="${anypoint}">
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
      anypoint
    } = this;
    return html`<section class="documentation-section">
    <h3>Icon item</h3>
    <p>
      You can add a leading icon to the element.
    </p>
    <interactive-demo
      .states="${demoStates}"
      @state-changed="${this._demoStateHandler}"
      ?dark="${darkThemeActive}"
    >
      <div
        role="listbox"
        slot="content">
        <anypoint-icon-item ?anypoint="${anypoint}">
          <arc-icon icon="add" slot="item-icon"></arc-icon> Add
        </anypoint-icon-item>
        <anypoint-icon-item ?anypoint="${anypoint}">
          <arc-icon icon="refresh" slot="item-icon"></arc-icon> Refresh
        </anypoint-icon-item>
        <anypoint-icon-item ?anypoint="${anypoint}">
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
      anypoint
    } = this;
    return html`<section class="documentation-section">
    <h3>Complex layouts</h3>
    <p>
      Complex layouts are usually a combination of all these elements.
    </p>

    <interactive-demo
      .states="${demoStates}"
      @state-changed="${this._demoStateHandler}"
      ?dark="${darkThemeActive}"
    >
      <div
        role="listbox"
        slot="content">
        <anypoint-icon-item ?anypoint="${anypoint}">
          <div class="avatar blue" slot="item-icon"></div>
          <anypoint-item-body twoline ?anypoint="${anypoint}">
            <div>Photos</div>
            <div data-secondary>Jan 9, 2014</div>
          </anypoint-item-body>
          <anypoint-icon-button
            ?anypoint="${anypoint}"
            aria-label="Activate to toggle favourite">
            <arc-icon icon="star"></arc-icon>
          </anypoint-icon-button>
        </anypoint-icon-item>

        <anypoint-icon-item ?anypoint="${anypoint}">
          <div class="avatar" slot="item-icon"></div>
          <anypoint-item-body twoline ?anypoint="${anypoint}">
            <div>Recipes</div>
            <div data-secondary>Jan 17, 2014</div>
          </anypoint-item-body>
          <anypoint-icon-button
            ?anypoint="${anypoint}"
            aria-label="Activate to toggle favourite">
            <arc-icon icon="star"></arc-icon>
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
      anypoint
    } = this;
    return html`<section class="documentation-section">
    <h3>Item as a link</h3>
    <p>
      <code>anypoint-items</code> can be used as links. Wrap the item in the <code>a</code> element.
    </p>

    <interactive-demo
      .states="${demoStates}"
      @state-changed="${this._demoStateHandler}"
      ?dark="${darkThemeActive}"
    >
      <div
        role="listbox"
        slot="content">
        <a class="anypoint-item-link" href="#inbox" tabindex="-1">
          <anypoint-item ?anypoint="${anypoint}">Inbox</anypoint-item>
        </a>
        <a class="anypoint-item-link" href="#starred" tabindex="-1">
          <anypoint-item ?anypoint="${anypoint}">Starred</anypoint-item>
        </a>
        <a class="anypoint-item-link" href="#sent" tabindex="-1">
          <anypoint-item ?anypoint="${anypoint}">Sent mail</anypoint-item>
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
