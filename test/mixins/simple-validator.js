import { LitElement } from 'lit-element';
import { ValidatorMixin } from '../../index.js';

export class SimpleValidator extends ValidatorMixin(LitElement) {}
window.customElements.define('simple-validator', SimpleValidator);
