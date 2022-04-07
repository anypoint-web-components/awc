import { LitElement, html, TemplateResult } from 'lit';
import { MenubarMixin } from '../../src/index.js';

export class TestMenubar extends MenubarMixin(LitElement) {
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
window.customElements.define('test-menubar', TestMenubar);

declare global {
  interface HTMLElementTagNameMap {
    "test-menubar": TestMenubar;
  }
}
