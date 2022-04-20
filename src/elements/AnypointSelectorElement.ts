import { LitElement } from 'lit';
import { MultiSelectableMixin } from '../mixins/MultiSelectableMixin.js';

/**
 * @fires deselect
 * @fires selected
 * @fires activate
 * @fires selectedchange
 * @fires itemschange
 * @fires selecteditemchange
 * @fires childrenchange
 * @fires selectedvalueschange
 * @fires selecteditemschange
 * 
 * @attr {string} selected The selected element. The default is to use the index of the item.
 * @prop {string | number | undefined} selected - The selected element. The default is to use the index of the item.
 * 
 * @attr {string} fallbackSelection
 * @prop {string | number | undefined} fallbackSelection
 * 
 * @attr {string} attrForSelected
 * @prop {string | undefined} attrForSelected
 * 
 * @attr {string} selectable
 * @prop {string | undefined} selectable
 * 
 * @attr {string} selectedClass
 * @prop {string | undefined} selectedClass
 * 
 * @attr {string} selectedAttribute
 * @prop {string | undefined} selectedAttribute
 * 
 * @attr {string} activateEvent
 * @prop {string | undefined} activateEvent
 * 
 * @prop {readonly HTMLElement[]} items
 * 
 * @attr {boolean} multi
 * @prop {boolean | undefined} multi
 * 
 * @attr {unknown[]} selectedValues
 * @prop {unknown[] | undefined} selectedValues
 * 
 * @prop {readonly HTMLElement[]} selectedItems
 */
export default class AnypointSelectorElement extends MultiSelectableMixin(LitElement) {
  createRenderRoot(): HTMLElement {
    return this;
  }
}
