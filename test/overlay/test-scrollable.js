import { LitElement, html, css } from 'lit-element';
import './test-overlay.js';

class TestScrollable extends LitElement {
  get styles() {
    return css`
    #scrollable, #overlay {
      max-width: 200px;
      max-height: 200px;
      overflow: auto;
    }`;
  }

  render() {
    return html`<style>${this.styles}</style>
    <div id="scrollable">
      <slot name="scrollable-content"></slot>
    </div>
    <test-overlay id="overlay">
      <slot name="overlay-content"></slot>
    </test-overlay>`;
  }
}
window.customElements.define('test-scrollable', TestScrollable);
