import { isRadioButton } from '../../lib/Utility.js';
import AnypointRadioButtonElement from './AnypointRadioButtonElement';
import MenuElement from '../selector/MenuElement.js';

/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
/* eslint-disable no-param-reassign */

/**
 * A web component that groups custom radio buttons and handles selection inside
 * the group.
 *
 * Requirements for children:
 * - must have role="radio" attribute
 * - must have name attribute
 * - radio state change must be notified via `change` event.
 *
 * Radio buttons with the same name inside their group will have single selection.
 * This means when selecting a radio button any other currently selected button
 * will be deselected.
 *
 * Also. when initializing the component, only last selected component keeps the
 * selection.
 * When new checked radio button is inserted into the group the selection is passed to the newly
 * arriving element.
 *
 * This behavior is consistent with native DOM API.
 *
 * The group element exposes `selected` property that holds a reference to
 * currently selected radio button.
 *
 * Example
 *
 * ```
 * <anypoint-radio-group>
 *  <anypoint-radio-button name="option"></anypoint-radio-button>
 *  <other-control role="button" name="option" checked></other-control>
 * </anypoint-radio-group>
 * ```
 * 
 * @fires change
 */
export default class AnypointRadioGroupElement extends MenuElement {
  createRenderRoot(): HTMLElement {
    return this;
  }

  /**
   * @return List of radio button nodes.
   */
  get elements(): NodeList {
    return this.querySelectorAll('[role="radio"], input[type="radio"]');
  }

  constructor() {
    super();
    this.multi = false;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.style.display = 'inline-block';
    this.style.verticalAlign = 'middle';
    this.setAttribute('role', 'radiogroup');
    this.selectable = '[role=radio],input[type=radio]';
    this._ensureSingleSelection();
    if (this.disabled) {
      this._disabledChanged(this.disabled);
    }
  }

  /**
   * Function that manages attribute change.
   * If the changed attribute is `role` with value `radio` then the node is processed
   * as a button and is added or removed from collection.
   * @param {MutationRecord} record A MutationRecord received from MutationObserver
   * callback.
   */
  _processNodeAttributeChange(record: MutationRecord): void {
    if (record.target.nodeType !== Node.ELEMENT_NODE) {
      return;
    }
    const elm = record.target as Element;
    if (record.attributeName === 'checked' && elm.hasAttribute('checked')) {
      this._deselectOthers(elm);
      const index = this.indexOf(elm as HTMLElement);
      this.selected = index;
      return;
    }
    if (record.attributeName !== 'role') {
      return;
    }
    const node = (record.target as HTMLElement);
    if (node === this) {
      return;
    }
    if (node.getAttribute('role') === 'radio') {
      this._processAddedNodes([node]);
    } else {
      this._nodeRemoved(node);
    }
  }

  /**
   * @param selected The element to keep selection onto.
   */
  _deselectOthers(selected?: Element): void {
    this.items.forEach((elm) => {
      const typed = elm as AnypointRadioButtonElement;
      if (typed !== selected) {
        if (typed.checked) {
          typed.checked = false;
        }
      }
    });
  }

  /**
   * Adds `change` event listener to detected radio buttons.
   * A button is considered as a radio button when its `role` is `radio`.
   *
   * @param nodes List of nodes to process.
   */
  _processAddedNodes(nodes: HTMLElement[]): void {
    for (let i = 0, len = nodes.length; i < len; i++) {
      const node = nodes[i];
      if (node === this || !isRadioButton(node)) {
        continue;
      }
      node.setAttribute('tabindex', '-1');
    }
  }

  /**
   * Removes event listeners and possibly clears `selected` when removing nodes from
   * light DOM.
   * @param nodes Nodes to process
   */
  _processRemovedNodes(nodes: NodeList): void {
    for (let i = 0, len = nodes.length; i < len; i++) {
      const node = nodes[i];
      if (node === this || !isRadioButton(node)) {
        continue;
      }
      this._nodeRemoved(node);
    }
  }

  /**
   * A function to be called when a node from the light DOM has been removed.
   * It clears previously attached listeners and selection if passed node is
   * currently selected node.
   * @param node Removed node
   */
  _nodeRemoved(node: Node): void {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return;
    }
    const selected = Number(this.selected);
    const typedElement = node as HTMLElement;
    if ((selected >= 0) && this._valueForItem(typedElement) === selected) {
      this.selected = undefined;
    }
  }

  /**
   * Adds right / left arrows support.
   */
  _onKeydown(e: KeyboardEvent): void {
    if (e.code === 'ArrowRight') {
      e.stopPropagation();
      this._onDownKey(e);
    } else if (e.code === 'ArrowLeft') {
      e.stopPropagation();
      this._onUpKey(e);
    } else {
      super._onKeydown(e);
    }
  }

  /**
   * @param item Selected / deselected item.
   * @param isSelected True if the item is selected
   */
  _applySelection(item: HTMLElement, isSelected: boolean): void {
    // @ts-ignore
    if (item.disabled) {
      return;
    }
    super._applySelection(item, isSelected);
    // @ts-ignore
    item.checked = isSelected;
    if (!isSelected) {
      item.dispatchEvent(new Event('change'));
    }
  }

  /**
   * Ensures that the last child element is checked in the group.
   */
  _ensureSingleSelection(): void {
    const nodes = this.items;
    let checked = false;
    for (let i = nodes.length - 1; i >= 0; i--) {
      // @ts-ignore
      const currentChecked = !!nodes[i].checked;
      if (currentChecked && !checked) {
        checked = true;
        if (this.attrForSelected) {
          const value = this._valueForItem(nodes[i]);
          if (typeof value !== 'undefined') {
            this.select(value);
          }
        } else {
          this.select(i);
        }
      } else if (currentChecked && checked) {
        this._applySelection(nodes[i], false);
      }
    }
  }

  /**
   * Processes dynamically added nodes and updates selection if needed.
   * @param mutationsList A list of changes record
   */
  _mutationHandler(mutationsList: MutationRecord[]): void {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes') {
        this._processNodeAttributeChange(mutation);
      } else if (mutation.type === 'childList') {
        if (mutation.addedNodes && mutation.addedNodes.length) {
          this._ensureSingleSelection();
        }
        if (mutation.removedNodes && mutation.removedNodes.length) {
          this._processRemovedNodes(mutation.removedNodes);
        }
      }
    }
    super._mutationHandler(mutationsList);
  }

  _observeItems(): MutationObserver {
    const config = {
      attributes: true,
      childList: true,
      subtree: true
    };
    const observer = new MutationObserver(this._mutationHandler);
    observer.observe(this, config);
    return observer;
  }

  /**
   * Disables children when disabled state changes
   */
  _disabledChanged(disabled?: boolean): void {
    super._disabledChanged(disabled);
    this.items.forEach((node) => {
      // @ts-ignore
      node.disabled = disabled;
    });
  }
}
