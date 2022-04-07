import { LitElement, html, css, TemplateResult, CSSResult } from 'lit';
import { property } from 'lit/decorators.js';
import { FitMixin } from '../../src/index.js';

export class TestFit extends FitMixin(LitElement) {
  static get styles(): CSSResult {
    return css`
    :host {
      display: block;
      background: black;
      color: white;
      padding: 8px;
    }`;
  }
  
  @property({ type: String, attribute: 'my-prop' })
  myProp?: string;
  
  render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
window.customElements.define('test-fit', TestFit);

declare global {
  interface HTMLElementTagNameMap {
    "test-fit": TestFit
  }
}
