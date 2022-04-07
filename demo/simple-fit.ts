import { LitElement, html, css, TemplateResult, CSSResult } from 'lit';
import { property } from 'lit/decorators.js';
import { FitMixin } from '../src/index.js';

export class SimpleFit extends FitMixin(LitElement) {
  static get styles(): CSSResult {
    return css`
    :host {
      background-color: blue;
      color: white;
      text-align: center;
    }`;
  }

  @property({ type: String, attribute: 'my-prop' })
  myProp?: string;
  
  render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
window.customElements.define('simple-fit', SimpleFit);

declare global {
  interface HTMLElementTagNameMap {
    "simple-fit": SimpleFit;
  }
}
