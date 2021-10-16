import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { AnypointSelection } from './AnypointSelection.js';

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
const normalizedMatchesSelector =
  p.matches ||
  // @ts-ignore
  p.matchesSelector ||
  // @ts-ignore
  p.mozMatchesSelector ||
  // @ts-ignore
  p.msMatchesSelector ||
  // @ts-ignore
  p.oMatchesSelector ||
  p.webkitMatchesSelector;
/**
 * Cross-platform `element.matches` shim.
 *
 * @function matchesSelector
 * @param {!Node} node Node to check selector against
 * @param {string} selector Selector to match
 * @return {boolean} True if node matched selector
 */
export const matchesSelector = (node, selector) => normalizedMatchesSelector.call(node, selector);

const filterItem = (node) => !excludedLocalNames[node.localName];

const toggleClass = (klass, selected, node) => {
  if (selected) {
    node.classList.add(klass);
  } else {
    node.classList.remove(klass);
  }
};

/**
 * @param {typeof HTMLElement} base
 */
const mxFunction = (base) => {
  class SelectableMixinImpl extends base {
    /**
     * Fired when anypoint-selector is activated (selected or deselected).
     * It is fired before the selected items are changed.
     * Cancel the event to abort selection.
     *
     * @event activate
     */

    /**
     * Fired when an item is selected
     *
     * @event select
     */

    /**
     * Fired when an item is deselected
     *
     * @event deselect
     */

    /**
     * Fired when the list of selectable items changes (e.g., items are
     * added or removed). The detail of the event is a mutation record that
     * describes what changed.
     *
     * @event children-changed
     */

    /**
     * Fired when anypoint-selector is activated (selected or deselected).
     * It is fired before the selected items are changed.
     * Cancel the event to abort selection.
     *
     * @event iron-activate
     * @deprecated Use `activate`instead. It is for compatibility with Polymer elements.
     */

    /**
     * Fired when an item is selected
     *
     * @event iron-select
     * @deprecated Use `select. It is for compatibility with Polymer elements.
     */

    /**
     * Fired when an item is deselected
     *
     * @event iron-deselect
     * @deprecated Use `deselect`instead. It is for compatibility with Polymer elements.
     */

    /**
     * Fired when the list of selectable items changes (e.g., items are
     * added or removed). The detail of the event is a mutation record that
     * describes what changed.
     *
     * @event iron-items-changed
     * @deprecated Use `children-changed`instead. It is for compatibility with Polymer elements.
     */

    static get properties() {
      return {
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
        attrForSelected: { type: String },

        /**
         * Gets or sets the selected element. The default is to use the index of the
         * item.
         */
        selected: {},

        /**
         * Returns the currently selected item.
         */
        _selectedItem: { type: Object },

        /**
         * The event that fires from items when they are selected. Selectable
         * will listen for this event from items and update the selection state.
         * Set to empty string to listen to no events.
         *
         * @default click
         */
        activateEvent: { type: String },

        /**
         * This is a CSS selector string.  If this is set, only items that match the
         * CSS selector are selectable.
         */
        selectable: { type: String },

        /**
         * The class to set on elements when selected.
         *
         * @default selected
         */
        selectedClass: { type: String },

        /**
         * The attribute to set on elements when selected.
         */
        selectedAttribute: { type: String },

        /**
         * Default fallback if the selection based on selected with `attrForSelected` is not found.
         */
        fallbackSelection: {},

        /**
         * The list of items from which a selection can be made.
         */
        items: { type: Array },
      };
    }

    get attrForSelected() {
      return this._attrForSelected;
    }

    set attrForSelected(value) {
      const old = this._attrForSelected;
      /* istanbul ignore if */
      if (old === value) {
        return;
      }
      this._attrForSelected = value;
      this._updateAttrForSelected();
    }

    get selected() {
      return this._selected;
    }

    set selected(value) {
      const old = this._selected;
      /* istanbul ignore if */
      if (old === value) {
        const detail = { bubbles: true, composed: true };
        this.dispatchEvent(new CustomEvent('closed', detail));
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
      this.dispatchEvent(
        new CustomEvent('selected-changed', {
          detail: {
            value,
          },
        })
      );
      // new events API. Keep the above for compatibility
      this.dispatchEvent(new CustomEvent('selectedchange'));
    }

    get items() {
      return this._items;
    }

    get _items() {
      return this.__items;
    }

    set _items(value) {
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
      this.dispatchEvent(
        new CustomEvent('items-changed', {
          detail: {
            value,
          },
        })
      );
      // new events API. Keep the above for compatibility
      this.dispatchEvent(new CustomEvent('itemschange'));
    }

    get selectedItem() {
      return this._selectedItem;
    }

    get _selectedItem() {
      return this.__selectedItem;
    }

    set _selectedItem(value) {
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
      this.dispatchEvent(
        new CustomEvent('selecteditem-changed', {
          detail: {
            value,
          },
        })
      );
      // new events API. Keep the above for compatibility
      this.dispatchEvent(new CustomEvent('selecteditemchange'));
    }

    get activateEvent() {
      return this._activateEvent;
    }

    set activateEvent(value) {
      const old = this._activateEvent;
      /* istanbul ignore if */
      if (old === value) {
        return;
      }
      this._activateEvent = value;
      this._activateEventChanged(value, old);
    }

    get fallbackSelection() {
      return this._fallbackSelection;
    }

    set fallbackSelection(value) {
      const old = this._fallbackSelection;
      /* istanbul ignore if */
      if (old === value) {
        return;
      }
      this._fallbackSelection = value;
      this._checkFallback();
    }

    /**
     * @return {EventListener} Previously registered handler for `selected-changed` event
     */
    get onselectedchanged() {
      return this['_onselected-changed'];
    }

    /**
     * Registers a callback function for `selected-changed` event
     * @param {EventListener} value A callback to register. Pass `null` or `undefined`
     * to clear the listener.
     */
    set onselectedchanged(value) {
      this._registerCallback('selected-changed', value);
    }

    /**
     * @return {EventListener} Previously registered handler for `selected-changed` event
     */
    get onselectedchange() {
      return this._onselectedchange;
    }

    /**
     * Registers a callback function for `selectedchange` event
     * @param {EventListener} value A callback to register. Pass `null` or `undefined`
     * to clear the listener.
     */
    set onselectedchange(value) {
      this._registerCallback('selectedchange', value);
    }

    /**
     * @return {EventListener} Previously registered handler for `selected-changed` event
     */
    get onselected() {
      return this._onselected;
    }

    /**
     * Registers a callback function for `selected` event.
     * 
     * This event is dispatched only through user interaction (the activateEvent). Dispatched after the `select` event.
     * 
     * @param {EventListener} value A callback to register. Pass `null` or `undefined` to clear the listener.
     */
    set onselected(value) {
      this._registerCallback('selected', value);
    }

    /**
     * @return {EventListener} Previously registered handler for `selectedchange` event
     */
    get onselecteditemchanged() {
      return this['_onselecteditem-changed'];
    }

    /**
     * Registers a callback function for `selecteditem-changed` event
     * @param {EventListener} value A callback to register. Pass `null` or `undefined`
     * to clear the listener.
     */
    set onselecteditemchanged(value) {
      this._registerCallback('selecteditem-changed', value);
    }

    /**
     * @return {EventListener} Previously registered handler for `selecteditemchange` event
     */
    get onselecteditemchange() {
      return this._onselecteditemchange;
    }

    /**
     * Registers a callback function for `selecteditemchange` event
     * @param {EventListener} value A callback to register. Pass `null` or `undefined`
     * to clear the listener.
     */
    set onselecteditemchange(value) {
      this._registerCallback('selecteditemchange', value);
    }

    /**
     * @return {EventListener} Previously registered handler for `items-changed` event
     */
    get onitemschanged() {
      return this['_onitems-changed'];
    }

    /**
     * Registers a callback function for `items-changed` event
     * @param {EventListener} value A callback to register. Pass `null` or `undefined`
     * to clear the listener.
     */
    set onitemschanged(value) {
      this._registerCallback('items-changed', value);
    }

    /**
     * @return {EventListener} Previously registered handler for `itemschange` event
     */
    get onitemschange() {
      return this._onitemschange;
    }

    /**
     * Registers a callback function for `itemschange` event
     * @param {EventListener} value A callback to register. Pass `null` or `undefined`
     * to clear the listener.
     */
    set onitemschange(value) {
      this._registerCallback('itemschange', value);
    }

    /**
     * @return {EventListener} Previously registered handler for `select` event
     */
    get onselect() {
      // @ts-ignore
      return this._onselect;
    }

    /**
     * Registers a callback function for `select` event
     * @param {EventListener} value A callback to register. Pass `null` or `undefined`
     * to clear the listener.
     */
    set onselect(value) {
      this._registerCallback('select', value);
    }

    /**
     * @return {EventListener} Previously registered handler for `deselect` event
     */
    get ondeselect() {
      // @ts-ignore
      return this._ondeselect;
    }

    /**
     * Registers a callback function for `deselect` event
     * @param {EventListener} value A callback to register. Pass `null` or `undefined`
     * to clear the listener.
     */
    set ondeselect(value) {
      this._registerCallback('deselect', value);
    }

    /**
     * @return {EventListener} Previously registered handler for `activate` event
     */
    get onactivate() {
      // @ts-ignore
      return this._onactivate;
    }

    /**
     * Registers a callback function for `activate` event
     * @param {EventListener} value A callback to register. Pass `null` or `undefined`
     * to clear the listener.
     */
    set onactivate(value) {
      this._registerCallback('activate', value);
    }

    constructor() {
      super();
      this.attrForSelected = null;
      this.fallbackSelection = null;
      this.selectedAttribute = null;
      this.selectable = null;
      this.selectedClass = 'selected';
      this.activateEvent = 'click';
      this._items = [];

      this._activateHandler = this._activateHandler.bind(this);
      this._selection = new AnypointSelection(this._applySelection.bind(this));
      this._mutationHandler = this._mutationHandler.bind(this);
      this._slotchangeHandler = this._slotchangeHandler.bind(this);

      this._onselectedchange = null;
      this._onselecteditemchange = null;
      this._onitemschange = null;
      this._onselected = null;
    }

    connectedCallback() {
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

    disconnectedCallback() {
      /* istanbul ignore else */
      // @ts-ignore
      if (super.disconnectedCallback) {
        // @ts-ignore
        super.disconnectedCallback();
      }
      if (this._observer) {
        this._observer.disconnect();
        this._observer = null;
      }
      this._removeListener(this.activateEvent);
      this._unobserveSlotItems();
    }

    /**
     * Registers an event handler for given type
     * @param {String} eventType Event type (name)
     * @param {EventListener} value The handler to register
     */
    _registerCallback(eventType, value) {
      const key = `_on${eventType}`;
      if (this[key]) {
        this.removeEventListener(eventType, this[key]);
      }
      if (typeof value !== 'function') {
        this[key] = null;
        return;
      }
      this[key] = value;
      this.addEventListener(eventType, value);
    }

    _addListener(eventName) {
      this.addEventListener(eventName, this._activateHandler);
    }

    _removeListener(eventName) {
      this.removeEventListener(eventName, this._activateHandler);
    }

    /**
     * Observe items change in the element's light DOM
     * @return {MutationObserver} The observer handler
     */
    _observeItems() {
      const config = { attributes: true, childList: true, subtree: false };
      const observer = new MutationObserver(this._mutationHandler);
      observer.observe(this, config);
      return observer;
    }

    /**
     * Observers changes in slot children where slot is in the light DOM.
     */
    _observeSlotItems() {
      const nodes = this.querySelectorAll('slot');
      for (let i = 0, len = nodes.length; i < len; i++) {
        nodes[i].addEventListener('slotchange', this._slotchangeHandler);
      }
    }

    /**
     * Removes change observers from slot children where slot is in the light DOM.
     */
    _unobserveSlotItems() {
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
    _checkRemovedSlot(nodeList) {
      for (let i = 0, len = nodeList.length; i < len; i++) {
        if (/** @type HTMLElement */ (nodeList[i]).localName === 'slot') {
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
    _slotchangeHandler() {
      this._updateItems();
      this._updateSelected();
    }

    /**
     * Callback for a mutation event dispatched by the MutationObserver.
     * @param {MutationRecord[]} mutationsList List of mutations.
     */
    _mutationHandler(mutationsList) {
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
      this.dispatchEvent(new CustomEvent('children-changed', config));
      this.dispatchEvent(new CustomEvent('iron-items-changed', config));
    }

    /**
     * Returns the index of the given item.
     *
     * @method indexOf
     * @param {*} item
     * @return {number} Returns the index of the item
     */
    indexOf(item) {
      return this.items ? this.items.indexOf(item) : -1;
    }

    /**
     * Selects the given value.
     *
     * @method select
     * @param {string|number} value the value to select.
     */
    select(value) {
      this.selected = value;
    }

    /**
     * Selects the previous item.
     *
     * @method selectPrevious
     */
    selectPrevious() {
      const { length } = this.items;
      let index = length - 1;
      if (this.selected !== undefined) {
        index =
          (Number(this._valueToIndex(this.selected)) - 1 + length) % length;
      }
      this.selected = this._indexToValue(index);
    }

    /**
     * Selects the next item.
     *
     * @method selectNext
     */
    selectNext() {
      let index = 0;
      if (this.selected !== undefined) {
        index =
          (Number(this._valueToIndex(this.selected)) + 1) % this.items.length;
      }
      this.selected = this._indexToValue(index);
    }

    /**
     * Selects the item at the given index.
     *
     * @method selectIndex
     * @param {Number} index
     */
    selectIndex(index) {
      this.select(this._indexToValue(index));
    }

    _checkFallback() {
      this._updateSelected();
    }

    /**
     * @param {string} eventName [description]
     * @param {string} old
     */
    _activateEventChanged(eventName, old) {
      this._removeListener(old);
      this._addListener(eventName);
    }

    _updateItems() {
      let nodes = this._queryDistributedElements(this.selectable || '*');
      nodes = nodes.filter(filterItem);
      this._items = /** @type HTMLElement[] */ (nodes);
    }

    /**
     * @param {string} selector
     * @return {HTMLElement[]}
     */
    _queryDistributedElements(selector) {
      const nodes = Array.from(this.children);
      // checks for slots and replaces a slot with it's nodes.
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.localName === 'slot') {
          const tmp = /** @type HTMLSlotElement */ (node).assignedElements({
            flatten: true,
          });
          nodes.splice(i, 1, ...tmp);
        }
      }
      for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i];
        if (
          node.nodeType !== Node.ELEMENT_NODE ||
          !matchesSelector(node, selector)
        ) {
          nodes.splice(i, 1);
        }
      }
      return /** @type HTMLElement[] */ (nodes);
    }

    _updateAttrForSelected() {
      if (this.selectedItem) {
        this.selected = this._valueForItem(this.selectedItem);
      }
    }

    _updateSelected() {
      this._selectSelected(this.selected);
    }

    /**
     * Applies selection to the `selected` item
     * @param {string|number} selected Currently selected value
     */
    _selectSelected(selected) {
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
        this.fallbackSelection &&
        this.items.length &&
        this._selection.get() === undefined
      ) {
        this.selected = this.fallbackSelection;
      }
    }

    /**
     * Searches for an item that corresponds to given `value`
     * @param {string|number} value
     * @return {HTMLElement} An item for given `value`
     */
    _valueToItem(value) {
      return value === null ? null : this.items[this._valueToIndex(value)];
    }

    /**
     * Searches for an index that corresponds to given `value`
     * @param {string|number} value
     * @return {number} An index of the `value`
     */
    _valueToIndex(value) {
      if (this.attrForSelected) {
        for (let i = 0, len = this.items.length; i < len; i++) {
          const item = this.items[i];
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
     * @param {number} index Index of an item in the `items` array
     * @return {string|number|null} A value for given index
     */
    _indexToValue(index) {
      if (this.attrForSelected) {
        const item = this.items[index];
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
     * @param {HTMLElement} item An item to get a value from.
     * @return {string|number|null} A value for the passed item
     */
    _valueForItem(item) {
      if (!item) {
        return null;
      }
      if (!this.attrForSelected) {
        const i = this.indexOf(item);
        return i === -1 ? null : i;
      }
      const dash = this.attrForSelected;
      const prop =
        dash.indexOf('-') < 0
          ? dash
          : dash.replace(/-[a-z]/g, (m) => m[1].toUpperCase());
      const propValue = item[prop];
      return propValue !== undefined
        ? propValue
        : item.getAttribute(this.attrForSelected);
    }

    /**
     * Applies selection state to an item. It updates class names
     * and selection attribute.
     * It also propagates selection change listeners.
     *
     * @param {HTMLElement} item The item to apply the state to
     * @param {Boolean} isSelected Whether the item is currently selected.
     */
    _applySelection(item, isSelected) {
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
      this.dispatchEvent(new CustomEvent(`iron-${name}`, opts));
    }

    /**
     * Applies current selection to the selected item.
     * Do not remove this function. It is used in multi selectable to
     * update multi selection.
     */
    _selectionChange() {
      this._selectedItem = this._selection.get();
    }

    /**
     * A handler for the event which `type` is described as
     * `activateEvent`. By default it is a `ClickEvent`.
     *
     * @param {Event} e
     */
    _activateHandler(e) {
      let t = /** @type HTMLElement */ (e.target);
      const { items } = this;
      while (t && t !== this) {
        const i = items.indexOf(t);
        if (i >= 0) {
          const value = this._indexToValue(i);
          this._itemActivate(value, t);
          return;
        }
        t = /** @type HTMLElement */ (t.parentNode);
      }
    }

    /**
     * Dispatches `activate` item and selects the item.
     *
     * @param {number|string|null} value Selected value
     * @param {HTMLElement} item The selected item.
     */
    _itemActivate(value, item) {
      const opts = {
        cancelable: true,
        bubbles: true,
        composed: true,
        detail: {
          selected: value,
          item,
        },
      };
      let e = new CustomEvent('activate', opts);
      this.dispatchEvent(e);
      if (e.defaultPrevented) {
        return;
      }
      // compatibility with polymer based components
      e = new CustomEvent('iron-activate', opts);
      this.dispatchEvent(e);
      if (e.defaultPrevented) {
        return;
      }
      this.select(value);
      this.dispatchEvent(new CustomEvent('selected'));
    }
  }
  return SelectableMixinImpl;
};

/**
 * Port of `@polymer/iron-selector/iron-selectable.js`.
 *
 * A mixin to be applied to a class where child elements can be selected.
 *
 * Note, by default the mixin works with LitElement. If used with different class
 * make sure that attributes are reflected to properties correctly.
 * @mixin
 */
export const SelectableMixin = dedupeMixin(mxFunction);
