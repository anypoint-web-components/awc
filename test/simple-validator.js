import { LitElement } from 'lit-element';
import { ValidatorMixin } from '../validator-mixin.js';

class SimpleValidator extends ValidatorMixin(LitElement) {}
window.customElements.define('simple-validator', SimpleValidator);
