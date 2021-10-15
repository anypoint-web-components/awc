import { LitElement, html, css } from 'lit-element';
import { HoverableMixin } from '../index.js';

class HoverableElement extends HoverableMixin(LitElement) {
  static get styles() {
    return css`
      :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 120px;
        height: 120px;
        margin: 20px;
        border: 1px #989a9b solid;
      }

      :host([hovered]) {
        background-color: #8bc34a;
      }

      .hovered {
        display: none;
      }

      .not-hovered {
        display: block;
      }

      :host([hovered]) .hovered {
        display: block;
      }

      :host([hovered]) .not-hovered {
        display: none;
      }

      span {
        text-align: center;
      }
    `;
  }

  render() {
    return html` <span class="hovered">Hovered</span>
      <span class="not-hovered">Not hovered</span>
      <slot></slot>`;
  }
}
window.customElements.define('hoverable-element', HoverableElement);
