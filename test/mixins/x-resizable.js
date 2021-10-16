/* eslint-disable wc/no-invalid-element-name */
import { LitElement, html } from 'lit-element';
import { ResizableMixin } from '../../index.js';

export class Xresizable extends ResizableMixin(LitElement) {
  render() {
    return html`<p>x-resizable</p>`;
  }
}
window.customElements.define('x-resizable', Xresizable);
