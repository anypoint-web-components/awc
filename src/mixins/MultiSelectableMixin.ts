import { LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { SelectableMixin, SelectableMixinInterface } from './SelectableMixin.js';
import { addListener, getListener } from '../lib/ElementEventsRegistry.js';

/* eslint-disable no-plusplus */

type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * Port of `@polymer/iron-selector/iron-multi-selectable.js`.
 *
 * A mixin to be applied to a class where child elements can be selected and selection
 * can be applied to more than one item.
 *
 * Note, by default the mixin works with LitElement. If used with different class
 * make sure that attributes are reflected to properties correctly.
 * @mixin
 * 
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
export interface MultiSelectableMixinInterface extends SelectableMixinInterface {
  _multi: boolean;

  _selectedValues: unknown[];

  /**
   * If true, multiple selections are allowed.
   * @attribute
   */
  multi: boolean;

  /**
   * Gets or sets the selected elements. This is used instead of `selected`
   * when `multi` is true.
   */
  selectedValues: unknown[];

  /**
   * @returns An array of currently selected items.
   */
  get selectedItems(): HTMLElement[];

  _selectedItems: HTMLElement[];

  onselectedvalueschange: EventListener | undefined;
  onselecteditemschange: EventListener | undefined;

  /**
   * Selects the given value. If the `multi` property is true, then the selected
   * state of the `value` will be toggled; otherwise the `value` will be
   * selected.
   *
   * @param value the value to select.
   */
  select(value: string | number): void;
 
  _multiChanged(multi: boolean): void;

  _multiChanged(multi: boolean): void;

  _updateAttrForSelected(): void;

  _updateSelected(): void;

  _selectMulti(values?: unknown[]): void;

  _selectionChange(): void;

  _toggleSelected(value: string | number | undefined): void;

  _valuesToItems(values: unknown[]): HTMLElement[] | undefined;
}

/**
 * Port of `@polymer/iron-selector/iron-multi-selectable.js`.
 *
 * A mixin to be applied to a class where child elements can be selected and selection
 * can be applied to more than one item.
 *
 * Note, by default the mixin works with LitElement. If used with different class
 * make sure that attributes are reflected to properties correctly.
 * @mixin
 * 
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
export function MultiSelectableMixin<T extends Constructor<LitElement>>(superClass: T): Constructor<MultiSelectableMixinInterface> & T {
  class MyMixinClass extends SelectableMixin(superClass) {
    _multi = false;

    /**
     * If true, multiple selections are allowed.
     * @attribute
     */
    @property({ type: Boolean, reflect: true })
    get multi(): boolean {
      return this._multi;
    }

    set multi(value: boolean) {
      const old = this._multi;
      /* istanbul ignore if */
      if (old === value) {
        return;
      }
      this._multi = value;
      this._multiChanged(value);
    }

    _selectedValues: unknown[] = [];

    /**
     * Gets or sets the selected elements. This is used instead of `selected`
     * when `multi` is true.
     */
    @property({ type: Array })
    get selectedValues(): unknown[] {
      return this._selectedValues;
    }

    set selectedValues(value: unknown[]) {
      const old = this._selectedValues;
      /* istanbul ignore if */
      if (old === value) {
        return;
      }
      this._selectedValues = value;
      this._updateSelected();
      this.dispatchEvent(new Event('selectedvalueschange'));
    }

    __selectedItems: HTMLElement[] = [];

    /**
     * @returns An array of currently selected items.
     */
    get selectedItems(): HTMLElement[] {
      return this._selectedItems;
    }

    @state()
    get _selectedItems(): HTMLElement[] {
      return this.__selectedItems;
    }

    set _selectedItems(value: HTMLElement[]) {
      const old = this.__selectedItems;
      /* istanbul ignore if */
      if (old === value) {
        return;
      }
      this.__selectedItems = value;
      this.dispatchEvent(new Event('selecteditemschange'));
    }

    /**
     * @return Previously registered handler for `selectedvalueschange` event
     */
    get onselectedvalueschange(): EventListener | undefined {
      return getListener('selectedvalueschange', this);
    }

    /**
     * Registers a callback function for `selectedvalueschange` event
     * @param value A callback to register. Pass `null` or `undefined`
     * to clear the listener.
     */
    set onselectedvalueschange(value: EventListener | undefined) {
      addListener('selectedvalueschange', value, this);
    }

    /**
     * @return Previously registered handler for `selecteditemschange` event
     */
    get onselecteditemschange(): EventListener | undefined {
      return getListener('selecteditemschange', this);
    }

    /**
     * Registers a callback function for `selecteditemschange` event
     * @param value A callback to register. Pass `null` or `undefined`
     * to clear the listener.
     */
    set onselecteditemschange(value: EventListener | undefined) {
      addListener('selecteditemschange', value, this);
    }

    constructor(...args: any[]) {
      super(...args);
      this._multiChanged(false);
    }

    /**
     * Selects the given value. If the `multi` property is true, then the selected
     * state of the `value` will be toggled; otherwise the `value` will be
     * selected.
     *
     * @param value the value to select.
     */
    select(value: string | number | undefined): void {
      if (this.multi) {
        this._toggleSelected(value);
      } else {
        this.selected = value;
      }
    }

    /**
     * @param multi Current value of `multi` property
     * @deprecated Don't use this function.
     */
    multiChanged(multi: boolean): void {
      this._multiChanged(multi);
    }

    _multiChanged(multi: boolean): void {
      this._selection.multi = multi;
      this._updateSelected();
    }

    _updateAttrForSelected(): void {
      if (!this.multi) {
        super._updateAttrForSelected();
      } else if (this.selectedItems && this.selectedItems.length > 0) {
        // @ts-ignore
        const mapped = this.selectedItems.map(selectedItem => this._indexToValue(this.indexOf(selectedItem)));
        this.selectedValues = mapped.filter((unfilteredValue) => unfilteredValue !== undefined);
      }
    }

    _updateSelected(): void {
      if (this.multi) {
        this._selectMulti(this.selectedValues);
      } else {
        this._selectSelected(this.selected!);
      }
    }

    _selectMulti(values: unknown[] = []): void {
      const selectedItems = (this._valuesToItems(values) || []).filter(
        (item) => item !== undefined && item !== undefined
      );

      // clear all but the current selected items
      this._selection.clear(selectedItems);

      // select only those not selected yet
      for (let i = 0; i < selectedItems.length; i++) {
        this._selection.setItemSelected(selectedItems[i], true);
      }
      const { fallbackSelection } = this;
      // Check for items, since this array is populated only when attached
      if (fallbackSelection && !(this._selection.get() as any).length) {
        const fallback = this._valueToItem(fallbackSelection);
        if (fallback) {
          // this._selection.setItemSelected(fallback, true);
          this.select(fallbackSelection);
        }
      }
    }

    _selectionChange(): void {
      const s = this._selection.get() as any;
      if (this.multi) {
        this._selectedItems = s;
        this._selectedItem = s.length ? s[0] : undefined;
      } else if (s !== undefined && s !== undefined) {
        this._selectedItems = [s];
        this._selectedItem = s;
      } else {
        this._selectedItems = [];
        this._selectedItem = undefined;
      }
    }

    _toggleSelected(value: string | number | undefined): void {
      if (value === undefined) {
        this.selectedValues = [];
        return;
      }
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

    _valuesToItems(values: unknown[]): HTMLElement[] | undefined {
      // @ts-ignore
      return values === undefined ? undefined : values.map((value) => this._valueToItem(value));
    }
  }
  return MyMixinClass as Constructor<MultiSelectableMixinInterface> & T;
}
