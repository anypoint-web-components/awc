import { MultiSelectableMixin, SelectableMixin } from '@anypoint-web-components/anypoint-selector';

declare function MenuMixin<T extends new (...args: any[]) => {}>(base: T): T & MultiSelectableMixin & SelectableMixin & MenuMixinConstructor;
interface MenuMixinConstructor {
  new(...args: any[]): MenuMixin;
}

export declare const highlightedItem: string;
export declare const highlightedItemValue: string;

interface MenuMixin extends MultiSelectableMixin, SelectableMixin {
  /**
   * Currently focused in the menu item.
   */
  get focusedItem(): HTMLElement|undefined;
  /**
   * Currently highlighted item.
   */
  get highlightedItem(): HTMLElement|undefined;

  _focusedItem?: HTMLElement;

  /**
   * The attribute to use on menu items to look up the item title. Typing the
   * first letter of an item when the menu is open focuses that item. If
   * unset, `textContent` will be used.
   * @attribute
   */
  attrForItemTitle?: string;

  /**
   * Whether or not this menu is disabled.
   * @attribute
   */
  disabled?: boolean;

  _previousTabIndex?: number;
  /**
   * When set it adds `aria-selected` attribute to currently selected item.
   *
   * The `aria-selected` attribute is invalid with default role of this
   * element ("menu"). If you manually change the role to some other that
   * accepts `aria-selected` attribute on children then set this property.
   * @attribute
   */
  useAriaSelected?: boolean;
  /**
   * When set the effect of calling `highlightNext()` or `highlightPrevious()`
   * will be setting `aria-selected` attribute. For proper accessibility use
   * with the combination with `useAriaSelected` attribute.
   * @attribute
   */
  highlightAriaSelected: boolean;
  _shiftTabPressed: boolean;

  constructor(): void;
  connectedCallback(): void;
  disconnectedCallback(): void;
  _multiChanged(value: boolean): void;
  _onItemsChanged(e: CustomEvent): void;

  /**
   * Handler for the keydown event.
   */
  _onKeydown(e: KeyboardEvent): void;

  /**
   * Handler that is called when the up key is pressed.
   *
   * @param e A key combination event.
   */
  _onUpKey(e: KeyboardEvent): void;

  /**
   * Handler that is called when the down key is pressed.
   *
   * @param e A key combination event.
   */
  _onDownKey(e: KeyboardEvent): void;

  /**
   * Handler that is called when the esc key is pressed.
   */
  _onEscKey(): void;
  _focusWithKeyboardEvent(e: KeyboardEvent): void;
  _clearSearchText(): void;

  /**
   * Resets all tabindex attributes to the appropriate value based on the
   * current selection state. The appropriate value is `0` (focusable) for
   * the default selected item, and `-1` (not keyboard focusable) for all
   * other items. Also sets the correct initial values for aria-selected
   * attribute, true for default selected item and false for others.
   */
  _resetTabindices(): void;

  /**
   * Selects the given value. If the `multi` property is true, then the selected
   * state of the `value` will be toggled; otherwise the `value` will be
   * selected.
   *
   * @param value the value to select.
   */
  select(value: string|number): void;

  /**
   * Focuses the previous item (relative to the currently focused item) in the
   * menu, disabled items will be skipped.
   * Loop until length + 1 to handle case of single item in menu.
   */
  focusPrevious(): void;
  /**
   * Focuses the next item (relative to the currently focused item) in the
   * menu, disabled items will be skipped.
   */
  focusNext(): void;
  /**
   * @deprecated Please, use `focusPrevious()` instead.
   */
  _focusPrevious(): void;
  /**
   * @deprecated Please, use `focusNext()` instead.
   */
  _focusNext(): void;
  /**
   * Highlights, by setting the `highlight` css class, the next availabl element.
   * If there's no highlighted item but there is a selection (focused item)
   * then a next item after the selection is selected.
   */
  highlightNext(): void;
  /**
   * Highlights, by setting the `highlight` css class, the previous availabl element.
   * If there's no highlighted item but there is a selection (focused item)
   * then a previous item before the selection is selected.
   */
  highlightPrevious(): void;
  /**
   * Mutates items in the menu based on provided selection details, so that
   * all items correctly reflect selection state.
   *
   * @param item An item in the menu.
   * @param isSelected True if the item should be shown in a selected state, otherwise false.
   */
  _applySelection(item: HTMLElement, isSelected: boolean): void;
  _focusedItemChanged(focusedItem: HTMLElement, old?: HTMLElement): void;
  _onShiftTabDown(): void;
  _onFocus(e: FocusEvent): void;
  _activateHandler(e: Event): void;
  _disabledChanged(disabled: boolean): void;
}

export {MenuMixinConstructor};
export {MenuMixin};
