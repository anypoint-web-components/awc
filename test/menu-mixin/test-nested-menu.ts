/* eslint-disable import/no-duplicates */
import { LitElement, html, TemplateResult, css, CSSResult } from 'lit';
import { MenuMixin } from '../../src/index.js';
import './test-menu.js';
import { TestMenu } from './test-menu.js';

export class TestNestedMenu extends MenuMixin(LitElement) {
  static get styles(): CSSResult {
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

  get actualMenu(): TestMenu {
    return this.shadowRoot!.querySelector('.actualMenu') as TestMenu;
  }

  render(): TemplateResult {
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

declare global {
  interface HTMLElementTagNameMap {
    "test-nested-menu": TestNestedMenu;
  }
}
