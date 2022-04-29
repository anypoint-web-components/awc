import MultiSelectableElement from './selector/MultiSelectableElement.js';

/**
 */
export default class AnypointSelectorElement extends MultiSelectableElement {
  createRenderRoot(): HTMLElement {
    return this;
  }
}
