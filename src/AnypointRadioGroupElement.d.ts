import { LitElement } from 'lit-element';
import { MenuMixin } from './mixins/MenuMixin';

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
 */
export default class AnypointRadioGroupElement extends MenuMixin(LitElement) {
  onselect: EventListener;

  createRenderRoot(): AnypointRadioGroupElement;

  /**
   * List of radio button nodes.
   */
  readonly elements: NodeList;

  connectedCallback(): void;

  /**
   * Function that manages attribute change.
   * If the changed attribute is `role` with value `radio` then the node is processed
   * as a button and is added or removed from collection.
   * @param record A MutationRecord received from MutationObserver callback.
   */
  _processNodeAttributeChange(record: MutationRecord): void;

  /**
   * Adds `change` event listener to detected radio buttons.
   * A button is considered as a radio button when its `role` is `radio`.
   *
   * @param nodes List of nodes to process.
   */
  _processAddedNodes(nodes: HTMLElement[]): void;

  /**
   * Removes event listeners and possibly clears `selected` when removing nodes from
   * light DOM.
   * @param nodes Nodes to process
   */
  _processRemovedNodes(nodes: NodeList): void;

  /**
   * A function to be called when a node from the light DOM has been removed.
   * It clears previously attached listeners and selection if passed node is
   * currently selected node.
   * @param node Removed node
   */
  _nodeRemoved(node: Node): void;

  /**
   * Overrides `AnypointMenuMixin._onKeydown`. Adds right / left arrows support.
   */
  _onKeydown(e: KeyboardEvent): void;

  /**
   * Overrides `AnypointSelectableMixin._applySelection` to manage item's checked
   * state.
   * @param item Selected / deselected item.
   * @param isSelected True if the item is selected
   */
  _applySelection(item: HTMLElement, isSelected: boolean): void;

  /**
   * Ensures that the last child element is checked in the group.
   */
  _ensureSingleSelection(): void;

  /**
   * Overrides `AnypointSelectableMixin._mutationHandler`.
   * Processes dynamically added nodes and updates selection if needed.
   * @params mutationsList A list of changes record
   */
  _mutationHandler(mutationsList: MutationRecord[]): void;

  /**
   * Overrides `AnypointSelectableMixin._observeItems` to include subtree.
   */
  _observeItems(): MutationObserver;

  /**
   * Disables children when disabled state changes
   */
  _disabledChanged(disabled: boolean): void;
}
