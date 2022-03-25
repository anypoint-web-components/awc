import { LitElement } from 'lit';
import { RangeMixin } from '../../index.js';

export class TestProgress extends RangeMixin(LitElement) {
  
}
window.customElements.define('test-progress', TestProgress);

declare global {
  interface HTMLElementTagNameMap {
    "test-progress": TestProgress;
  }
}