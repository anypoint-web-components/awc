import { LitElement, html, css, TemplateResult, CSSResult } from 'lit';
import './test-overlay.js';
import { TestOverlay } from './test-overlay.js';

export class TestMenuButton extends LitElement {
  get styles(): CSSResult {
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

  toggle(): void {
    (this.shadowRoot!.querySelector('#overlay') as TestOverlay).toggle();
  }

  render(): TemplateResult {
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

declare global {
  interface HTMLElementTagNameMap {
    "test-menu-button": TestMenuButton;
  }
}
