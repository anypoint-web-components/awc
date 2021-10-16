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
import { html } from 'lit-element';
import AnypointInputElement from './AnypointInputElement.js';
import '../anypoint-autocomplete.js';
import '../anypoint-chip.js';
import elementStyles from './styles/AnypointChipInput.js';

/* eslint-disable no-plusplus */
/* eslint-disable no-continue */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */

/** @typedef {import('./types').ChipSuggestion} ChipSuggestion */
/** @typedef {import('./types').ChipItem} ChipItem */
/** @typedef {import('lit-element').SVGTemplateResult} SVGTemplateResult */
/** @typedef {import('lit-element').TemplateResult} TemplateResult */


export default class AnypointChipInputElement extends AnypointInputElement {
  get styles() {
    return [
      // @ts-ignore
      super.styles,
      elementStyles,
    ];
  }

  static get properties() {
    return {
      /**
       * A list of chip items to render
       *
       * Each array item must have `label` property
       * for the chip. It can contain `removable` property it the chip can
       * be removed. It is added by default when chip's source is user input.
       */
      chips: { type: Array },
      /**
       * List of allowed chips labels. Character case does not matter.
       */
      allowed: { type: Array },
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
      source: { type: Array }
    };
  }

  /**
   * @return {ChipItem[]} previously set chips model.
   */
  get chips() {
    return this._chips;
  }

  /**
   * A list of chip items to render
   * @param {ChipItem[]} value Each array item must have `label` property
   * for the chip. It can contain `removable` property it the chip can
   * be removed. It is added by default when chip's source is user input.
   * @fires chips-changed
   */
  set chips(value) {
    const oldValue = this._chips;
    if (oldValue === value) {
      return;
    }
    this._chips = value;
    this.requestUpdate('chips', oldValue);
    this.dispatchEvent(new CustomEvent('chips-changed', {
      composed: true,
      detail: {
        value: this.chipsValue
      }
    }));
  }

  get value() {
    return this._value;
  }

  set value(value) {
    const oldValue = this._value;
    if (oldValue === value) {
      return;
    }
    // just in case if someone mixed chipsValue with value.
    // Web standards suggest that the elements should not throw errors in
    // such situation but rather handle it quietly.
    if (Array.isArray(value)) {
      value = '';
    }
    this._value = value;
    this.dispatchEvent(new CustomEvent('value-changed', {
      composed: true,
      detail: {
        value
      }
    }));
    this.requestUpdate('value', oldValue);
  }

  get source() {
    return this._source;
  }

  set source(value) {
    const oldValue = this._source;
    this._source = value;
    this.requestUpdate('source', oldValue);
    this._computeChipsValues(this.chipsValue, value);
    if (value && value.length) {
      this.setAttribute('aria-autocomplete', 'list');
    } else {
      this.removeAttribute('aria-autocomplete');
    }
  }

  /**
   * @return {string[]}
   */
  get chipsValue() {
    return (this.chips || []).map((item) => item.id || item.label);
  }

  set chipsValue(value) {
    this._computeChipsValues(value, this.source);
  }

  /**
   * @return {EventListener} Previously registered handler for `chips-changed` event
   */
  get onchipschanged() {
    return this['_onchips-changed'];
  }

  /**
   * Registers a callback function for `chips-changed` event
   * @param {EventListener} value A callback to register. Pass `null` or `undefined`
   * to clear the listener.
   */
  set onchipschanged(value) {
    const key = `_onchips-changed`;
    if (this[key]) {
      this.removeEventListener('chips-changed', this[key]);
    }
    if (typeof value !== 'function') {
      this[key] = null;
      return;
    }
    this[key] = value;
    this.addEventListener('chips-changed', value);
  }

  /**
   * @return {SVGTemplateResult} An icon to render when `removable` is set.
   * Can be undefined if not previously set.
   */
  get chipRemoveIcon() {
    return this._chipRemoveIcon;
  }

  /**
   * @param {SVGTemplateResult} value An icon to be used to render "remove" icon.
   * It must be an instance of `SVGTemplateResult` that can be created from `lit-html`
   * library.
   *
   * ```javascript
   * import { svg } from 'lit-html';
   * const icon = svg`...`; // content of the icon.
   * ```
   */
  set chipRemoveIcon(value) {
    const old = this._chipRemoveIcon;
    this._chipRemoveIcon = value;
    this.requestUpdate('chipRemoveIcon', old);
  }

  constructor() {
    super();
    this._keydownHandler = this._keydownHandler.bind(this);
    this.allowed = /** @type string[] */(null);
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    this.addEventListener('keydown', this._keydownHandler);
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    this.removeEventListener('keydown', this._keydownHandler);
  }

  /**
   * Computes value for paper-chip's `removable` property.
   * @param {ChipItem} item `chips` list item.
   * @return {boolean}
   */
  _computeChipRemovable(item) {
    return !!(item && item.removable);
  }

  /**
   * Adds a new chip to the list of chips.
   * @param {string} label Label of the chip
   * @param {boolean=} removable True if the chip can be removed.
   * @param {SVGTemplateResult=} icon An icon to pass to the chip.
   * @param {string=} id An ID to be used as a value.
   */
  addChip(label, removable, icon, id) {
    const { chips=[] } = this;
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
   * @param {string[]} value List of chips definitions
   * @param {ChipSuggestion[]} source List of suggestions
   */
  _computeChipsValues(value, source=[]) {
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
      const chip = {
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
   * @param {ChipSuggestion[]} source List of suggestions passed to the element
   * @param {string} value Search value. Should be lower case before calling this function
   * @param {string=} id Optional ID to compare.
   * @return {ChipSuggestion|undefined} Suggestion source or undefined if not found.
   */
  _findSource(source, value, id) {
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
      const itemValue = source[i].value;
      if (itemValue && typeof itemValue === 'string' && itemValue.toLowerCase() === value) {
        return item;
      }
      if (!id) {
        continue;
      }
      const itemId = source[i].id;
      if (itemId && itemId === id) {
        return item;
      }
    }
    return undefined;
  }

  /**
   * Tests if given value is allowed to enter when `allowed` property is set.
   * @param {string} value The value to test
   * @param {string=} id The Suggestion id, if any.
   * @return {boolean} True if the value is allowed as a chip label.
   */
  _isAllowed(value, id) {
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
   * @param {number} index Index of the chip in the `chips` array
   */
  _removeChip(index) {
    const {chips} = this;
    if (!chips || !chips.length) {
      return;
    }
    chips.splice(index, 1);
    this.chips = Array.from(chips);
    if (chips.length === 0) {
      this.validate();
    }
  }

  /**
   * Validates the input element and sets an error style if needed.
   *
   * @return {boolean}
   */
  _getValidity() {
    if (this.chips === undefined) {
      return true;
    }
    const hasChips = this.chips && this.chips.length;
    if (this.required && !hasChips) {
      this.invalid = true;
      return false;
    }
    return this.validate();
  }

  /**
   * Handler for `chipremoved` event.
   * @param {CustomEvent} e
   */
  _chipRemovedHandler(e) {
    // @ts-ignore
    const index = Number(e.target.dataset.index);
    if (Number.isNaN(index)) {
      return;
    }
    this._removeChip(index);
  }

  /**
   * @param {KeyboardEvent} e
   */
  _keydownHandler(e) {
    if (e.code === 'Enter') {
      this._enterDown(e);
    } else if (e.code === 'Backspace') {
      this._backspaceDown(e);
    }
  }

  /**
   * @param {KeyboardEvent} e
   */
  _enterDown(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.validate()) {
      return;
    }
    const {value} = this;
    if (!value) {
      return;
    }
    this._processAddInput(value);
  }

  /**
   * @param {KeyboardEvent} e
   */
  _backspaceDown(e) {
    const {chips} = this;
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

  _selectedHandler(e) {
    let {value} = e.detail;
    if (!value) {
      return;
    }
    if (value.value) {
      // for complex suggestions
      value = value.value;
    }
    this._processAddInput(value);
    this.inputElement.value = '';
  }

  _processAddInput(value) {
    const lowerValue = value.toLowerCase();
    const source = this._findSource(this.source, lowerValue);
    const id = source && source.id;
    if (!this._isAllowed(value, id)) {
      return;
    }
    const icon = source && source.icon;
    this.addChip(value, true, icon, id);
    this.value = '';
  }

  _focusBlurHandler(e) {
    super._focusBlurHandler(e);
    if (e.type === 'blur' && this.validate()) {
      this._tryBlurHandler();
    }
  }

  /**
   * When autocomplete is enabled, the user type in a value and as a result the
   * autocomplete closes itself for a lack of suggestion the input looses focus
   * for a tick. This checks in a debouncer whether the input still has focus and
   * if not it commits the value to the chip model.
   */
  _tryBlurHandler() {
    setTimeout(() => {
      const {value} = this;
      if (!this.focused && value) {
        this._processAddInput(value);
      }
    });
  }

  _prefixTemplate() {
    return html`<div class="prefixes">
      <div class="chips">
      ${this._renderChipsTemplate()}
      </div>
      <slot name="prefix"></slot>
    </div>`;
  }

  _autocompleteTemplate() {
    return html`<anypoint-autocomplete
      .target="${this.inputElement}"
      .source="${this.source}"
      ?anypoint="${this.anypoint}"
      @selected="${this._selectedHandler}"></anypoint-autocomplete>`;
  }

  _renderChipsTemplate() {
    const { chips } = this;
    if (!chips || !chips.length) {
      return '';
    }
    return chips.map((item, index) => html`
    <anypoint-chip
      .removable="${this._computeChipRemovable(item)}"
      @chipremoved="${this._chipRemovedHandler}"
      tabindex="-1"
      .removeIcon="${this.chipRemoveIcon}"
      ?anypoint="${this.anypoint}"
      data-index="${index}">
      ${this._itemIconTemplate(item)}
      ${item.label}
    </anypoint-chip>
    `);
  }

  _itemIconTemplate(item) {
    if (!item.icon) {
      return '';
    }
    return html`<span
      class="icon"
      slot="icon"
    >${item.icon}</span>`;
  }

  render() {
    return html`
    <style>${this.styles}</style>
    <div class="input-container">
      ${this._prefixTemplate()}
      <div class="input-label">
        ${this._labelTemplate()}
        ${this._inputTemplate()}
      </div>
      ${this._suffixTemplate()}
    </div>
    ${this._assistiveTemplate()}
    ${this._autocompleteTemplate()}
    `;
  }
}
