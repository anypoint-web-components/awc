import { LitElement } from 'lit-element';
import { MultiSelectableMixin } from './MultiSelectableMixin';

export default class AnypointSelectorElement extends MultiSelectableMixin(LitElement) {
  createRenderRoot(): AnypointSelectorElement;
  /**
   * @returns Previously registered handler for `select` event
   */
  onselect: EventListener;
}
