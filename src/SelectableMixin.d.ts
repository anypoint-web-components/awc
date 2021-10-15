import { AnypointSelection } from './AnypointSelection';

declare function SelectableMixin<T extends new (...args: any[]) => {}>(base: T): T & SelectableMixinConstructor;
interface SelectableMixinConstructor {
  new(...args: any[]): SelectableMixin;
}

/**
 * @fires selected-changed
 * @fires selectedchange
 * @fires selecteditem-changed
 * @fires selecteditemchange
 * @fires items-changed
 * @fires itemschange
 * @fires select When an item is selected. This also is dispatched when the `selected` property is set.
 * @fires deselect When an item is deselected. This also is dispatched when the `selected` property is set.
 * @fires activate When an item is about to be selected. Cancelling this event cancels the selection.
 * @fires selected This is dispatched only through user interaction (the activateEvent). Dispatched after the `select` event.
 */
interface SelectableMixin {
  /**
   * If you want to use an attribute value or property of an element for
   * `selected` instead of the index, set this to the name of the attribute
   * or property. Hyphenated values are converted to camel case when used to
   * look up the property of a selectable element. Camel cased values are
   * *not* converted to hyphenated values for attribute lookup. It's
   * recommended that you provide the hyphenated form of the name so that
   * selection works in both cases. (Use `attr-or-property-name` instead of
   * `attrOrPropertyName`.)
   * @attribute
   */
  attrForSelected: string;

  /**
   * Gets or sets the selected element. The default is to use the index of the item.
   * @attribute
   */
  selected: string|number;

  /**
   * Returns the currently selected item.
   */
  readonly selectedItem?: HTMLElement;
  _selectedItem?: HTMLElement;

  /**
   * The event that fires from items when they are selected. Selectable
   * will listen for this event from items and update the selection state.
   * Set to empty string to listen to no events.
   *
   * @default click
   * @attribute
   */
  activateEvent: string;

  /**
   * This is a CSS selector string.  If this is set, only items that match the
   * CSS selector are selectable.
   * @attribute
   */
  selectable: string;

  /**
   * The class to set on elements when selected.
   *
   * @default selected
   * @attribute
   */
  selectedClass: string;

  /**
   * The attribute to set on elements when selected.
   * @attribute
   */
  selectedAttribute: string;

  /**
   * Default fallback if the selection based on selected with `attrForSelected` is not found.
   * @attribute
   */
  fallbackSelection: string|number;

  /**
   * The list of items from which a selection can be made.
   */
  items: HTMLElement[];
  _items: HTMLElement[];

  /**
   * @returns Previously registered handler for `selected-changed` event
   * @deprecated
   */
  onselectedchanged: EventListener;
  /**
   * @returns Previously registered handler for `selectedchange` event
   * @deprecated
   */
  onselectedchange: EventListener;
  /**
   * @returns Previously registered handler for `selecteditem-changed` event
   * @deprecated
   */
  onselecteditemchanged: EventListener;

  /**
   * @returns Previously registered handler for `selecteditemchange` event
   * @deprecated
   */
  onselecteditemchange: EventListener;

  /**
   * @returns Previously registered handler for `items-changed` event
   * @deprecated
   */
  onitemschanged: EventListener;

  /**
   * @returns Previously registered handler for `itemschange` event
   */
  onitemschange: EventListener;

  /**
   * @returns Previously registered handler for `select` event
   */
  onselect: EventListener;

  /**
   * @returns Previously registered handler for `deselect` event
   */
  ondeselect: EventListener;

  /**
   * @returns Previously registered handler for `activate` event
   */
  onactivate: EventListener;

  /**
   * @returns Previously registered handler for `selected` event
   */
  onselected: EventListener;

  _selection: AnypointSelection;

  constructor(): void;
  connectedCallback(): void;
  disconnectedCallback(): void;

  /**
   * Registers an event handler for given type
   * @param eventType Event type (name)
   * @param value The handler to register
   */
  _registerCallback(eventType: string, value: EventListener): void;

  _addListener(eventName: string): void;
  _removeListener(eventName: string): void;

  /**
   * Observe items change in the element's light DOM
   * @returns The observer handler
   */
  _observeItems(): MutationObserver;

  /**
   * Observers changes in slot children where slot is in the light DOM.
   */
  _observeSlotItems(): void;

  /**
   * Removes change observers from slot children where slot is in the light DOM.
   */
  _unobserveSlotItems(): void;

  /**
   * When light DOM mutate this method is called to remove listener from
   * removed `<slot>` children.
   * @param nodeList List of removed children.
   */
  _checkRemovedSlot(nodeList: NodeList): void;

  /**
   * Handler for the `slotchange` event dispatched on slot.
   * Updates items and selection.
   */
  _slotchangeHandler(): void;

  /**
   * Callback for a mutation event dispatched by the MutationObserver.
   * @param mutationsList List of mutations.
   */
  _mutationHandler(mutationsList: MutationRecord[]): void;

  /**
   * Returns the index of the given item.
   *
   * @returns Returns the index of the item
   */
  indexOf(item: any): number;

  /**
   * Selects the given value.
   *
   * @param value the value to select.
   */
  select(value: string|number): void;

  /**
   * Selects the previous item.
   */
  selectPrevious(): void;

  /**
   * Selects the next item.
   */
  selectNext(): void;

  /**
   * Selects the item at the given index.
   */
  selectIndex(index: number): void;

  _checkFallback(): void;
  _activateEventChanged(eventName: string, old: string): void;
  _updateItems(): void;
  _queryDistributedElements(selector: string): HTMLElement[];
  _updateAttrForSelected(): void;
  _updateSelected(): void;

  /**
   * Applies selection to the `selected` item
   * @param selected Currently selected value
   */
  _selectSelected(selected: string|number): void;

  /**
   * Searches for an item that corresponds to given `value`
   * @param value
   * @returns An item for given `value`
   */
  _valueToItem(value: string|number): HTMLElement;

  /**
   * Searches for an index that corresponds to given `value`
   * @param value
   * @returns An index of the `value`
   */
  _valueToIndex(value: string|number): number;

  /**
   * Reads a value for an item in the `items` array for given index.
   * When `attrForSelected` is set then it returns attribute value for the item. If not
   * it returns the same index.
   *
   * @param index Index of an item in the `items` array
   * @returns A value for given index
   */
  _indexToValue(index: number): string|number|null;

  /**
   * Reads a value of an item depending on whether `attrForSelected` is set ot not.
   * When it's set then it returns attribute value for the item. If not
   * it returns the index of the item in the `items` array.
   *
   * @param item An item to get a value from.
   * @returns A value for the passed item
   */
  _valueForItem(item: HTMLElement): string|number|null;

  /**
   * Applies selection state to an item. It updates class names
   * and selection attribute.
   * It also propagates selection change listeners.
   *
   * @param item The item to apply the state to
   * @param isSelected Whether the item is currently selected.
   */
  _applySelection(item: HTMLElement, isSelected: boolean): void;

  _selectionChange(): void;

  /**
   * A handler for the event which `type` is described as
   * `activateEvent`. By default it is a `ClickEvent`.
   */
  _activateHandler(e: Event): void;

  /**
   * Dispatches `activate` item and selects the item.
   *
   * @param value Selected value
   * @param item The selected item.
   */
  _itemActivate(value: string|number|null, item: HTMLElement): void;
}

export {SelectableMixinConstructor};
export {SelectableMixin};
