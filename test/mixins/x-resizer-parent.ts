/* eslint-disable wc/no-invalid-element-name */
import { LitElement, html, TemplateResult } from 'lit';
import { ResizableMixin } from '../../src/index.js';

export class XResizerParent extends ResizableMixin(LitElement) {
  render(): TemplateResult {
    return html`<p>x-resizer-parent</p>`;
  }
}
window.customElements.define('x-resizer-parent', XResizerParent);

declare global {
  interface HTMLElementTagNameMap {
    "x-resizer-parent": XResizerParent
  }
}
