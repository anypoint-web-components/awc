import { LitElement, html, css, TemplateResult, CSSResult } from 'lit';
import './test-overlay.js';

export class TestScrollable extends LitElement {
  get styles(): CSSResult {
    return css`
    #scrollable, #overlay {
      max-width: 200px;
      max-height: 200px;
      overflow: auto;
    }`;
  }

  render(): TemplateResult {
    return html`<style>${this.styles}</style>
    <div id="scrollable">
      <slot name="scrollable-content"></slot>
    </div>
    <test-overlay id="overlay">
      <slot name="overlay-content"></slot>
    </test-overlay>`;
  }
}
window.customElements.define('test-scrollable', TestScrollable);

declare global {
  interface HTMLElementTagNameMap {
    "test-scrollable": TestScrollable;
  }
}
