import { html, TemplateResult } from 'lit';
import MenubarElement from '../../src/elements/selector/MenubarElement.js';

export class TestMenubar extends MenubarElement {
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
