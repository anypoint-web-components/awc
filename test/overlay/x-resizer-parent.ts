/* eslint-disable wc/no-invalid-element-name */
import { html, TemplateResult } from 'lit';
import ResizableElement from '../../src/elements/overlay/ResizableElement.js';

export class XResizerParent extends ResizableElement {
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
