import { LitElement, html, css, TemplateResult, CSSResult } from 'lit';
import './test-buttons.js';

export class TestButtonsWrapper extends LitElement {
  get styles(): CSSResult {
    return css`
    :host {
      display: block;
      border: 1px solid gray;
      padding: 10px;
    }`;
  }

  render(): TemplateResult {
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

declare global {
  interface HTMLElementTagNameMap {
    "test-buttons-wrapper": TestButtonsWrapper;
  }
}
