import { SelectableMixinConstructor, SelectableMixin } from './SelectableMixin';

declare function MultiSelectableMixin<T extends new (...args: any[]) => {}>(base: T): T & SelectableMixinConstructor & MultiSelectableMixinConstructor;
interface MultiSelectableMixinConstructor {
  new(...args: any[]): MultiSelectableMixin;
}

interface MultiSelectableMixin extends SelectableMixin {
  /**
   * If true, multiple selections are allowed.
   * @attribute
   */
  multi?: boolean;
  /**
   * Gets or sets the selected elements. This is used instead of `selected`
   * when `multi` is true.
   */
  selectedValues: HTMLElement[];
  /**
   * An array of currently selected items.
   */
  selectedItems: any[];
  _selectedItems: any[];

  /**
   * Registers a callback function for `selectedvalues-changed` event
   */
  onselectedvalueschanged: EventListener|null;

  /**
   * Registers a callback function for `selectedvalueschange` event
   */
  onselectedvalueschange: EventListener|null;

  /**
   * Registers a callback function for `selecteditems-changed` event
   */
  onselecteditemschanged: EventListener|null;

  /**
   * Registers a callback function for `selecteditemschange` event
   */
  onselecteditemschange: EventListener|null;

  constructor(): void;

  /**
   * Selects the given value. If the `multi` property is true, then the selected
   * state of the `value` will be toggled; otherwise the `value` will be
   * selected.
   *
   * @param value the value to select.
   */
  select(value: string|number): void;

  /**
   * @param multi Current value of `multi` property
   * @deprecated Don't use this function.
   */
  multiChanged(multi: boolean): void;
  _multiChanged(multi: boolean): void;
  _updateAttrForSelected(): void;
  _updateSelected(): void;
  _selectMulti(value: any[]): void;
  _selectionChange(): void;
  _toggleSelected(value: any): void;
  _valuesToItems(value: any[]): HTMLElement[];
}

export {MultiSelectableMixinConstructor};
export {MultiSelectableMixin};
