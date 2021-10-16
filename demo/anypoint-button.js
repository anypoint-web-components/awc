/* eslint-disable no-param-reassign */
/* eslint-disable default-case */
import { html } from 'lit-html';
import '@advanced-rest-client/arc-icons/arc-icon.js';
import { DemoPage } from './lib/DemoPage.js';
import '../colors.js';
import '../anypoint-checkbox.js';
import './lib/interactive-demo.js';
import '../anypoint-button.js';
import '../anypoint-icon-button.js';

class ComponentDemo extends DemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'demoButtonEmphasis',
      'demoToggles',
      'demoLeadingIcon',
      'demoNoink',
      'demoDisabled',
      'iconButtonEmphasis',
      'iconNoink',
      'iconDisabled',
      'iconToggles'
    ]);
    this._demoEmphasisHandler = this._demoEmphasisHandler.bind(this);
    this._contentControlClick = this._contentControlClick.bind(this);
    this._iconsEmphasisHandler = this._iconsEmphasisHandler.bind(this);
    this.mainTransitionHandler = this.mainTransitionHandler.bind(this);
    this.buttonTransitionHandler = this.buttonTransitionHandler.bind(this);

    this.componentName = 'anypoint-button';
    /** @type {"low" | "medium" | "high"} */
    this.demoButtonEmphasis = 'low';
    /** @type {"low" | "medium" | "high"} */
    this.iconButtonEmphasis = 'low';

    this.demoDisabled = false;
    this.iconDisabled = false;
    this.demoNoink = false;
    this.demoToggles = false;
    this.demoLeadingIcon = false;
    this.darkThemeActive = false;
    this.iconNoink = false;
    this.iconToggles = false;
  }

  _demoEmphasisHandler(e) {
    const state = e.detail.value;
    /** @type {"low" | "medium" | "high"} */
    let value;
    switch (state) {
      case 0: value = 'low'; break;
      case 1: value = 'medium'; break;
      case 2: value = 'high'; break;
    }
    this.demoButtonEmphasis = value;
  }

  _iconsEmphasisHandler(e) {
    const state = e.detail.value;
    /** @type {"low" | "medium" | "high"} */
    let value;
    switch (state) {
      case 0: value = 'low'; break;
      case 1: value = 'medium'; break;
      case 2: value = 'high'; break;
    }
    this.iconButtonEmphasis = value;
  }

  _contentControlClick(e) {
    const items = document.querySelectorAll('.content-control.group');
    Array.from(items).forEach((node) => {
      if (node === e.currentTarget) {
        return;
      }
      // @ts-ignore
      node.active = false;
    });
  }

  /**
   * @param {TransitionEvent} e 
   */
  mainTransitionHandler(e) {
    const { propertyName } = e;
    if (propertyName === undefined) {
      console.log('Ripple transition end on the main button demo');
    }
  }

  /**
   * @param {TransitionEvent} e 
   */
  buttonTransitionHandler(e) {
    const { propertyName } = e;
    if (propertyName === undefined) {
      console.log('Ripple transition end on the icon button demo');
    }
  }

  _demoTemplate() {
    const {
      demoStates,
      demoButtonEmphasis,
      anypoint,
      demoNoink,
      demoToggles,
      demoLeadingIcon,
      demoDisabled,
      darkThemeActive
    } = this;
    return html`
      <section class="documentation-section">
        <h3>Interactive demo</h3>
        <p>
          This demo lets you preview the button element with various
          configuration options.
        </p>
        <interactive-demo
          .states="${demoStates}"
          @state-changed="${this._demoEmphasisHandler}"
          ?dark="${darkThemeActive}"
        >
          <anypoint-button
            slot="content"
            emphasis="${demoButtonEmphasis}"
            title="Low emphasis button"
            ?anypoint="${anypoint}"
            ?noink="${demoNoink}"
            ?toggles="${demoToggles}"
            ?disabled="${demoDisabled}"
            @transitionend="${this.mainTransitionHandler}"
          >
            ${demoLeadingIcon ? html`<arc-icon icon="message"></arc-icon>` : undefined}
            Label
          </anypoint-button>

          <label slot="options" id="mainOptionsLabel">Options</label>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="demoLeadingIcon"
            @change="${this._toggleMainOption}"
            >Leading icon</anypoint-checkbox>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="demoToggles"
            @change="${this._toggleMainOption}"
            >Toggles</anypoint-checkbox>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="demoNoink"
            @change="${this._toggleMainOption}"
            >No ripples</anypoint-checkbox>
          <anypoint-checkbox
            aria-describedby="mainOptionsLabel"
            slot="options"
            name="demoDisabled"
            @change="${this._toggleMainOption}"
            >Disabled</anypoint-checkbox>
        </interactive-demo>
      </section>
    `;
  }

  _introductionTemplate() {
    return html`
      <section class="documentation-section">
        <h3>Introduction</h3>
        <p>
          This component is based on Material Design button and adjusted for
          Anypoint platform components.
        </p>
        <p>
          Anypoint web components are set of components that allows to build
          Anypoint enabled UI in open source projects.
        </p>
        <p>
          Button represents an action that can be performed from the UI.
          It is commonly used with <code>form</code>.
        </p>
      </section>
    `;
  }

  _usageTemplate() {
    return html`
      <section class="documentation-section">
        <h2>Usage</h2>
        <p>Anypoint button comes with 4 predefined styles:</p>
        <ul>
          <li><b>Text</b> (normal) - For low emphasis actions</li>
          <li><b>Outlined</b> - For medium emphasis actions</li>
          <li><b>Filled</b> - For primary actions</li>
          <li>
            <b>Anypoint</b> - To enable Anypoint theme
          </li>
        </ul>

        <p>
          See
          <a href="https://material.io/design/components/buttons.html"
            >Buttons</a
          >
          documentation in Material Design documentation for principles and
          anatomy of dropdown menus.
        </p>

        <h3>Types cheat list</h3>
        <p>Follow this rules to apply the right button type to situation.</p>

        <h4>Text buttons</h4>
        <p>Use text buttons for less-pronounced actions, including:</p>
        <ul>
          <li>Dialog actions</li>
          <li>Card actions</li>
        </ul>

        <h4>Outlined buttons</h4>
        <p>Use outlined buttons for more important but not primary actions</p>

        <h4>Filled buttons</h4>
        <p>
          Use filled button for the primary action.
          There should not be more than 1 primary action per screen.
          If you need more primary actions than probably you actually need outlined
          button or change in the information architecture.
        </p>

        <h4>Anypoint buttons</h4>
        <p>
          Do not use <code>anypoint</code> buttons in your UI. These are to be used with Anypoint applications.
        </p>

        <h3>Icons in buttons</h3>
        <p>
          Usually not required but placing a leading icon can clarify the action and
          focus attention on the button.
        </p>

        <div class="centered">
          <anypoint-button emphasis="low" class="icons">
            <arc-icon icon="refresh"></arc-icon>
            Send gift card
          </anypoint-button>

          <anypoint-button emphasis="medium" class="icons">
            <arc-icon icon="modeEdit"></arc-icon>
            More details
          </anypoint-button>

          <anypoint-button emphasis="high" class="icons">
            <arc-icon icon="message"></arc-icon>
            Add to cart
          </anypoint-button>
        </div>
      </section>
    `;
  }

  _iconButtonsTemplate() {
    const {
      demoStates,
      iconButtonEmphasis,
      anypoint,
      iconNoink,
      iconToggles,
      iconDisabled,
      darkThemeActive
    } = this;
    return html`
      <section class="documentation-section">
        <h2>Icon buttons</h2>
        <p>
          Icon buttons can be used to present an action as a symbol rather than
          a label.
        </p>
        <p>
          If possible prefer to use labeled buttons. The user may not understand the symbol
          even if target audience is expected to know it. Less experienced users can be
          confused when launching the application for the first time.
        </p>
        <p>
          Always provide alternative text description via <code>title</code>
          and <code>aria-label</code> attributes.
        </p>


        <interactive-demo
          .states="${demoStates}"
          @state-changed="${this._iconsEmphasisHandler}"
          ?dark="${darkThemeActive}"
        >
          <anypoint-icon-button
            slot="content"
            emphasis="${iconButtonEmphasis}"
            title="Icon button"
            ?anypoint="${anypoint}"
            ?noink="${iconNoink}"
            ?toggles="${iconToggles}"
            ?disabled="${iconDisabled}"
            title="Star this project"
            aria-label="Activate to see the demo."
            @transitionend="${this.buttonTransitionHandler}"
          >
            <arc-icon icon="star"></arc-icon>
          </anypoint-icon-button>

          <label slot="options" id="iconOptionsLabel">Options</label>
          <anypoint-checkbox
            aria-describedby="iconOptionsLabel"
            slot="options"
            name="iconToggles"
            @change="${this._toggleMainOption}"
            >Toggles</anypoint-checkbox>
          <anypoint-checkbox
            aria-describedby="iconOptionsLabel"
            slot="options"
            name="iconNoink"
            @change="${this._toggleMainOption}"
            >No ripples</anypoint-checkbox>
          <anypoint-checkbox
            aria-describedby="iconOptionsLabel"
            slot="options"
            name="iconDisabled"
            @change="${this._toggleMainOption}"
            >Disabled</anypoint-checkbox>
        </interactive-demo>

        <h3>More examples</h3>

        <h4>Low emphasis</h4>
        <div class="centered">
          <anypoint-icon-button
            emphasis="low"
            title="Add alarm"
            aria-label="Activate to set an alarm">
            <arc-icon icon="add"></arc-icon>
          </anypoint-icon-button>

          <anypoint-icon-button
            emphasis="low"
            toggles
            title="Star this project"
            aria-label="Activate to star this project">
            <arc-icon icon="star"></arc-icon>
          </anypoint-icon-button>

          <anypoint-icon-button
            emphasis="low"
            title="I am an image"
            aria-label="This button uses an image element">
            <img
              src="https://github.githubassets.com/images/modules/logos_page/Octocat.png" alt="a cat">
          </anypoint-icon-button>

          <anypoint-icon-button
            emphasis="low"
            disabled
            title="Reply"
            aria-label="This button is disabled">
            <arc-icon icon="message"></arc-icon>
          </anypoint-icon-button>

          <anypoint-icon-button
            emphasis="low"
            noink
            title="Cancel action"
            aria-label="Activate to see no ripple effect">
            <arc-icon icon="cancel"></arc-icon>
          </anypoint-icon-button>
        </div>

        <h4>Medium emphasis</h4>
        <div class="centered">
          <anypoint-icon-button
            emphasis="medium"
            title="Add alarm"
            aria-label="Activate to set an alarm">
            <arc-icon icon="add"></arc-icon>
          </anypoint-icon-button>

          <anypoint-icon-button
            emphasis="medium"
            toggles
            title="Star this project"
            aria-label="Activate to star this project">
            <arc-icon icon="star"></arc-icon>
          </anypoint-icon-button>

          <anypoint-icon-button
            emphasis="medium"
            title="I am an image"
            aria-label="This button uses an image element">
            <img
              src="https://github.githubassets.com/images/modules/logos_page/Octocat.png" alt="a cat">
          </anypoint-icon-button>

          <anypoint-icon-button
            emphasis="medium"
            disabled
            title="Reply"
            aria-label="This button is disabled">
            <arc-icon icon="message"></arc-icon>
          </anypoint-icon-button>

          <anypoint-icon-button
            emphasis="medium"
            noink
            title="Cancel action"
            aria-label="Activate to see no ripple effect">
            <arc-icon icon="cancel"></arc-icon>
          </anypoint-icon-button>
        </div>

        <h4>High emphasis</h4>
        <div class="centered">
          <anypoint-icon-button
            emphasis="high"
            title="Add alarm"
            aria-label="Activate to set an alarm">
            <arc-icon icon="add"></arc-icon>
          </anypoint-icon-button>

          <anypoint-icon-button
            emphasis="high"
            toggles
            title="Star this project"
            aria-label="Activate to star this project">
            <arc-icon icon="star"></arc-icon>
          </anypoint-icon-button>

          <anypoint-icon-button
            emphasis="high"
            title="I am an image"
            aria-label="This button uses an image element">
            <img
              src="https://github.githubassets.com/images/modules/logos_page/Octocat.png" alt="a cat">
          </anypoint-icon-button>

          <anypoint-icon-button
            emphasis="high"
            disabled
            title="Reply"
            aria-label="This button is disabled">
            <arc-icon icon="message"></arc-icon>
          </anypoint-icon-button>

          <anypoint-icon-button
            emphasis="high"
            noink
            title="Cancel action"
            aria-label="Activate to see no ripple effect">
            <arc-icon icon="cancel"></arc-icon>
          </anypoint-icon-button>
        </div>
      </section>
    `;
  }

  _toggleButtonsTemplate() {
    return html`
      <section class="documentation-section">
        <h2>Toggle buttons</h2>
        <p>
          Toggle buttons can be used to group related options (menu bars) or to
          bundle selection and action in one UI element (for example add to favourites).
        </p>

        <div class="centered">
          <anypoint-icon-button
            title="Italic"
            aria-label="Toggle italic text"
            class="content-control"
            toggles
            @click=${this._contentControlClick}>
            <arc-icon icon="settings"></arc-icon>
          </anypoint-icon-button>

          <anypoint-icon-button
            title="Bold"
            aria-label="Toggle bold text"
            class="content-control"
            toggles
            @click=${this._contentControlClick}>
            <arc-icon icon="toggleOn"></arc-icon>
          </anypoint-icon-button>

          <anypoint-icon-button
            title="Underline"
            aria-label="Toggle underline text"
            class="content-control"
            toggles
            @click=${this._contentControlClick}>
            <arc-icon icon="toggleOff"></arc-icon>
          </anypoint-icon-button>

          <anypoint-icon-button
            title="Text color"
            aria-label="Toggle text color"
            class="content-control"
            toggles
            @click=${this._contentControlClick}>
            <arc-icon icon="warning"></arc-icon>
          </anypoint-icon-button>

          <span class="space"></span>

          <anypoint-icon-button
            title="Align text left"
            aria-label="Toggle align text left"
            class="content-control group"
            toggles
            @click=${this._contentControlClick}>
            <arc-icon icon="zoomIn"></arc-icon>
          </anypoint-icon-button>
          <anypoint-icon-button
            title="Align text center"
            aria-label="Toggle align text center"
            class="content-control group"
            toggles
            @click=${this._contentControlClick}>
            <arc-icon icon="shortText"></arc-icon>
          </anypoint-icon-button>
          <anypoint-icon-button
            title="Align text right"
            aria-label="Toggle align text right"
            class="content-control group"
            toggles
            @click=${this._contentControlClick}>
            <arc-icon icon="spellcheck"></arc-icon>
          </anypoint-icon-button>
        </div>
      </section>
    `;
  }

  contentTemplate() {
    return html`
      <h2>Anypoint button</h2>
      ${this._demoTemplate()}
      ${this._introductionTemplate()}
      ${this._usageTemplate()}
      ${this._iconButtonsTemplate()}
      ${this._toggleButtonsTemplate()}
    `;
  }
}
const instance = new ComponentDemo();
instance.render();
