import { LitElement, html, css } from 'lit-element';
import './test-buttons.js';

class TestButtonsWrapper extends LitElement {
  get styles() {
    return css`
    :host {
      display: block;
      border: 1px solid gray;
      padding: 10px;
    }`;
  }

  render() {
    return html`<style>${this.styles}</style>
    <select id="select">
      <option>1</option>
    </select>
    <test-buttons id="wrapped">
      <slot></slot>
    </test-buttons>
    <div tabindex="0" id="focusableDiv">Focusable div</div>`;
  }
}
window.customElements.define('test-buttons-wrapper', TestButtonsWrapper);
