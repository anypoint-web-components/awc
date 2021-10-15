import { LitElement } from 'lit-element';
import { MultiSelectableMixin } from './MultiSelectableMixin.js';

export default class AnypointSelectorElement extends MultiSelectableMixin(LitElement) {
  createRenderRoot() {
    return this;
  }
}
