import { html, css, LitElement } from 'lit-element';
import '../anypoint-collapse.js'

/**
 * @typedef {import('../index.js').AnypointCollapseElement} AnypointCollapseElement
 */

export class CustomDetail extends LitElement {
  static get styles() {
    return css`
    :host {
      display: block;
    }

    #trigger {
      padding: 10px 15px;
      background-color: #f3f3f3;
      border: 1px solid #dedede;
      border-radius: 5px;
      font-size: 18px;
      cursor: pointer;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      text-align: left;
    }

    :host([opened]) #trigger {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    anypoint-collapse {
      border: 1px solid #dedede;
      border-top: none;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
                    0 1px 5px 0 rgba(0, 0, 0, 0.12),
                    0 3px 1px -2px rgba(0, 0, 0, 0.2);
    }
    `;
  }

  static get properties() {
    return {
      horizontal: { type: Boolean },
      opened: { type: Boolean, reflect: true },
      noAnimation: { type: Boolean },
    };
  }

  get buttonLabel() {
    return this.opened ? 'Collapse' : 'Expand';
  }

  constructor() {
    super();
    this.horizontal = false;
    this.opened = false;
    this.noAnimation = false;
  }

  toggle() {
    const node = /** @type AnypointCollapseElement */ (this.shadowRoot.querySelector('#collapse'));
    node.toggle();
  }

  render() {
    const { opened, buttonLabel, horizontal, noAnimation } = this;
    return html`
    <button id="trigger" @click="${this.toggle}" aria-expanded="${opened}" aria-controls="collapse">${buttonLabel}</button>
    <anypoint-collapse
      id="collapse"
      ?opened="${opened}"
      ?horizontal="${horizontal}"
      ?noanimation="${noAnimation}"
      tabindex="0"
    >
      <slot></slot>
    </anypoint-collapse>`;
  }
}
window.customElements.define('custom-detail', CustomDetail);
