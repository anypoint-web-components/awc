import { LitElement, html, css } from 'lit-element';
import { MenuMixin } from '../../index.js';
import './test-menu.js';

/** @typedef {import('./test-menu').TestMenu} TestMenu */

export class TestNestedMenu extends MenuMixin(LitElement) {
  static get styles() {
    return css`
      div {
        display: block;
      }

      .ghost,
      [hidden] {
        display: none !important;
      }

      .invisible {
        visibility: hidden;
      }
    `;
  }

  /**
   * @returns {TestMenu}
   */
  get actualMenu() {
    return this.shadowRoot.querySelector('.actualMenu');
  }

  render() {
    return html`
      <test-menu class="actualMenu">
        <div>item 1</div>
        <div hidden>item 2</div>
        <div class="ghost">item 3</div>
        <div class="invisible">item 3.1</div>
        <div>item 4</div>
        <div hidden>item 5</div>
        <div class="ghost">item 6</div>
      </test-menu>
    `;
  }
}
window.customElements.define('test-nested-menu', TestNestedMenu);
