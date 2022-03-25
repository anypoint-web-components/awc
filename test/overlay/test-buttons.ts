import { LitElement, html, css, CSSResult, TemplateResult } from 'lit';

export class TestButtons extends LitElement {
  get styles(): CSSResult {
    return css`
    :host {
      display: block;
      border: 1px solid black;
      padding: 10px;
    }`;
  }

  render(): TemplateResult {
    return html`<style>${this.styles}</style>
    <button id="button0">button0</button>
    <button id="button1">button1</button>
    <slot></slot>
    <button id="button2">button2</button>`;
  }
}
window.customElements.define('test-buttons', TestButtons);

declare global {
  interface HTMLElementTagNameMap {
    "test-buttons": TestButtons;
  }
}
