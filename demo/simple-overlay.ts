import { LitElement, html, css, TemplateResult, CSSResult } from 'lit';
import { OverlayMixin } from '../src/index.js';

class SimpleOverlay extends OverlayMixin(LitElement) {
  get styles(): CSSResult {
    return css`
    :host {
      background: white;
        color: black;
        padding: 24px;
        box-shadow: rgba(0, 0, 0, 0.24) -2px 5px 12px 0px, rgba(0, 0, 0, 0.12) 0px 0px 12px 0px;
    }`;
  }

  render(): TemplateResult {
    return html`<style>${this.styles}</style><slot></slot>`;
  }
}
window.customElements.define('simple-overlay', SimpleOverlay);

declare global {
  interface HTMLElementTagNameMap {
    "simple-overlay": SimpleOverlay;
  }
}
