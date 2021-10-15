import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { SelectableMixin } from './SelectableMixin.js';

/* eslint-disable no-plusplus */

/**
 * @param {typeof HTMLElement} base
 * @mixes SelectableMixin
 */
const mxFunction = (base) => {
  class MultiSelectableMixinImpl extends SelectableMixin(base) {
    static get properties() {
      return {
        /**
         * If true, multiple selections are allowed.
         * @attribute
         */
        multi: { type: Boolean },
        /**
         * Gets or sets the selected elements. This is used instead of `selected`
         * when `multi` is true.
         */
        selectedValues: { type: Array },
        _selectedItems: { type: Array },
      };
    }

    get multi() {
      return this._multi;
    }

    set multi(value) {
      const old = this._multi;
      /* istanbul ignore if */
      if (old === value) {
        return;
      }
      this._multi = value;
      this._multiChanged(value);
    }

    get selectedValues() {
      return this._selectedValues;
    }

    set selectedValues(value) {
      const old = this._selectedValues;
      /* istanbul ignore if */
      if (old === value) {
        return;
      }
      this._selectedValues = value;
      this._updateSelected();
      this.dispatchEvent(
        new CustomEvent('selectedvalues-changed', {
          detail: {
            value,
          },
        })
      );
      // new events API. Keep the above for compatibility
      this.dispatchEvent(new CustomEvent('selectedvalueschange'));
    }

    /**
     * @return {any[]} An array of currently selected items.
     */
    get selectedItems() {
      return this._selectedItems;
    }

    get _selectedItems() {
      return this.__selectedItems;
    }

    set _selectedItems(value) {
      const old = this.__selectedItems;
      /* istanbul ignore if */
      if (old === value) {
        return;
      }
      this.__selectedItems = value;
      this.dispatchEvent(
        new CustomEvent('selecteditems-changed', {
          detail: {
            value,
          },
        })
      );
      // new events API. Keep the above for compatibility
      this.dispatchEvent(new CustomEvent('selecteditemschange'));
    }

    /**
     * @return {EventListener} Previously registered handler for `selectedvalues-changed` event
     */
    get onselectedvalueschanged() {
      return this['_onselectedvalues-changed'];
    }

    /**
     * Registers a callback function for `selectedvalues-changed` event
     * @param {EventListener} value A callback to register. Pass `null` or `undefined`
     * to clear the listener.
     */
    set onselectedvalueschanged(value) {
      this._registerCallback('selectedvalues-changed', value);
    }

    /**
     * @return {EventListener} Previously registered handler for `selectedvalueschange` event
     */
    get onselectedvalueschange() {
      return this._onselectedvalueschange;
    }

    /**
     * Registers a callback function for `selectedvalueschange` event
     * @param {EventListener} value A callback to register. Pass `null` or `undefined`
     * to clear the listener.
     */
    set onselectedvalueschange(value) {
      this._registerCallback('selectedvalueschange', value);
    }

    /**
     * @return {EventListener} Previously registered handler for `selecteditems-changed` event
     */
    get onselecteditemschanged() {
      return this['_onselecteditems-changed'];
    }

    /**
     * Registers a callback function for `selecteditems-changed` event
     * @param {EventListener} value A callback to register. Pass `null` or `undefined`
     * to clear the listener.
     */
    set onselecteditemschanged(value) {
      this._registerCallback('selecteditems-changed', value);
    }

    /**
     * @return {EventListener} Previously registered handler for `selecteditemschange` event
     */
    get onselecteditemschange() {
      return this._onselecteditemschange;
    }

    /**
     * Registers a callback function for `selecteditemschange` event
     * @param {EventListener} value A callback to register. Pass `null` or `undefined`
     * to clear the listener.
     */
    set onselecteditemschange(value) {
      this._registerCallback('selecteditemschange', value);
    }

    constructor() {
      super();
      this.multi = false;
      this._selectedValues = [];
      this._selectedItems = [];
      this._onselectedvalueschange = null;
      this._onselecteditemschange = null;
    }

    /**
     * Selects the given value. If the `multi` property is true, then the selected
     * state of the `value` will be toggled; otherwise the `value` will be
     * selected.
     *
     * @method select
     * @param {string|number} value the value to select.
     */
    select(value) {
      if (this.multi) {
        this._toggleSelected(value);
      } else {
        this.selected = value;
      }
    }

    /**
     * @param {boolean} multi Current value of `multi` property
     * @deprecated Don't use this function.
     */
    multiChanged(multi) {
      this._multiChanged(multi);
    }

    _multiChanged(multi) {
      this._selection.multi = multi;
      this._updateSelected();
    }

    _updateAttrForSelected() {
      if (!this.multi) {
        super._updateAttrForSelected();
      } else if (this.selectedItems && this.selectedItems.length > 0) {
        this.selectedValues = this.selectedItems
          .map((selectedItem) => this._indexToValue(this.indexOf(selectedItem)))
          .filter((unfilteredValue) => unfilteredValue !== null);
      }
    }

    _updateSelected() {
      if (this.multi) {
        this._selectMulti(this.selectedValues);
      } else {
        this._selectSelected(this.selected);
      }
    }

    _selectMulti(values = []) {
      const selectedItems = (this._valuesToItems(values) || []).filter(
        (item) => item !== null && item !== undefined
      );

      // clear all but the current selected items
      this._selection.clear(selectedItems);

      // select only those not selected yet
      for (let i = 0; i < selectedItems.length; i++) {
        this._selection.setItemSelected(selectedItems[i], true);
      }
      const { fallbackSelection } = this;
      // Check for items, since this array is populated only when attached
      if (fallbackSelection && !this._selection.get().length) {
        const fallback = this._valueToItem(fallbackSelection);
        if (fallback) {
          // this._selection.setItemSelected(fallback, true);
          this.select(fallbackSelection);
        }
      }
    }

    _selectionChange() {
      const s = this._selection.get();
      if (this.multi) {
        this._selectedItems = s;
        this._selectedItem = s.length ? s[0] : null;
      } else if (s !== null && s !== undefined) {
        this._selectedItems = [s];
        this._selectedItem = s;
      } else {
        this._selectedItems = [];
        this._selectedItem = null;
      }
    }

    _toggleSelected(value) {
      const i = this.selectedValues.indexOf(value);
      const unselected = i < 0;
      const items = this.selectedValues;
      if (unselected) {
        items.push(value);
      } else {
        items.splice(i, 1);
      }
      this.selectedValues = [...items];
    }

    _valuesToItems(values) {
      return values === null
        ? null
        : values.map((value) => this._valueToItem(value));
    }
  }
  return MultiSelectableMixinImpl;
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
export const MultiSelectableMixin = dedupeMixin(mxFunction);
