import { LitElement, html, css } from 'lit-element';
import { FitMixin } from '../index.js';

class SimpleFit extends FitMixin(LitElement) {
  static get styles() {
    return css`
    :host {
      background-color: blue;
      color: white;
      text-align: center;
    }`;
  }

  static get properties() {
    return {
      myProp: { type: String, attribute: 'my-prop' }
    };
  }

  render() {
    return html`<slot></slot>`;
  }
}
window.customElements.define('simple-fit', SimpleFit);
