/* eslint-disable wc/no-invalid-element-name */
import { html, TemplateResult } from 'lit';
import ResizableElement from '../../src/elements/overlay/ResizableElement.js';

export class Xresizable extends ResizableElement {
  render(): TemplateResult {
    return html`<p>x-resizable</p>`;
  }
}
window.customElements.define('x-resizable', Xresizable);

declare global {
  interface HTMLElementTagNameMap {
    "x-resizable": Xresizable
  }
}
