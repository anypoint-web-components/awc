import { html, css } from 'lit-element';
import AnypointButtonElement from './AnypointButtonElement.js';
import '../material-ripple.js';

export default class AnypointTabElement extends AnypointButtonElement {
  get styles() {
    return [
      // @ts-ignore
      super.styles,
      css`
        :host {
          overflow: hidden;
          vertical-align: middle;
          margin: 0;
        }

        .tab-content {
          height: 100%;
          transition: opacity 0.1s cubic-bezier(0.4, 0, 1, 1);
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        }

        :host(:not(.selected)) > .tab-content {
          opacity: 0.8;
        }

        :host(:focus) .tab-content {
          opacity: 1;
          font-weight: 700;
        }

        :host([link]) {
          padding: 0;
        }

        material-ripple {
          color: var(--anypoint-tab-ink, var(--accent-color));
        }

        .tab-content > ::slotted(a) {
          flex: 1 1 auto;
          height: 100%;
        }
      `,
    ];
  }

  static get properties() {
    return {
      /**
       * If true, the tab will forward keyboard clicks (enter/space) to
       * the first anchor element found in its descendants
       */
      link: { type: Boolean, reflect: true },
    };
  }

  constructor() {
    super();
    this._clickHandler = this._clickHandler.bind(this);
    this.link = false;
  }

  connectedCallback() {
    /* istanbul ignore else */
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'tab');
    }
    /* istanbul ignore else */
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    this.addEventListener('click', this._clickHandler);
  }

  disconnectedCallback() {
    /* istanbul ignore else */
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    this.removeEventListener('click', this._clickHandler);
  }

  _clickHandler(e) {
    if (this.link) {
      const slot = this.shadowRoot.querySelector('slot');
      const nodes = slot.assignedElements();
      const target = Array.from(nodes).find((node) => node.localName === 'a');
      /* istanbul ignore else */
      if (!target) {
        return;
      }
      // Don't get stuck in a loop delegating
      // the listener from the child anchor
      /* istanbul ignore next */
      if (e.target === target) {
        return;
      }
      /* istanbul ignore next */
      /** @type HTMLElement */ (target).click();
    }
  }

  render() {
    const { noink, compatibility } = this;
    const stopRipple = !!noink || !!compatibility;
    return html`<style>
        ${this.styles}
      </style>
      <div class="tab-content">
        <slot></slot>
      </div>
      <material-ripple .noink="${stopRipple}"></material-ripple>`;
  }
}
