import { PropertyValueMap } from 'lit';
import { property, state } from 'lit/decorators.js';
import SelectableElement from "./SelectableElement.js";
import { addListener, getListener } from '../../lib/ElementEventsRegistry.js';

/**
 * @fires selectedvalueschange
 * @fires selecteditemschange
 */
export default class MultiSelectableElement extends SelectableElement {
  /**
   * If true, multiple selections are allowed.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) multi: boolean = false;

  /**
   * Gets or sets the selected elements. This is used instead of `selected`
   * when `multi` is true.
   */
  @property({ type: Array }) selectedValues: unknown[] = [];

  /**
   * @returns An array of currently selected items.
   */
  get selectedItems(): HTMLElement[] {
    return this._selectedItems;
  }

  @state() _selectedItems: HTMLElement[] = [];

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

  protected willUpdate(cp: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.willUpdate(cp);
    if (cp.has('multi')) {
      this._multiChanged(this.multi);
    }
    if (cp.has('selectedValues')) {
      this._updateSelected();
    }
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

  _notifyValuesChanged(): void {
    this.dispatchEvent(new Event('selectedvalueschange'));
  }

  _notifySelectedItems(): void {
    this.dispatchEvent(new Event('selecteditemschange'));
  }

  _multiChanged(multi: boolean): void {
    this._selection.multi = multi;
    this._updateSelected();
  }

  _updateAttrForSelected(): void {
    if (!this.multi) {
      super._updateAttrForSelected();
    } else if (this.selectedItems && this.selectedItems.length > 0) {
      const mapped = this.selectedItems.map(selectedItem => this._indexToValue(this.indexOf(selectedItem)));
      this.selectedValues = mapped.filter((unfilteredValue) => unfilteredValue !== undefined);
      this._notifyValuesChanged();
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
    const selectedItems = (this._valuesToItems(values) || []).filter((item) => item !== undefined && item !== undefined);

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
    } else if (s !== null && s !== undefined) {
      this._selectedItems = [s];
      this._selectedItem = s;
    } else {
      this._selectedItems = [];
      this._selectedItem = undefined;
    }
    this._notifySelectedItems();
  }

  _toggleSelected(value: string | number | undefined): void {
    if (value === undefined) {
      this.selectedValues = [];
      this._notifyValuesChanged();
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
    this._notifyValuesChanged();
  }

  _valuesToItems(values: unknown[]): HTMLElement[] | undefined {
    if (values === undefined) {
      return undefined;
    }
    const result: HTMLElement[] = [];
    values.forEach((value) => {
      const item = this._valueToItem(value as string | number);
      if (item) {
        result.push(item);
      }
    });
    return result;
  }
}
