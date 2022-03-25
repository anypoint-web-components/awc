import { LitElement, html, css, TemplateResult, CSSResult } from 'lit';
import { HoverableMixin } from '../../index.js';

export class HoverableTestElement extends HoverableMixin(LitElement) {
  static get styles(): CSSResult {
    return css`:host {
      display: block;
      height: 100px;
      width: 100px;
      background-color: red;
    }`;
  }

  render(): TemplateResult {
    return html`<h1>Hoverable mixin</h1>
    <slot></slot>`;
  }
}
window.customElements.define('hoverable-test-element', HoverableTestElement);

declare global {
  interface HTMLElementTagNameMap {
    "hoverable-test-element": HoverableTestElement
  }
}
