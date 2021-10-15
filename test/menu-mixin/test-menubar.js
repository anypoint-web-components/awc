import { LitElement, html } from 'lit-element';
import { MenubarMixin } from '../../index.js';

export class TestMenubar extends MenubarMixin(LitElement) {
  /**
   * @returns {HTMLElement}
   */
  get extraContent() {
    return this.shadowRoot.querySelector('.extraContent');
  }

  render() {
    return html`
      <slot></slot>
      <div class="extraContent" tabindex="-1">focusable extra content</div>
    `;
  }
}
window.customElements.define('test-menubar', TestMenubar);
