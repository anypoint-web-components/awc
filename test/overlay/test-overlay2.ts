import { LitElement, html, css, TemplateResult, CSSResult } from 'lit';
import { OverlayMixin } from '../../index.js';

export class TestOverlay2 extends OverlayMixin(LitElement) {
  get styles(): CSSResult {
    return css`
    :host {
        background: white;
        color: black;
        border: 1px solid black;
      }`;
  }

  get _focusableNodes(): HTMLButtonElement[] {
    return [
      this.shadowRoot!.querySelector('#first') as HTMLButtonElement,
      this.shadowRoot!.querySelector('#last') as HTMLButtonElement
    ];
  }

  render(): TemplateResult {
    return html`<style>${this.styles}</style>
    <button id="first">first</button>
    <slot></slot>
    <button id="last">last</button>`;
  }
}
window.customElements.define('test-overlay2', TestOverlay2);

declare global {
  interface HTMLElementTagNameMap {
    "test-overlay2": TestOverlay2;
  }
}
