import { LitElement, html, css } from 'lit-element';
import { HoverableMixin } from '../index.js';

class HoverableTestElement extends HoverableMixin(LitElement) {
  static get styles() {
    return css`:host {
      display: block;
      height: 100px;
      width: 100px;
      background-color: red;
    }`;
  }

  render() {
    return html`<h1>Hoverable mixin</h1>
    <slot></slot>`;
  }
}
window.customElements.define('hoverable-test-element', HoverableTestElement);
