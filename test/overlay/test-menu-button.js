import { LitElement, html, css } from 'lit-element';
import './test-overlay.js';

export class TestMenuButton extends LitElement {
  get styles() {
    return css`
    :host {
      display: block;
      border: 1px solid black;
      padding: 10px;
    }`;
  }

  constructor() {
    super();
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.shadowRoot.querySelector('#overlay').toggle();
  }

  render() {
    return html`<style>${this.styles}</style>
    <button id="trigger" @click="${this.toggle}">Open</button>
    <test-overlay id="overlay">
      Composed overlay
      <button>button 1</button>
      <button>button 2</button>
    </test-overlay>`;
  }
}
window.customElements.define('test-menu-button', TestMenuButton);
