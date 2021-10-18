import { LitElement, html, css } from 'lit-element';
import './scrollable-element.js';

class XNestedScrollableElement extends LitElement {
  static get styles() {
    return css`
    :host {
      display: block;
    }
    #xRegion {
      width: 100px;
      height: 100px;
      overflow: auto;
    }`;
  }

  render() {
    return html`<div id="xRegion">
      <scrollable-element id="xScrollable" scrollTarget="xRegion"></scrollable-element>
    </div>`;
  }
}
window.customElements.define('nested-scrollable-element', XNestedScrollableElement);
