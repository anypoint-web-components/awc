import { SVGTemplateResult, TemplateResult } from 'lit-element';
import AnypointInputElement from './AnypointInputElement.js';
import { ChipSuggestion, ChipItem } from './types';

/**
 * @fires chips-changed Dispatched when a list of chips change
 * @fires value-changed Dispatched when the current value change
 */
export default class AnypointChipInputElement extends AnypointInputElement {
  /**
   * A list of chip items to render
   */
  chips: ChipItem[];
  /**
   * @attribute
   */
  value: any;

  /**
   * List of suggestions to render when the user type in the input field.
   *
   * Each array item can be a string which will be compared to user input.
   * If the item is an object is must contain the `value` property which
   * is used to compare the values. It can also contain an `icon` property
   * which value is an instance of `SVGTemplateResult` from `lit-html`
   * library.
   *
   * If the suggestion item contains `id` property it's value will be returned
   * as a value of the input. Otherwise `value` is used.
   *
   * ### Example
   *
   * ```json
   * [
   *  "item 1",
   *  {
   *    "value": "Other item",
   *    "icon": svg`...`
   *  },
   *  {
   *    "value": "Rendered label",
   *    "id": "returned-value"
   *  }
   * ]
   * ```
   */
  source: ChipSuggestion[] | string[];
  chipsValue: string[];
  onchipschanged: EventListener | null;
  chipRemoveIcon: SVGTemplateResult | null;

  /**
   * List of allowed chips labels. Character case does not matter.
   * @attribute
   */
  allowed: string[];
  render(): TemplateResult;
  _prefixTemplate(): TemplateResult;
  connectedCallback(): void;
  disconnectedCallback(): void;

  /**
   * Computes value for paper-chip's `removable` property.
   *
   * @param item `chips` list item.
   */
  _computeChipRemovable(item: ChipItem): boolean;

  /**
   * Adds a new chip to the list of chips.
   *
   * @param label Label of the chip
   * @param removable True if the chip can be removed.
   * @param icon An icon to pass to the chip.
   * @param id An ID to be used as a value.
   */
  addChip(label: string, removable?: boolean, icon?: string, id?: string): void;

  /**
   * Restores chips from passed value.
   * When input's (this element) value change it computes list of chips
   *
   * @param value List of chips definitions
   * @param source List of suggestions
   */
  _computeChipsValues(value: string[], source: ChipSuggestion[]): void;

  /**
   * Finds a suggestion source in the list of suggestions.
   * Primarily it looks for a value (and lowercase it) and then it compares
   * `id` if defined.
   *
   * @param source List of suggestions passed to the element
   * @param value Search value. Should be lower case before calling this function
   * @param id Optional ID to compare.
   * @returns Suggestion source or undefined if not found.
   */
  _findSource(source: ChipSuggestion[] | string[], value: string, id?: string): ChipSuggestion | undefined;

  /**
   * Tests if given value is allowed to enter when `allowed` property is set.
   *
   * @param value The value to test
   * @param id The Suggestion id, if any.
   * @returns True if the value is allowed as a chip label.
   */
  _isAllowed(value: string, id?: string): boolean;

  /**
   * Removes a chip on a specific index.
   *
   * @param index Index of the chip in the `chips` array
   */
  _removeChip(index: number): void;

  /**
   * Validates the input element and sets an error style if needed.
   */
  _getValidity(): boolean;

  /**
   * Handler for `chip-removed` event.
   */
  _chipRemovedHandler(e: CustomEvent): void;
  _keydownHandler(e: KeyboardEvent): void;
  _enterDown(e: KeyboardEvent): void;
  _backspaceDown(e: KeyboardEvent): void;
  _selectedHandler(e: CustomEvent): void;
  _processAddInput(value: string): void;
  _focusBlurHandler(e: Event): void;

  /**
   * When autocomplete is enabled, the user type in a value and as a result the
   * autocomplete closes itself for a lack of suggestion the input looses focus
   * for a tick. This checks in a debouncer whether the input still has focus and
   * if not it commits the value to the chip model.
   */
  _tryBlurHandler(): void;
  _autocompleteTemplate(): TemplateResult;
  _renderChipsTemplate(): TemplateResult;
  _itemIconTemplate(item: ChipItem): TemplateResult | string;
}
