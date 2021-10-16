/* eslint-disable wc/no-invalid-element-name */
import { LitElement, html } from 'lit-element';
import { ResizableMixin } from '../../index.js';

export class XResizerParent extends ResizableMixin(LitElement) {
  render() {
    return html`<p>x-resizer-parent</p>`;
  }
}
window.customElements.define('x-resizer-parent', XResizerParent);
