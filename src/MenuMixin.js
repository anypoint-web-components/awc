import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { MultiSelectableMixin } from '@anypoint-web-components/anypoint-selector';
/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
/**
 * The list of keys has been taken from
 * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState
 * @private
 */
const MODIFIER_KEYS = [
  'Alt',
  'AltGraph',
  'CapsLock',
  'Control',
  'Fn',
  'FnLock',
  'Hyper',
  'Meta',
  'NumLock',
  'OS',
  'ScrollLock',
  'Shift',
  'Super',
  'Symbol',
  'SymbolLock',
];

const SEARCH_RESET_TIMEOUT_MS = 1000;

export const highlightedItem = '__highlighteditem';
export const highlightedItemValue = '__highlighteditemvalue';

/**
 * @param {typeof HTMLElement} base
 * @mixes MultiSelectableMixin
 */
const mxFunction = (base) => {
  class MenuMixinImpl extends MultiSelectableMixin(base) {
    static get properties() {
      return {
        /**
         * Currently focused in the menu item.
         */
        _focusedItem: { type: Object },
        /**
         * The attribute to use on menu items to look up the item title. Typing the
         * first letter of an item when the menu is open focuses that item. If
         * unset, `textContent` will be used.
         */
        attrForItemTitle: { type: String },

        /**
         * Whether or not this menu is disabled.
         */
        disabled: { type: Boolean },

        _previousTabIndex: { type: Number },
        /**
         * When set it adds `aria-selected` attribute to currently selected item.
         *
         * The `aria-selected` attribute is invalid with default role of this
         * element ("menu"). If you manually change the role to some other that
         * accepts `aria-selected` attribute on children then set this property.
         */
        useAriaSelected: { type: Boolean },
        /**
         * When set the effect of calling `highlightNext()` or `highlightPrevious()`
         * will be setting `aria-selected` attribute. For proper accessibility use
         * with the combination with `useAriaSelected` attribute.
         */
        highlightAriaSelected: { type: Boolean },
      };
    }

    /**
     * @return {HTMLElement=} The currently focused item.
     */
    get focusedItem() {
      return this._focusedItem;
    }

    get _focusedItem() {
      return this.__focusedItem;
    }

    set _focusedItem(value) {
      const old = this.__focusedItem;
      /* istanbul ignore if */
      if (old === value) {
        return;
      }
      this.__focusedItem = value;
      this._focusedItemChanged(value, old);
    }

    get disabled() {
      return this._disabled;
    }

    set disabled(value) {
      const old = this._disabled;
      /* istanbul ignore if */
      if (old === value) {
        return;
      }
      this._disabled = value;
      /* istanbul ignore else */
      // @ts-ignore
      if (this.requestUpdate) {
        // @ts-ignore
        this.requestUpdate('disabled', value);
      }
      this._disabledChanged(value);
    }

    /**
     * @return {HTMLElement|null} Currently highlighted item.
     */
    get highlightedItem() {
      return this.__highlighteditem;
    }

    /**
     * @return {HTMLElement|null} Currently highlighted item (private)
     */
    get __highlighteditem() {
      return this.__highlighteditemvalue || null;
    }

    /**
     * Sets the highlighted item. The item has to be one of the current items.
     * @param {HTMLElement} value The element to set
     */
    set __highlighteditem(value) {
      const old = /** @type HTMLElement */ (this.__highlighteditemvalue);
      if (old === value) {
        return;
      }
      this.__highlighteditemvalue = value;
      const aria = this.highlightAriaSelected;
      if (old) {
        old.classList.remove('highlight');
        if (aria) {
          old.setAttribute('aria-selected', 'false');
        }
      }
      if (value) {
        value.classList.add('highlight');
        if (aria) {
          value.setAttribute('aria-selected', 'true');
        }
      }
    }

    constructor() {
      super();
      this._previousTabIndex = 0;
      this.useAriaSelected = false;
      this.highlightAriaSelected = false;
      this.attrForItemTitle = undefined;

      this._onFocus = this._onFocus.bind(this);
      this._onKeydown = this._onKeydown.bind(this);
      this._onItemsChanged = this._onItemsChanged.bind(this);
    }

    connectedCallback() {
      /* istanbul ignore else */
      // @ts-ignore
      if (super.connectedCallback) {
        // @ts-ignore
        super.connectedCallback();
      }
      if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'menu');
      }
      this.addEventListener('focus', this._onFocus);
      this.addEventListener('keydown', this._onKeydown);
      this.addEventListener('children-changed', this._onItemsChanged);

      if (this._disabled === undefined) {
        this.disabled = false;
      }

      this._resetTabindices();
    }

    disconnectedCallback() {
      /* istanbul ignore else */
      // @ts-ignore
      if (super.disconnectedCallback) {
        // @ts-ignore
        super.disconnectedCallback();
      }
      this.removeEventListener('focus', this._onFocus);
      this.removeEventListener('keydown', this._onKeydown);
      this.removeEventListener('children-changed', this._onItemsChanged);
    }

    _multiChanged(value) {
      super._multiChanged(value);
      if (value) {
        this.setAttribute('aria-multiselectable', 'true');
      } else {
        this.removeAttribute('aria-multiselectable');
      }
    }

    _onItemsChanged(e) {
      const mutationsList = e.detail;
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          this._resetTabindices();
        }
      }
    }

    /**
     * Handler for the keydown event.
     * @param {KeyboardEvent} e
     */
    _onKeydown(e) {
      if (e.code === 'ArrowDown') {
        this._onDownKey(e);
      } else if (e.code === 'ArrowUp') {
        this._onUpKey(e);
      } else if (e.code === 'Tab' && e.shiftKey) {
        this._onShiftTabDown();
      } else if (e.code === 'Escape') {
        this._onEscKey();
      } else {
        this._focusWithKeyboardEvent(e);
      }
      e.stopPropagation();
    }

    /**
     * Handler that is called when the up key is pressed.
     *
     * @param {KeyboardEvent} e A key combination event.
     */
    _onUpKey(e) {
      this.focusPrevious();
      e.preventDefault();
    }

    /**
     * Handler that is called when the down key is pressed.
     *
     * @param {KeyboardEvent} e A key combination event.
     */
    _onDownKey(e) {
      e.preventDefault();
      e.stopPropagation();
      this.focusNext();
    }

    /**
     * Handler that is called when the esc key is pressed.
     */
    _onEscKey() {
      const { focusedItem } = this;
      if (focusedItem) {
        /** @type HTMLElement */ (focusedItem).blur();
      }
    }

    /**
     * @param {KeyboardEvent} e 
     */
    _focusWithKeyboardEvent(e) {
      // Make sure that the key pressed is not a modifier key.
      // getModifierState is not being used, as it is not available in Safari
      // earlier than 10.0.2 (https://trac.webkit.org/changeset/206725/webkit)
      if (MODIFIER_KEYS.indexOf(e.key) !== -1) {
        return;
      }
      if (this._clearSearchTextDebouncer) {
        clearTimeout(this._clearSearchTextDebouncer);
        this._clearSearchTextDebouncer = undefined;
      }
      let searchText = this._searchText || '';
      const key = e.key && e.key.length === 1 ? e.key : String.fromCharCode(e.keyCode);
      searchText += key.toLocaleLowerCase();

      const searchLength = searchText.length;
      for (let i = 0, len = this.items.length; i < len; i++) {
        const item = this.items[i];
        if (item.hasAttribute('disabled')) {
          continue;
        }

        const attr = this.attrForItemTitle || 'textContent';
        const title = (item[attr] || item.getAttribute(attr) || '').trim();

        if (title.length < searchLength) {
          continue;
        }

        if (title.slice(0, searchLength).toLocaleLowerCase() === searchText) {
          this._focusedItem = item;
          break;
        }
      }

      this._searchText = searchText;
      this._clearSearchTextDebouncer = setTimeout(
        () => this._clearSearchText(),
        SEARCH_RESET_TIMEOUT_MS
      );
    }

    _clearSearchText() {
      this._searchText = '';
    }

    /**
     * Resets all tabindex attributes to the appropriate value based on the
     * current selection state. The appropriate value is `0` (focusable) for
     * the default selected item, and `-1` (not keyboard focusable) for all
     * other items. Also sets the correct initial values for aria-selected
     * attribute, true for default selected item and false for others.
     */
    _resetTabindices() {
      const firstSelectedItem = this.multi
        ? this.selectedItems && this.selectedItems[0]
        : this.selectedItem;
      const aria = this.useAriaSelected;
      this.items.forEach((item) => {
        item.setAttribute('tabindex', item === firstSelectedItem ? '0' : '-1');
        if (aria) {
          const value = this._selection.isSelected(item);
          item.setAttribute('aria-selected', String(value));
        }
      });
    }

    /**
     * Selects the given value. If the `multi` property is true, then the selected
     * state of the `value` will be toggled; otherwise the `value` will be
     * selected.
     *
     * @param {string|number} value the value to select.
     */
    select(value) {
      const item = this._valueToItem(value);
      if (item && item.hasAttribute('disabled')) {
        return;
      }
      this._focusedItem = item;
      super.select(value);
    }

    /**
     * Focuses the previous item (relative to the currently focused item) in the
     * menu, disabled items will be skipped.
     * Loop until length + 1 to handle case of single item in menu.
     */
    focusPrevious() {
      const { length } = this.items;
      const curFocusIndex = Number(this.indexOf(this.focusedItem));

      for (let i = 1; i < length + 1; i++) {
        const item = this.items[(curFocusIndex - i + length) % length];
        if (!item.hasAttribute('disabled')) {
          const owner = (item.getRootNode && item.getRootNode()) || document;
          this._focusedItem = item;
          // Focus might not have worked, if the element was hidden or not
          // focusable. In that case, try again.
          // @ts-ignore
          if (owner.activeElement === item) {
            return;
          }
        }
      }
    }

    /**
     * @deprecated Please, use `focusPrevious()` instead.
     */
    _focusPrevious() {
      this.focusPrevious();
    }

    /**
     * Focuses the next item (relative to the currently focused item) in the
     * menu, disabled items will be skipped.
     */
    focusNext() {
      const { length } = this.items;
      const curFocusIndex = Number(this.indexOf(this.focusedItem));
      for (let i = 1; i < length + 1; i++) {
        const item = this.items[(curFocusIndex + i) % length];
        if (!item.hasAttribute('disabled')) {
          const owner = (item.getRootNode && item.getRootNode()) || document;
          this._focusedItem = item;
          // Focus might not have worked, if the element was hidden or not
          // focusable. In that case, try again.
          // @ts-ignore
          if (owner.activeElement === item) {
            return;
          }
        }
      }
    }

    /**
     * @deprecated Please, use `focusNext()` instead.
     */
    _focusNext() {
      this.focusNext();
    }

    /**
     * Highlights, by setting the `highlight` css class, the next availabl element.
     * If there's no highlighted item but there is a selection (focused item)
     * then a next item after the selection is selected.
     */
    highlightNext() {
      const { items } = this;
      const { length } = items;
      if (!length) {
        return;
      }
      let curIndex = Number(this.indexOf(this.highlightedItem));
      if (curIndex === -1) {
        curIndex = Number(this.indexOf(this.focusedItem));
      }
      for (let i = 1; i < length + 1; i++) {
        const item = items[(curIndex + i) % length];
        if (item.hasAttribute('disabled')) {
          continue;
        }
        this.__highlighteditem = item;
        break;
      }
    }

    /**
     * Highlights, by setting the `highlight` css class, the previous availabl element.
     * If there's no highlighted item but there is a selection (focused item)
     * then a previous item before the selection is selected.
     */
    highlightPrevious() {
      const { items } = this;
      const { length } = items;
      if (!length) {
        return;
      }
      let curIndex = Number(this.indexOf(this.highlightedItem));
      if (curIndex === -1) {
        curIndex = Number(this.indexOf(this.focusedItem));
      }
      if (curIndex === -1) {
        curIndex = 0;
      }
      for (let i = 1; i < length + 1; i++) {
        const item = this.items[(curIndex - i + length) % length];
        if (item.hasAttribute('disabled')) {
          continue;
        }
        this.__highlighteditem = item;
        break;
      }
    }

    /**
     * Mutates items in the menu based on provided selection details, so that
     * all items correctly reflect selection state.
     *
     * @param {HTMLElement} item An item in the menu.
     * @param {boolean} isSelected True if the item should be shown in a
     * selected state, otherwise false.
     */
    _applySelection(item, isSelected) {
      if (this.useAriaSelected) {
        if (isSelected) {
          item.setAttribute('aria-selected', 'true');
        } else {
          item.setAttribute('aria-selected', 'false');
        }
      }
      super._applySelection(item, isSelected);
    }

    /**
     * Discretely updates tabindex values among menu items as the focused item
     * changes.
     *
     * @param {HTMLElement} focusedItem The element that is currently focused.
     * @param {HTMLElement?} old The last element that was considered focused, if
     * applicable.
     */
    _focusedItemChanged(focusedItem, old) {
      if (old) {
        old.setAttribute('tabindex', '-1');
      }
      if (
        focusedItem &&
        !focusedItem.hasAttribute('disabled') &&
        !this.disabled
      ) {
        focusedItem.setAttribute('tabindex', '0');
        focusedItem.focus();
      }
    }

    /**
     * Handler that is called when a shift+tab keypress is detected by the menu.
     */
    _onShiftTabDown() {
      const oldTabIndex = this.getAttribute('tabindex');

      this._shiftTabPressed = true;

      this._focusedItem = null;

      this.setAttribute('tabindex', '-1');

      setTimeout(() => {
        this.setAttribute('tabindex', oldTabIndex);
        this._shiftTabPressed = false;
        // NOTE(cdata): polymer/polymer#1305
      }, 1);
    }

    _onFocus(e) {
      if (this._shiftTabPressed) {
        // do not focus the menu itself
        return;
      }
      let path = e.composedPath && e.composedPath();
      if (!path) {
        path = e.path;
      }
      const rootTarget = path[0];
      if (
        rootTarget !== this &&
        typeof rootTarget.tabIndex !== 'undefined' &&
        !this.contains(rootTarget)
      ) {
        return;
      }
      // focus the selected item when the menu receives focus, or the first item
      // if no item is selected
      const firstSelectedItem = this.multi
        ? this.selectedItems && this.selectedItems[0]
        : this.selectedItem;

      this._focusedItem = null;

      if (firstSelectedItem) {
        this._focusedItem = firstSelectedItem;
      } else if (this.items.length) {
        // We find the first none-disabled item (if one exists)
        this._focusNext();
      }
    }

    _activateHandler(e) {
      super._activateHandler(e);
      e.stopPropagation();
    }

    _disabledChanged(disabled) {
      if (disabled) {
        this._previousTabIndex = this.hasAttribute('tabindex')
          ? this.tabIndex
          : 0;
        this.removeAttribute('tabindex'); // No tabindex means not tab-able or select-able.
      } else if (!this.hasAttribute('tabindex')) {
        this.setAttribute('tabindex', String(this._previousTabIndex));
      }
    }
  }
  return MenuMixinImpl;
};

/**
 * Port of `@polymer/iron-selector/iron-multi-selectable.js`.
 *
 * A mixin to be applied to a class where child elements can be selected and selection
 * can be applied to more than one item.
 *
 * Note, by default the mixin works with LitElement. If used with different class
 * make sure that attributes are reflected to properties correctly.
 * @mixin
 */
export const MenuMixin = dedupeMixin(mxFunction);
