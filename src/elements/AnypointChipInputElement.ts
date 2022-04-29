/*
Copyright 2018 Pawel Psztyc, The ARC team
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import { html, SVGTemplateResult, TemplateResult, CSSResult, PropertyValueMap } from 'lit';
import { property } from 'lit/decorators.js';
import {map} from 'lit/directives/map.js';
import AnypointInputElement from './input/AnypointInputElement.js';
import elementStyles from '../styles/AnypointChipInput.js';
import '../define/anypoint-autocomplete.js';
import '../define/anypoint-chip.js';
import { ChipSuggestion, ChipItem } from '../types.js';
import { addListener, getListener } from '../lib/ElementEventsRegistry.js';

/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */

/**
 * @fires chipschange
 * @slot prefix The prefix rendering slot
 */
export default class AnypointChipInputElement extends AnypointInputElement {
  static get styles(): CSSResult[] {
    return [
      ...AnypointInputElement.styles,
      elementStyles,
    ];
  }

  /**
   * List of allowed chips labels. Character case does not matter.
   */
  @property({ type: Array }) allowed?: string[] = [];

  _chips?: ChipItem[];
  
  /**
   * A list of chip items to render
   *
   * Each array item must have `label` property
   * for the chip. It can contain `removable` property it the chip can
   * be removed. It is added by default when chip's source is user input.
   */
  @property({ type: Array })
  get chips(): ChipItem[] | undefined {
    return this._chips;
  }

  /**
   * A list of chip items to render
   * @param value Each array item must have `label` property
   * for the chip. It can contain `removable` property it the chip can
   * be removed. It is added by default when chip's source is user input.
   * @fires chipschange
   */
  set chips(value: ChipItem[] | undefined) {
    const oldValue = this._chips;
    if (oldValue === value) {
      return;
    }
    this._chips = value;
    this.requestUpdate('chips', oldValue);
    this.dispatchEvent(new CustomEvent('chipschange', {
      composed: true,
      detail: {
        value: this.chipsValue
      }
    }));
  }

  _source?: ChipSuggestion[] | string[];

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
  @property({ type: Array })
  get source(): ChipSuggestion[] | string[] | undefined {
    return this._source;
  }

  set source(value: ChipSuggestion[] | string[] | undefined) {
    const oldValue = this._source;
    this._source = value;
    this.requestUpdate('source', oldValue);
    this._computeChipsValues(this.chipsValue, value);
    // if (value && value.length) {
    //   this.setAttribute('aria-autocomplete', 'list');
    //   this.setAttribute('role', 'combobox');
    // } else {
    //   this.removeAttribute('aria-autocomplete');
    //   this.removeAttribute('role');
    // }
  }

  get chipsValue(): string[] {
    return (this.chips || []).map((item) => item.id || item.label);
  }

  set chipsValue(value: string[]) {
    this._computeChipsValues(value, this.source);
  }

  /**
   * @return Previously registered handler for `chipschange` event
   */
  get onchipschanged(): EventListener | undefined {
    return getListener('chipschange', this);
  }

  /**
   * Registers a callback function for `chipschange` event
   * @param value A callback to register. Pass `null` or `undefined`
   * to clear the listener.
   */
  set onchipschanged(value: EventListener | undefined) {
    addListener('chipschange', value, this);
  }

  _chipRemoveIcon?: SVGTemplateResult;

  /**
   * @return An icon to render when `removable` is set.
   * Can be undefined if not previously set.
   */
  get chipRemoveIcon(): SVGTemplateResult | undefined {
    return this._chipRemoveIcon;
  }

  /**
   * @param value An icon to be used to render "remove" icon.
   * It must be an instance of `SVGTemplateResult` that can be created from `lit-html`
   * library.
   *
   * ```javascript
   * import { svg } from 'lit-html';
   * const icon = svg`...`; // content of the icon.
   * ```
   */
  set chipRemoveIcon(value: SVGTemplateResult | undefined) {
    const old = this._chipRemoveIcon;
    this._chipRemoveIcon = value;
    this.requestUpdate('chipRemoveIcon', old);
  }

  protected willUpdate(cp: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.willUpdate(cp);
    if (cp.has('value')) {
      this._ensureStringValue();
    }
  }

  protected _ensureStringValue(): void {
    if (Array.isArray(this.value)) {
      this.value = '';
    }
  }

  /**
   * Computes value for paper-chip's `removable` property.
   * @param item `chips` list item.
   */
  _computeChipRemovable(item: ChipItem): boolean {
    return !!(item && item.removable);
  }

  /**
   * Adds a new chip to the list of chips.
   * @param label Label of the chip
   * @param removable True if the chip can be removed.
   * @param icon An icon to pass to the chip.
   * @param id An ID to be used as a value.
   */
  addChip(label: string, removable?: boolean, icon?: SVGTemplateResult, id?: string): void {
    const { chips = [] } = this;
    for (let i = 0, len = chips.length; i < len; i++) {
      if (chips[i].label === label) {
        // TODO: highlight the chip?
        return;
      }
    }
    this.chips = [...chips, {
      label,
      removable,
      icon,
      id
    }];
  }

  /**
   * Restores chips from passed value.
   * When input's (this element) value change it computes list of chips
   * @param value List of chips definitions
   * @param source List of suggestions
   */
  _computeChipsValues(value: string[], source: string[] | ChipSuggestion[] = []): void {
    if (!value || !value.length) {
      if (this.chips) {
        this.chips = [];
      }
      return;
    }
    const newChips = [];
    for (let i = 0, len = value.length; i < len; i++) {
      const _value = value[i];
      if (!_value || typeof _value !== 'string') {
        continue;
      }
      const _lowerValue = _value.toLowerCase();
      const _source = this._findSource(source, _lowerValue, _value);
      const chip: ChipItem = {
        removable: true,
        label: '',
      };
      if (_source && typeof _source === 'object') {
        chip.label = _source.value;
        chip.icon = _source.icon;
        chip.id = _source.id;
      } else {
        chip.label = _value;
      }
      newChips[newChips.length] = chip;
    }
    this.chips = newChips;
  }

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
  _findSource(source: string[] | ChipSuggestion[], value: string, id?: string): ChipSuggestion | string | undefined {
    if (!source || !source.length) {
      return undefined;
    }
    for (let i = 0; i < source.length; i++) {
      const item = source[i];
      if (typeof item === 'string') {
        if (!item) {
          // Empty string
          continue;
        }
        const lowerItem = String(item).toLowerCase();
        if (lowerItem === value || lowerItem === id) {
          return item;
        }
        continue;
      }
      const itemValue = item.value;
      if (itemValue && typeof itemValue === 'string' && itemValue.toLowerCase() === value) {
        return item;
      }
      if (!id) {
        continue;
      }
      const itemId = item.id;
      if (itemId && itemId === id) {
        return item;
      }
    }
    return undefined;
  }

  /**
   * Tests if given value is allowed to enter when `allowed` property is set.
   * @param value The value to test
   * @param id The Suggestion id, if any.
   * @returns True if the value is allowed as a chip label.
   */
  _isAllowed(value: string, id?: string): boolean {
    const { allowed } = this;
    if (!allowed || !allowed.length || !value) {
      return true;
    }
    const lowerValue = value.toLowerCase();
    for (let i = 0, len = allowed.length; i < len; i++) {
      if (id && id === allowed[i]) {
        return true;
      }
      if (allowed[i].toLowerCase && allowed[i].toLowerCase() === lowerValue) {
        return true;
      }
    }
    return false;
  }

  /**
   * Removes a chip on a specific index.
   *
   * @param index Index of the chip in the `chips` array
   */
  _removeChip(index: number): void {
    const { chips } = this;
    if (!chips || !chips.length) {
      return;
    }
    chips.splice(index, 1);
    this.requestUpdate();
    if (chips.length === 0) {
      this.checkValidity();
    }
  }

  /**
   * Validates the input element and sets an error style if needed.
   */
  _getValidity(): boolean {
    if (this.chips === undefined) {
      return true;
    }
    const hasChips = this.chips && this.chips.length;
    
    if (this.required && !hasChips) {
      this.invalid = true;
      return false;
    }
    return super._getValidity();
  }

  /**
   * Handler for `chipremoved` event.
   */
  _chipRemovedHandler(e: CustomEvent): void {
    // @ts-ignore
    const index = Number(e.target.dataset.index);
    if (Number.isNaN(index)) {
      return;
    }
    this._removeChip(index);
  }

  _keydownHandler(e: KeyboardEvent): void {
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      this._enterDown(e);
    } else if (e.code === 'Backspace') {
      this._backspaceDown(e);
    }
    super._keydownHandler(e);
  }

  _enterDown(e: KeyboardEvent): void {
    e.preventDefault();
    e.stopPropagation();
    if (!this.checkValidity()) {
      return;
    }
    const { value } = this;
    if (!value) {
      return;
    }
    this._processAddInput(value);
  }

  _backspaceDown(e: KeyboardEvent): void {
    const { chips } = this;
    if (this.value || !chips || !chips.length) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    let removeIndex = -1;
    for (let i = chips.length - 1; i >= 0; i--) {
      if (chips[i].removable) {
        removeIndex = i;
        break;
      }
    }
    if (removeIndex === -1) {
      return;
    }
    const chip = chips[removeIndex];
    this._removeChip(removeIndex);
    setTimeout(() => {
      this.value = chip.label;
    });
  }

  _selectedHandler(e: CustomEvent): void {
    let { value } = e.detail;
    if (!value) {
      return;
    }
    if (value.value) {
      // for complex suggestions
      value = value.value;
    }
    this._processAddInput(value);
    this.inputElement!.value = '';
  }

  _processAddInput(value: string): void {
    const lowerValue = value.toLowerCase();
    const source = this._findSource(this.source!, lowerValue);
    const typed = source as ChipSuggestion;
    const id = typed && typed.id;
    if (!this._isAllowed(value, id)) {
      return;
    }
    const icon = typed && typed.icon;
    this.addChip(value, true, icon, id);
    this.value = '';
  }

  protected _blurHandler(): void {
    super._blurHandler();
    if (this.checkValidity()) {
      this._tryBlurHandler();
    }
  }

  /**
   * When autocomplete is enabled, the user type in a value and as a result the
   * autocomplete closes itself for a lack of suggestion the input looses focus
   * for a tick. This checks in a debouncer whether the input still has focus and
   * if not it commits the value to the chip model.
   */
  _tryBlurHandler(): void {
    setTimeout(() => {
      const { value } = this;
      if (!this.focused && value) {
        this._processAddInput(value);
      }
    });
  }

  _prefixTemplate(): TemplateResult {
    return html`
    <div class="prefixes">
      ${this._renderChipsTemplate()}
      <slot name="prefix"></slot>
    </div>`;
  }

  _autocompleteTemplate(): TemplateResult | string {
    if (!Array.isArray(this.source) || !this.source.length) {
      return '';
    }
    return html`<anypoint-autocomplete
      .target="${this.inputElement as HTMLInputElement | null}"
      .source="${this.source}"
      ?anypoint="${this.anypoint}"
      noOverlap
      @pick="${this._selectedHandler}"></anypoint-autocomplete>`;
  }

  _renderChipsTemplate(): TemplateResult {
    const { chips = [] } = this;
    return html`
    <div class="chips">
      ${map(chips, (item, index) => html`<anypoint-chip
        .removable="${this._computeChipRemovable(item)}"
        @chipremoved="${this._chipRemovedHandler}"
        tabindex="-1"
        .removeIcon="${this.chipRemoveIcon}"
        ?anypoint="${this.anypoint}"
        data-index="${index}">
        ${this._itemIconTemplate(item)}
        ${item.label}
      </anypoint-chip>`)}
    </div>
    `;
  }

  _itemIconTemplate(item: ChipItem): TemplateResult | string {
    if (!item.icon) {
      return '';
    }
    return html`<span
      class="icon"
      slot="icon"
    >${item.icon}</span>`;
  }

  render(): TemplateResult {
    return html`
    ${super.render()}
    ${this._autocompleteTemplate()}
    `;
  }
}
