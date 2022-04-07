import { LitElement, html, TemplateResult } from 'lit';
import { MenuMixin } from '../../src/index.js';

export class TestMenu extends MenuMixin(LitElement) {
  get extraContent(): HTMLElement {
    return this.shadowRoot!.querySelector('.extraContent') as HTMLElement;
  }

  render(): TemplateResult {
    return html`
      <slot></slot>
      <div class="extraContent" tabindex="-1">focusable extra content</div>
    `;
  }
}
window.customElements.define('test-menu', TestMenu);

declare global {
  interface HTMLElementTagNameMap {
    "test-menu": TestMenu;
  }
}
