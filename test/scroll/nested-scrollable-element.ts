import { LitElement, html, css, CSSResult, TemplateResult } from 'lit';
import './scrollable-element.js';

export class XNestedScrollableElement extends LitElement {
  static get styles(): CSSResult {
    return css`
    :host {
      display: block;
    }
    #xRegion {
      width: 100px;
      height: 100px;
      overflow: auto;
    }`;
  }

  render(): TemplateResult {
    return html`<div id="xRegion">
      <scrollable-element id="xScrollable" scrollTarget="xRegion"></scrollable-element>
    </div>`;
  }
}
window.customElements.define('nested-scrollable-element', XNestedScrollableElement);

declare global {
  interface HTMLElementTagNameMap {
    "nested-scrollable-element": XNestedScrollableElement;
  }
}
