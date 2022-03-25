/* eslint-disable lit-a11y/click-events-have-key-events */
import { html, css, LitElement, CSSResult, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import '../define/anypoint-dropdown.js';
import { VerticalAlign, HorizontalAlign, IAnimationConfig } from '../index.js';

export class SimpleDropdown extends LitElement {
  get styles(): CSSResult {
    return css`
      :host {
        display: inline-block;
        margin: 1em;
      }
    `;
  }

  @property({ type: String })
  verticalAlign?: VerticalAlign = 'top';

  @property({ type: String })
  horizontalAlign?: HorizontalAlign = 'left';

  @property({ type: Boolean })
  disabled?: boolean = false;

  @property({ type: String })
  scrollAction?: string = 'refit';

  @property({ type: Array })
  openAnimationConfig: IAnimationConfig[] = [
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

  @property({ type: Array })
  closeAnimationConfig: IAnimationConfig[] = [
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

  @property({ type: Boolean })
  noAnimations?: boolean;

  open(): void {
    const root = this.shadowRoot;
    if (root) {
      const dd = root.querySelector('anypoint-dropdown');
      dd?.open();
    }
  }

  render(): TemplateResult {
    const {
      verticalAlign,
      horizontalAlign,
      disabled,
      scrollAction,
      openAnimationConfig,
      closeAnimationConfig,
      noAnimations,
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

declare global {
  interface HTMLElementTagNameMap {
    "simple-dropdown": SimpleDropdown;
  }
}
