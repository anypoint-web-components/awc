import { LitElement } from 'lit-element';
import { CheckedElementMixin } from '../index.js';

export class SimpleCheckbox extends CheckedElementMixin(LitElement) {}
window.customElements.define('simple-checkbox', SimpleCheckbox);
