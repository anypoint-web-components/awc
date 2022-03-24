import { property, state } from 'lit/decorators';
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { AnypointSelection } from './AnypointSelection.js';
import { addListener, getListener } from '../lib/ElementEventsRegistry.js';

/* eslint-disable no-plusplus */

/**
 * The set of excluded elements where the key is the `localName`
 * of the element that will be ignored from the item list.
 */
const excludedLocalNames = {
  template: 1,
  'dom-bind': 1,
  'dom-if': 1,
  'dom-repeat': 1,
};

const p = Element.prototype;
const normalizedMatchesSelector = p.matches
  // @ts-ignore
  || p.matchesSelector
  // @ts-ignore
  || p.mozMatchesSelector
  // @ts-ignore
  || p.msMatchesSelector
  // @ts-ignore
  || p.oMatchesSelector
  || p.webkitMatchesSelector;
/**
 * Cross-platform `element.matches` shim.
 *
 * @param node Node to check selector against
 * @param selector Selector to match
 * @return True if node matched selector
 */
export const matchesSelector = (node: Node, selector: string): boolean => normalizedMatchesSelector.call(node, selector);

// @ts-ignore
const filterItem = (node: Node): boolean => !excludedLocalNames[node.localName];

const toggleClass = (css: string, selected: boolean, node: Element): void => {
  if (selected) {
    node.classList.add(css);
  } else {
    node.classList.remove(css);
  }
};

type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * @fires deselect
 */
export interface SelectableMixinInterface {

  /**
   * This is a CSS selector string.  If this is set, only items that match the
   * CSS selector are selectable.
   */
  selectable?: string;

  /**
   * The class to set on elements when selected.
   *
   * @default selected
   */
  selectedClass?: string;

  /**
   * The attribute to set on elements when selected.
   */
  selectedAttribute?: string;

  /**
   * If you want to use an attribute value or property of an element for
   * `selected` instead of the index, set this to the name of the attribute
   * or property. Hyphenated values are converted to camel case when used to
   * look up the property of a selectable element. Camel cased values are
   * *not* converted to hyphenated values for attribute lookup. It's
   * recommended that you provide the hyphenated form of the name so that
   * selection works in both cases. (Use `attr-or-property-name` instead of
   * `attrOrPropertyName`.)
   */
  attrForSelected: string | undefined;

  /**
   * Gets or sets the selected element. The default is to use the index of the
   * item.
   * @attribute
   */
  selected: string | number | undefined;

  /**
   * The list of items from which a selection can be made.
   */
  get items(): HTMLElement[];

  get selectedItem(): HTMLElement | undefined;

  /**
   * The event that fires from items when they are selected. Selectable
   * will listen for this event from items and update the selection state.
   * Set to empty string to listen to no events.
   *
   * @default click
   */
  activateEvent: string;

  /**
   * Default fallback if the selection based on selected with `attrForSelected` is not found.
   */
  fallbackSelection: string | number | undefined;

  _selection: AnypointSelection;

  /**
   * Returns the currently selected item.
   */
  _selectedItem: HTMLElement | undefined;

  onselectedchange: EventListener | undefined;
  onselected: EventListener | undefined;
  onselecteditemchange: EventListener | undefined;
  onitemschange: EventListener | undefined;
  onselect: EventListener | undefined;
  ondeselect: EventListener | undefined;
  onactivate: EventListener | undefined;

  /**
   * Returns the index of the given item.
   *
   * @return Returns the index of the item
   */
  indexOf(item: HTMLElement): number;

  /**
   * Selects the given value.
   *
   * @param value the value to select.
   */
  select(value: string | number | undefined): void;

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

  _updateAttrForSelected(): void;

  /**
   * Reads a value for an item in the `items` array for given index.
   * When `attrForSelected` is set then it returns attribute value for the item. If not
   * it returns the same index.
   *
   * @param index Index of an item in the `items` array
   * @returns A value for given index
   */
  _indexToValue(index: number): string | number | undefined;

  /**
   * Applies selection to the `selected` item
   * @param {string|number} selected Currently selected value
   */
  _selectSelected(selected: string | number): void;
   /**
    * Searches for an item that corresponds to given `value`
    * @param value
    * @return An item for given `value`
    */
  _valueToItem(value: string | number | undefined): HTMLElement | undefined;
  /**
   * A handler for the event which `type` is described as
   * `activateEvent`. By default it is a `ClickEvent`.
   */
  _activateHandler(e: Event): void;
  /**
   * Reads a value for an item in the `items` array for given index.
   * When `attrForSelected` is set then it returns attribute value for the item. If not
   * it returns the same index.
   *
   * @param index Index of an item in the `items` array
   * @returns A value for given index
   */
  _indexToValue(index: number): string | number | undefined;

  /**
   * Reads a value of an item depending on whether `attrForSelected` is set ot not.
   * When it's set then it returns attribute value for the item. If not
   * it returns the index of the item in the `items` array.
   *
   * @param item An item to get a value from.
   * @return A value for the passed item
   */
  _valueForItem(item: HTMLElement): string | number | undefined;
  /**
   * Applies selection state to an item. It updates class names
   * and selection attribute.
   * It also propagates selection change listeners.
   *
   * @param item The item to apply the state to
   * @param isSelected Whether the item is currently selected.
   */
  _applySelection(item: HTMLElement, isSelected: boolean): void;
  /**
   * Callback for a mutation event dispatched by the MutationObserver.
   * @param mutationsList List of mutations.
   */
  _mutationHandler(mutationsList: MutationRecord[]): void;
}

/**
 * Port of `@polymer/iron-selector/iron-selectable.js`.
 *
 * A mixin to be applied to a class where child elements can be selected.
 *
 * Note, by default the mixin works with LitElement. If used with different class
 * make sure that attributes are reflected to properties correctly.
 * @mixin
 * @fires deselect
 */
export const SelectableMixin = dedupeMixin(<T extends Constructor<HTMLElement>>(superClass: T): Constructor<SelectableMixinInterface> & T => {
  class MyMixinClass extends superClass {
    /**
     * This is a CSS selector string.  If this is set, only items that match the
     * CSS selector are selectable.
     */
    @property()
    selectable?: string;

    /**
     * The class to set on elements when selected.
     *
     * @default selected
     */
    selectedClass?: string;

    /**
     * The attribute to set on elements when selected.
     */
    selectedAttribute?: string;

    /**
     * If you want to use an attribute value or property of an element for
     * `selected` instead of the index, set this to the name of the attribute
     * or property. Hyphenated values are converted to camel case when used to
     * look up the property of a selectable element. Camel cased values are
     * *not* converted to hyphenated values for attribute lookup. It's
     * recommended that you provide the hyphenated form of the name so that
     * selection works in both cases. (Use `attr-or-property-name` instead of
     * `attrOrPropertyName`.)
     */
    @property()
    get attrForSelected(): string | undefined {
      return this._attrForSelected;
    }

    set attrForSelected(value: string | undefined) {
      const old = this._attrForSelected;
      /* istanbul ignore if */
      if (old === value) {
        return;
      }
      this._attrForSelected = value;
      this._updateAttrForSelected();
    }

    _attrForSelected?: string;

    /**
     * Gets or sets the selected element. The default is to use the index of the
     * item.
     * @attribute
     */
    @property()
    get selected(): string | number | undefined {
      return this._selected;
    }

    set selected(value: string | number | undefined) {
      const old = this._selected;
      /* istanbul ignore if */
      if (old === value) {
        return;
      }
      this._selected = value;
      /* istanbul ignore else */
      // @ts-ignore
      if (this.requestUpdate) {
        // @ts-ignore
        this.requestUpdate('selected', value);
      }
      this._updateSelected();
      this.dispatchEvent(new Event('selectedchange'));
    }

    _selected: string | number | undefined;

    __items: HTMLElement[] = [];

    /**
     * The list of items from which a selection can be made.
     */
    get items(): HTMLElement[] {
      return this._items;
    }

    @state()
    get _items(): HTMLElement[] {
      return this.__items;
    }

    set _items(value: HTMLElement[]) {
      const old = this.__items;
      /* istanbul ignore if */
      if (old === value) {
        return;
      }
      this.__items = value;
      /* istanbul ignore else */
      // @ts-ignore
      if (this.requestUpdate) {
        // @ts-ignore
        this.requestUpdate('_items', value);
      }
      this.dispatchEvent(new Event('itemschange'));
    }

    __selectedItem?: HTMLElement;

    get selectedItem(): HTMLElement | undefined {
      return this._selectedItem;
    }

    /**
     * Returns the currently selected item.
     */
    get _selectedItem(): HTMLElement | undefined {
      return this.__selectedItem;
    }

    set _selectedItem(value: HTMLElement | undefined) {
      const old = this.__selectedItem;
      /* istanbul ignore if */
      if (old === value) {
        return;
      }
      this.__selectedItem = value;
      /* istanbul ignore else */
      // @ts-ignore
      if (this.requestUpdate) {
        // @ts-ignore
        this.requestUpdate('_selectedItem', value);
      }
      this.dispatchEvent(new Event('selecteditemchange'));
    }

    _activateEvent = '';

    /**
     * The event that fires from items when they are selected. Selectable
     * will listen for this event from items and update the selection state.
     * Set to empty string to listen to no events.
     *
     * @default click
     */
    @property()
    get activateEvent(): string {
      return this._activateEvent;
    }

    set activateEvent(value: string) {
      const old = this._activateEvent;
      /* istanbul ignore if */
      if (old === value) {
        return;
      }
      this._activateEvent = value;
      this._activateEventChanged(value, old);
    }

    _fallbackSelection: string | number | undefined;

    /**
     * Default fallback if the selection based on selected with `attrForSelected` is not found.
     */
    @property()
    get fallbackSelection(): string | number | undefined {
      return this._fallbackSelection;
    }

    set fallbackSelection(value: string | number | undefined) {
      const old = this._fallbackSelection;
      /* istanbul ignore if */
      if (old === value) {
        return;
      }
      this._fallbackSelection = value;
      this._checkFallback();
    }

    /**
     * @return Previously registered handler for `selectedchange` event
     */
    get onselectedchange(): EventListener | undefined {
      return getListener('selectedchange', this);
    }

    /**
     * Registers a callback function for `selectedchange` event
     * @param value A callback to register. Pass `null` or `undefined`
     * to clear the listener.
     */
    set onselectedchange(value: EventListener | undefined) {
      addListener('selectedchange', value, this);
    }

    /**
     * @return Previously registered handler for `selectedchange` event
     */
    get onselected(): EventListener | undefined {
      return getListener('selected', this);
    }

    /**
     * Registers a callback function for `selected` event.
     * 
     * This event is dispatched only through user interaction (the activateEvent). Dispatched after the `select` event.
     * 
     * @param value A callback to register. Pass `null` or `undefined` to clear the listener.
     */
    set onselected(value: EventListener | undefined) {
      addListener('selected', value, this);
    }

    /**
     * @returns Previously registered handler for `selecteditemchange` event
     */
    get onselecteditemchange(): EventListener | undefined {
      return getListener('selecteditemchange', this);
    }

    /**
     * Registers a callback function for `selecteditemchange` event
     * @param value A callback to register. Pass `null` or `undefined`
     * to clear the listener.
     */
    set onselecteditemchange(value: EventListener | undefined) {
      addListener('selecteditemchange', value, this);
    }

    /**
     * @returns Previously registered handler for `itemschange` event
     */
    get onitemschange(): EventListener | undefined {
      return getListener('itemschange', this);
    }

    /**
     * Registers a callback function for `itemschange` event
     * @param value A callback to register. Pass `null` or `undefined`
     * to clear the listener.
     */
    set onitemschange(value: EventListener | undefined) {
      addListener('itemschange', value, this);
    }

    /**
     * @return Previously registered handler for `select` event
     */
    // @ts-ignore
    get onselect(): EventListener | undefined {
      return getListener('select', this);
    }

    /**
     * Registers a callback function for `select` event
     * @param value A callback to register. Pass `null` or `undefined`
     * to clear the listener.
     */
    // @ts-ignore
    set onselect(value: EventListener | undefined) {
      addListener('select', value, this);
    }

    /**
     * @return Previously registered handler for `deselect` event
     */
    get ondeselect(): EventListener | undefined {
      return getListener('deselect', this);
    }

    /**
     * Registers a callback function for `deselect` event
     * @param value A callback to register. Pass `null` or `undefined`
     * to clear the listener.
     */
    set ondeselect(value: EventListener | undefined) {
      addListener('deselect', value, this);
    }

    /**
     * @return Previously registered handler for `activate` event
     */
    get onactivate(): EventListener | undefined {
      return getListener('activate', this);
    }

    /**
     * Registers a callback function for `activate` event
     * @param value A callback to register. Pass `null` or `undefined`
     * to clear the listener.
     */
    set onactivate(value: EventListener | undefined) {
      addListener('activate', value, this);
    }

    _selection: AnypointSelection;

    _observer?: MutationObserver;

    constructor(...args: any[]) {
      super(...args);

      this.selectedClass = 'selected';
      this.activateEvent = 'click';

      this._activateHandler = this._activateHandler.bind(this);
      this._selection = new AnypointSelection(this._applySelection.bind(this));
      this._mutationHandler = this._mutationHandler.bind(this);
      this._slotchangeHandler = this._slotchangeHandler.bind(this);
    }

    connectedCallback(): void {
      /* istanbul ignore else */
      // @ts-ignore
      if (super.connectedCallback) {
        // @ts-ignore
        super.connectedCallback();
      }
      this._observer = this._observeItems();
      this._observeSlotItems();
      this._updateItems();
      this._updateSelected();
    }

    disconnectedCallback(): void {
      /* istanbul ignore else */
      // @ts-ignore
      if (super.disconnectedCallback) {
        // @ts-ignore
        super.disconnectedCallback();
      }
      if (this._observer) {
        this._observer.disconnect();
        this._observer = undefined;
      }
      this._removeListener(this.activateEvent);
      this._unobserveSlotItems();
    }

    _addListener(eventName: string): void {
      this.addEventListener(eventName, this._activateHandler);
    }

    _removeListener(eventName: string): void {
      this.removeEventListener(eventName, this._activateHandler);
    }

    /**
     * Observe items change in the element's light DOM
     * @return The observer handler
     */
    _observeItems(): MutationObserver {
      const config = { attributes: true, childList: true, subtree: false };
      const observer = new MutationObserver(this._mutationHandler);
      observer.observe(this, config);
      return observer;
    }

    /**
     * Observers changes in slot children where slot is in the light DOM.
     */
    _observeSlotItems(): void {
      const nodes = this.querySelectorAll('slot');
      for (let i = 0, len = nodes.length; i < len; i++) {
        nodes[i].addEventListener('slotchange', this._slotchangeHandler);
      }
    }

    /**
     * Removes change observers from slot children where slot is in the light DOM.
     */
    _unobserveSlotItems(): void {
      const nodes = this.querySelectorAll('slot');
      for (let i = 0, len = nodes.length; i < len; i++) {
        nodes[i].removeEventListener('slotchange', this._slotchangeHandler);
      }
    }

    /**
     * When light DOM mutate this method is called to remove listener from
     * removed `<slot>` children.
     * @param {NodeList} nodeList List of removed children.
     */
    _checkRemovedSlot(nodeList: NodeList): void {
      for (let i = 0, len = nodeList.length; i < len; i++) {
        if ((nodeList[i] as HTMLElement).localName === 'slot') {
          nodeList[i].removeEventListener(
            'slotchange',
            this._slotchangeHandler
          );
        }
      }
    }

    /**
     * Handler for the `slotchange` event dispatched on slot.
     * Updates items and selection.
     */
    _slotchangeHandler(): void {
      this._updateItems();
      this._updateSelected();
    }

    /**
     * Callback for a mutation event dispatched by the MutationObserver.
     * @param mutationsList List of mutations.
     */
    _mutationHandler(mutationsList: MutationRecord[]): void {
      this._updateItems();
      this._updateSelected();
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          this._checkRemovedSlot(mutation.removedNodes);
        }
      }
      // Let other interested parties know about the change so that
      // we don't have to recreate mutation observers everywhere.
      const config = {
        bubbles: true,
        composed: true,
        detail: mutationsList,
      };
      this.dispatchEvent(new CustomEvent('childrenchange', config));
    }

    /**
     * Returns the index of the given item.
     *
     * @return Returns the index of the item
     */
    indexOf(item: HTMLElement): number {
      return this.items ? this.items.indexOf(item) : -1;
    }

    /**
     * Selects the given value.
     *
     * @param value the value to select.
     */
    select(value: string | number | undefined): void {
      this.selected = value;
    }

    /**
     * Selects the previous item.
     *
     * @method selectPrevious
     */
    selectPrevious(): void {
      const { length } = this.items!;
      let index = length - 1;
      if (this.selected !== undefined) {
        index = (Number(this._valueToIndex(this.selected)) - 1 + length) % length;
      }
      this.selected = this._indexToValue(index);
    }

    /**
     * Selects the next item.
     *
     * @method selectNext
     */
    selectNext(): void {
      let index = 0;
      if (this.selected !== undefined) {
        index = (Number(this._valueToIndex(this.selected)) + 1) % this.items!.length;
      }
      this.selected = this._indexToValue(index);
    }

    /**
     * Selects the item at the given index.
     */
    selectIndex(index: number): void {
      this.select(this._indexToValue(index));
    }

    _checkFallback(): void {
      this._updateSelected();
    }

    _activateEventChanged(eventName: string, old: string): void {
      this._removeListener(old);
      this._addListener(eventName);
    }

    _updateItems(): void {
      let nodes = this._queryDistributedElements(this.selectable || '*');
      nodes = nodes.filter(filterItem);
      this._items = nodes as HTMLElement[];
    }

    _queryDistributedElements(selector: string): HTMLElement[] {
      const nodes = Array.from(this.children);
      // checks for slots and replaces a slot with it's nodes.
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.localName === 'slot') {
          const tmp = (node as HTMLSlotElement).assignedElements({
            flatten: true,
          });
          nodes.splice(i, 1, ...tmp);
        }
      }
      for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i];
        if (
          node.nodeType !== Node.ELEMENT_NODE
          || !matchesSelector(node, selector)
        ) {
          nodes.splice(i, 1);
        }
      }
      return nodes as HTMLElement[];
    }

    _updateAttrForSelected(): void {
      if (this.selectedItem) {
        this.selected = this._valueForItem(this.selectedItem);
      }
    }

    _updateSelected(): void {
      this._selectSelected(this.selected!);
    }

    /**
     * Applies selection to the `selected` item
     * @param {string|number} selected Currently selected value
     */
    _selectSelected(selected: string | number): void {
      if (!this.items) {
        return;
      }

      const item = this._valueToItem(selected);
      if (item) {
        this._selection.select(item);
      } else {
        this._selection.clear();
      }
      // Check for items, since this array is populated only when attached
      // Since Number(0) is falsy, explicitly check for undefined
      if (
        this.fallbackSelection
        && this.items.length
        && this._selection.get() === undefined
      ) {
        this.selected = this.fallbackSelection;
      }
    }

    /**
     * Searches for an item that corresponds to given `value`
     * @param value
     * @return An item for given `value`
     */
    _valueToItem(value: string | number | undefined): HTMLElement | undefined {
      return value === undefined ? undefined : this.items![this._valueToIndex(value)];
    }

    /**
     * Searches for an index that corresponds to given `value`
     * @param {string|number} value
     * @return {number} An index of the `value`
     */
    _valueToIndex(value: string | number): number {
      if (this.attrForSelected) {
        for (let i = 0, len = this.items!.length; i < len; i++) {
          const item = this.items![i];
          if (this._valueForItem(item) === value) {
            return i;
          }
        }
      }
      return Number(value);
    }

    /**
     * Reads a value for an item in the `items` array for given index.
     * When `attrForSelected` is set then it returns attribute value for the item. If not
     * it returns the same index.
     *
     * @param index Index of an item in the `items` array
     * @returns A value for given index
     */
    _indexToValue(index: number): string | number | undefined {
      if (this.attrForSelected) {
        const item = this.items![index];
        if (item) {
          return this._valueForItem(item);
        }
      }
      return index;
    }

    /**
     * Reads a value of an item depending on whether `attrForSelected` is set ot not.
     * When it's set then it returns attribute value for the item. If not
     * it returns the index of the item in the `items` array.
     *
     * @param item An item to get a value from.
     * @return A value for the passed item
     */
    _valueForItem(item: HTMLElement): string | number | undefined {
      if (!item) {
        return undefined;
      }
      if (!this.attrForSelected) {
        const i = this.indexOf(item);
        return i === -1 ? undefined : i;
      }
      const dash = this.attrForSelected;
      const prop = dash.indexOf('-') < 0
          ? dash
          : dash.replace(/-[a-z]/g, (m) => m[1].toUpperCase());
      // @ts-ignore
      const propValue = item[prop];
      return propValue !== undefined ? propValue : item.getAttribute(this.attrForSelected);
    }

    /**
     * Applies selection state to an item. It updates class names
     * and selection attribute.
     * It also propagates selection change listeners.
     *
     * @param item The item to apply the state to
     * @param isSelected Whether the item is currently selected.
     */
    _applySelection(item: HTMLElement, isSelected: boolean): void {
      const { selectedClass, selectedAttribute } = this;
      if (selectedClass) {
        toggleClass(selectedClass, isSelected, item);
      }
      if (selectedAttribute) {
        if (isSelected) {
          item.setAttribute(selectedAttribute, '');
        } else {
          item.removeAttribute(selectedAttribute);
        }
      }
      this._selectionChange();
      const opts = {
        bubbles: true,
        composed: true,
        detail: {
          item,
        },
      };
      const name = isSelected ? 'select' : 'deselect';
      this.dispatchEvent(new CustomEvent(name, opts));
    }

    /**
     * Applies current selection to the selected item.
     * Do not remove this function. It is used in multi selectable to
     * update multi selection.
     */
    _selectionChange(): void {
      this._selectedItem = this._selection.get() as HTMLElement | undefined;
    }

    /**
     * A handler for the event which `type` is described as
     * `activateEvent`. By default it is a `ClickEvent`.
     */
    _activateHandler(e: Event): void {
      let t = e.target as HTMLElement;
      const { items = [] } = this;
      while (t && t !== this) {
        const i = items.indexOf(t);
        if (i >= 0) {
          const value = this._indexToValue(i);
          this._itemActivate(value, t);
          return;
        }
        t = t.parentNode as HTMLElement;
      }
    }

    /**
     * Dispatches `activate` item and selects the item.
     *
     * @param value Selected value
     * @param item The selected item.
     */
    _itemActivate(value: number | string | undefined, item: HTMLElement): void {
      const opts = {
        cancelable: true,
        bubbles: true,
        composed: true,
        detail: {
          selected: value,
          item,
        },
      };
      const e = new CustomEvent('activate', opts);
      this.dispatchEvent(e);
      if (e.defaultPrevented) {
        return;
      }
      this.select(value);
      this.dispatchEvent(new Event('selected', { bubbles: true, composed: true, }));
    }
  }
  return MyMixinClass as Constructor<SelectableMixinInterface> & T;
});
