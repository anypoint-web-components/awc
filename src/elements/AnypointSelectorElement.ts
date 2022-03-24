import { LitElement } from 'lit';
import { MultiSelectableMixin } from '../mixins/MultiSelectableMixin.js';

export default class AnypointSelectorElement extends MultiSelectableMixin(LitElement) {
  createRenderRoot(): HTMLElement {
    return this;
  }
}
