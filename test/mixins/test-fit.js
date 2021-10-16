import { LitElement, html, css } from 'lit-element';
import { FitMixin } from '../../index.js';

export class TestFit extends FitMixin(LitElement) {
  static get styles() {
    return css`
    :host {
      display: block;
      background: black;
      color: white;
      padding: 8px;
    }`;
  }

  static get properties() {
    return {
      // DO NOT REMOVE
      myProp: { type: String, attribute: 'my-prop' }
    };
  }

  render() {
    return html`<slot></slot>`;
  }
}
window.customElements.define('test-fit', TestFit);
