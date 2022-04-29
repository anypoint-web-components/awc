import { html, TemplateResult } from 'lit';
import MenuElement from '../../src/elements/selector/MenuElement.js';

export class TestMenu extends MenuElement {
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
