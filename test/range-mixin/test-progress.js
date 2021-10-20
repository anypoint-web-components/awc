import { LitElement } from 'lit-element';
import { RangeMixin } from '../../index.js';

export class TestProgress extends RangeMixin(LitElement) {
  
}
window.customElements.define('test-progress', TestProgress);
