import { html, css, LitElement } from 'lit-element';
import '../anypoint-dropdown.js';

export class SimpleDropdown extends LitElement {
  get styles() {
    return css`
      :host {
        display: inline-block;
        margin: 1em;
      }
    `;
  }

  static get properties() {
    return {
      verticalAlign: { type: String },
      horizontalAlign: { type: String },
      disabled: { type: Boolean },
      scrollAction: { type: String },
      openAnimationConfig: { type: Array },
      closeAnimationConfig: { type: Array },
      noAnimations: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.openAnimationConfig = [
      {
        keyframes: [
          { transform: 'scale(1, 0)' },
          { transform: 'scale(1, 1)' }
        ],
        timing: { delay: 0, duration: 200, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'both' }
      },
      {
        keyframes: [{ opacity: 0 }, { opacity: 1 }],
        timing: { delay: 0, duration: 300, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'both' }
      }
    ];
    this.closeAnimationConfig = [
      {
        keyframes: [
          { transform: 'scale(1, 1)' },
          { transform: 'scale(1, 0)' }
        ],
        timing: { delay: 0, duration: 200, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'both' }
      },
      {
        keyframes: [{ opacity: 1 }, { opacity: 0 }],
        timing: { delay: 0, duration: 300, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'both' }
      }
    ];
    this.horizontalAlign = 'left';
    this.verticalAlign = 'top';
    this.scrollAction = 'refit';
  }

  open() {
    this.shadowRoot.querySelector('anypoint-dropdown').open();
  }

  render() {
    const {
      verticalAlign,
      horizontalAlign,
      disabled,
      scrollAction,
      openAnimationConfig,
      closeAnimationConfig,
      noAnimations
    } = this;
    return html`<style>${this.styles}</style>
      <div @click="${this.open}">
        <slot name="dropdown-trigger"></slot>
      </div>
      <anypoint-dropdown
        .verticalAlign="${verticalAlign}"
        .horizontalAlign="${horizontalAlign}"
        .scrollAction="${scrollAction}"
        ?disabled="${disabled}"
        ?noAnimations="${noAnimations}"
        .openAnimationConfig="${openAnimationConfig}"
        .closeAnimationConfig="${closeAnimationConfig}">
        <slot name="dropdown-content" slot="dropdown-content"></slot>
      </anypoint-dropdown>
    `;
  }
}
window.customElements.define('simple-dropdown', SimpleDropdown);
