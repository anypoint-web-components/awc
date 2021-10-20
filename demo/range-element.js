import { LitElement, html, css } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map.js';
import { RangeMixin } from '../index.js';

export class RangeElement extends RangeMixin(LitElement) {
  static get styles() {
    return css`
    :host {
      display: block;
      height: 40px;
      background-color: #555;
      border-radius: 4px;
      padding: 8px;
      box-shadow: inset 0px 2px 5px rgba(0, 0, 0, 0.5);
    }

    .progress {
      background-color: #999;
      height: 100%;
      border-radius: 4px;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
    }

    .progress-value {
      padding: 0 8px;
      font-size: 18px;
      color: #fff;
    }
    `;
  }

  render() {
    const { ratio } = this;
    const styles = {
      width: `${ratio}%`,
    };
    return html`
    <div class="progress" style="${styleMap(styles)}">
      <div class="progress-value"><span>${ratio}</span>%</div>
    </div>
    `;
  }
}
window.customElements.define('range-element', RangeElement);
