/* eslint-disable wc/no-invalid-element-name */
import { LitElement, html, TemplateResult } from 'lit';
import { ResizableMixin } from '../../src/index.js';

export class Xresizable extends ResizableMixin(LitElement) {
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
