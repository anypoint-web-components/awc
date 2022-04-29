/*
Copyright 2019 Pawel Psztyc, The ARC team

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
import { html, css, CSSResult, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { Suggestion } from '../types';
import { HorizontalAlign, VerticalAlign } from './overlay/FitElement.js';
import AnypointListboxElement from './AnypointListboxElement.js';
import { addListener, getListener } from '../lib/ElementEventsRegistry.js';
import AnypointElement from './AnypointElement.js';
import { retarget, retargetHandler } from '../lib/Events.js';
import '../define/anypoint-dropdown.js';
import '../define/anypoint-item.js';
import '../define/anypoint-item-body.js';
import '../define/anypoint-listbox.js';

export interface InternalSuggestion extends Suggestion {
  /**
   * The index of the suggestion on the source list.
   */
  index: number;
}

/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */

/**
 * Generates an id on passed element.
 * @param target An element to set id on to
 */
function ensureNodeId(target: HTMLElement): void {
  if (target.id) {
    return;
  }
  const id = Math.floor(Math.random() * 100000 + 1);
  target.id = `anypointAutocompleteInput${id}`;
}

export const suggestionsValue = Symbol('suggestionsValue');
export const processSource = Symbol('processSource');
export const normalizeSource = Symbol('normalizeSource');
export const itemTemplate = Symbol('itemTemplate');
export const readLabelValue = Symbol('readLabelValue');
export const openedValue = Symbol('openedValue');
export const openedValuePrivate = Symbol('openedValuePrivate');
export const autocompleteFocus = Symbol('autocompleteFocus');
export const ignoreNextFocus = Symbol('ignoreNextFocus');

/**
 * @fires loadingchange
 * @fires openedchange
 * @fires query
 * @fires input
 * @fires selected
 * @fires resize
 */
export default class AnypointAutocompleteElement extends AnypointElement {
  static get styles(): CSSResult {
    return css`.highlight {
      font-weight: bold;
    }`;
  }

  createRenderRoot(): Element {
    return this;
  }

  _target?: HTMLInputElement | string;

  /**
   * A target input field to observe.
   * It accepts an element which is the input with `value` property or
   * an id of an element that is a child of the parent element of this node.
   * @attribute
   */
  @property()
  get target(): HTMLInputElement | string | undefined {
    return this._target;
  }

  set target(value: HTMLInputElement | string | undefined) {
    const old = this._target;
    if (old === value) {
      return;
    }
    this._target = value;
    this._targetChanged();
  }

  /**
    * List of suggestion that are rendered.
    */
  @state() _suggestions: string[] | InternalSuggestion[] = [];

  /**
   * @return List of suggestion that are rendered.
   */
  get suggestions(): string[] | InternalSuggestion[] | undefined {
    return this._suggestions;
  }

  __loading: boolean | undefined;

  /**
   * @return True when user query changed and waiting for `source` property update
   */
  get loading(): boolean | undefined {
    return this._loading;
  }

  /**
   * True when user query changed and waiting for `source` property update
   */
  get _loading(): boolean | undefined {
    return this.__loading;
  }

  set _loading(value: boolean | undefined) {
    const old = this.__loading;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this.__loading = value;
    this.requestUpdate('_loading', value);
    this.dispatchEvent(
      new CustomEvent('loadingchange', {
        detail: {
          value
        }
      })
    );
  }

  _source: string[] | Suggestion[] | undefined;

  [suggestionsValue]?: InternalSuggestion[] | null;

  /**
    * List of suggestions to render.
    * If the array items are strings they will be used to render a suggestions and
    * to insert a value.
    * If the list is an object the each object must contain `value` and `display`
    * properties.
    * The `display` property will be used in the suggestions list and the
    * `value` property will be used to insert the value to the referenced text field.
    * @attribute
    */
  @property({ type: Array })
  get source(): string[] | Suggestion[] | undefined {
    return this._source;
  }

  set source(value: string[] | Suggestion[] | undefined) {
    const old = this._source;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this._source = value;
    this[suggestionsValue] = this[processSource](value);
    if (this[openedValue]) {
      this._filterSuggestions();
    }
    if (this._loading) {
      this._loading = false;
    }
  }

  [openedValuePrivate]?: boolean;

  /**
   * @return True if the overlay is currently opened.
   */
  get opened(): boolean {
    return this[openedValue];
  }

  get [openedValue](): boolean {
    return this[openedValuePrivate] || false;
  }

  set [openedValue](value: boolean) {
    const old = this[openedValuePrivate];
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this[openedValuePrivate] = value;
    this.requestUpdate();
    this._openedChanged(value);
    this.dispatchEvent(new CustomEvent('openedchange'));
  }

  /**
   * Set this to true if you use async operation in response for query event.
   * This will render a loader when querying for more suggestions.
   * Do not use it it you do not handle suggestions asynchronously.
   * @attribute
   */
  @property({ reflect: true, type: Boolean })
  loader?: boolean;

  /**
   * If true it will opened suggestions on input field focus.
   * @attribute
   */
  @property({ reflect: true, type: Boolean })
  openOnFocus?: boolean;

  _disabled: boolean | undefined;

  /** 
   * When set it ignores any events on the input field.
   */
  @property({ type: Boolean })
  get disabled(): boolean | undefined {
    return this._disabled;
  }

  set disabled(value: boolean | undefined) {
    const old = this._disabled;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this._disabled = value;
    this.requestUpdate('disabled', old);
    if (value && this.opened) {
      this[openedValue] = false;
    }
  }

  _isAttached = false;

  get isAttached(): boolean {
    return this._isAttached;
  }

  set isAttached(value: boolean) {
    const old = this._isAttached;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this._isAttached = value;
    this._targetChanged();
  }

  /**
   * The orientation against which to align the element vertically
   * relative to the text input.
   * Possible values are "top", "bottom", "middle", "auto".
   * @attribute
   */
  @property({ type: String, reflect: true })
  verticalAlign: VerticalAlign = 'top';

  /**
   * A pixel value that will be added to the position calculated for the
   * given `verticalAlign`, in the direction of alignment. You can think
   * of it as increasing or decreasing the distance to the side of the
   * screen given by `verticalAlign`.
   *
   * If `verticalAlign` is "top" or "middle", this offset will increase or
   * decrease the distance to the top side of the screen: a negative offset
   * will move the dropdown upwards; a positive one, downwards.
   *
   * Conversely if `verticalAlign` is "bottom", this offset will increase
   * or decrease the distance to the bottom side of the screen: a negative
   * offset will move the dropdown downwards; a positive one, upwards.
   * @attribute
   */
  @property({ type: Number, reflect: true })
  verticalOffset = 2;

  /**
   * The orientation against which to align the element horizontally
   * relative to the text input. Possible values are "left", "right",
   * "center", "auto".
   * @attribute
   */
  @property({ type: String, reflect: true })
  horizontalAlign: HorizontalAlign = 'center';

  /**
   * A pixel value that will be added to the position calculated for the
   * given `horizontalAlign`, in the direction of alignment. You can think
   * of it as increasing or decreasing the distance to the side of the
   * screen given by `horizontalAlign`.
   *
   * If `horizontalAlign` is "left" or "center", this offset will increase or
   * decrease the distance to the left side of the screen: a negative offset
   * will move the dropdown to the left; a positive one, to the right.
   *
   * Conversely if `horizontalAlign` is "right", this offset will increase
   * or decrease the distance to the right side of the screen: a negative
   * offset will move the dropdown to the right; a positive one, to the left.
   * @attribute
   */
  @property({ type: Number, reflect: true })
  horizontalOffset = 0;

  /**
   * Determines which action to perform when scroll outside an opened overlay
   * happens. Possible values: lock - blocks scrolling from happening, refit -
   * computes the new position on the overlay cancel - causes the overlay to
   * close
   * @attribute
   */
  @property({ type: String, reflect: true })
  scrollAction = 'refit';

  /**
   * Removes animation from the dropdown.
   * @attribute
   */
  @property({ type: Boolean, reflect: true })
  noAnimations?: boolean;

  /**
   * When set it won't setup `aria-controls` on target element.
   * @attribute
   */
  @property({ type: Boolean, reflect: true })
  noTargetControls?: boolean;

  /**
   * When set the element won't update the `value` property on the
   * target when a selection is made.
   * @attribute
   */
  @property({ type: Boolean, reflect: true })
  noTargetValueUpdate?: boolean;

  /** 
   * When set it fits the positioning target width.
   */
  @property({ type: Boolean }) fitPositionTarget?: boolean;

  /** 
   * When set to an element it will be used to position the dropdown 
   * instead of the input element
   * @attribute
   */
  @property({ type: Object }) positionTarget?: HTMLElement;

  /** 
   * The component sets CSS variables on the dropdown element by default.
   * When this property is set then the component ignores setting these styles, 
   * but you have to apply styles to the `anypoint-dropdown` element.
   * The drop down element is not in the shadow DOM so the application has access to it.
   */
  @property({ type: Boolean })
  ignoreDropdownStyling?: boolean;

  /**
   * Will position the list around the input without overlapping it.
   */
  @property({ type: Boolean, reflect: true })
  noOverlap?: boolean;

  __listbox?: AnypointListboxElement;

  __ignoreCloseRefocus?: boolean;

  get _listbox(): AnypointListboxElement | undefined {
    if (!this.__listbox) {
      this.__listbox = this.querySelector('anypoint-listbox') || undefined;
    }
    return this.__listbox;
  }

  /**
   * @return Previously registered handler for `query` event
   */
  get onquery(): EventListener | undefined {
    return getListener('query', this);
  }

  /**
   * Registers a callback function for `query` event
   * @param value A callback to register. Pass `null` or `undefined`
   * to clear the listener.
   */
  set onquery(value: EventListener | undefined) {
    addListener('query', value, this);
  }

  /**
   * @return {EventListener} Previously registered handler for `selected` event
   */
  get onselected(): EventListener | undefined {
    return getListener('selected', this);
  }

  /**
   * Registers a callback function for `selected` event
   * @param {EventListener} value A callback to register. Pass `null` or `undefined`
   * to clear the listener.
   */
  set onselected(value: EventListener | undefined) {
    addListener('selected', value, this);
  }

  _oldTarget?: HTMLInputElement;

  [autocompleteFocus]: boolean;

  [ignoreNextFocus]: boolean;

  constructor() {
    super();
    this._targetInputHandler = this._targetInputHandler.bind(this);
    this._targetFocusHandler = this._targetFocusHandler.bind(this);
    this._targetKeydown = this._targetKeydown.bind(this);
    this._onCaptureClick = this._onCaptureClick.bind(this);
    this[openedValue] = false;
  }

  connectedCallback(): void {
    super.connectedCallback();
    ensureNodeId(this);
    this.style.position = 'absolute';
    this.isAttached = true;
    // This is done on the document rather than the `target` property because the click may
    // be done on the target's label element, or something similar, and we still need to capture
    // the event
    document.addEventListener('click', this._onCaptureClick);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.isAttached = false;
    document.removeEventListener('click', this._onCaptureClick);
  }

  _onCaptureClick(e: Event): void {
    let shouldClose = true;
    const cp = e.composedPath && e.composedPath();
    // @ts-ignore
    const path = (cp || e.path) as Array<EventTarget>;
    for (const pathItem of path) {
      if (pathItem === this.target) {
        shouldClose = false;
        break;
      }
    }
    if (shouldClose) {
      this._close();
    }
  }

  firstUpdated(): void {
    // Styles are defined here because it does not uses shadow root
    // to comply with accessibility requirements.
    // Styles defined in the component's `styles` getter won't be applied
    // to the children.
    const box = this._listbox;
    if (!box) {
      return;
    }
    ensureNodeId(box);
    if (!this.ignoreDropdownStyling) {
      box.style.backgroundColor = 'var(--anypoint-autocomplete-background-color, #fff)';
      box.style.boxShadow = 'var(--anypoint-autocomplete-dropdown-shadow)';
    }
    const { id } = box;
    this.setAttribute('aria-owns', id);
    this.setAttribute('aria-controls', id);
    const target = this._oldTarget;
    if (!target || this.noTargetControls) {
      return;
    }
    target.setAttribute('aria-controls', id);
  }

  /**
   * Normalizes suggestions into a single struct.
   * @param value A list of suggestions to process
   * @return Normalized suggestions
   */
  [processSource](value: Array<string | Suggestion> | undefined | null): InternalSuggestion[] | null {
    if (!Array.isArray(value)) {
      return null;
    }
    const result: InternalSuggestion[] = [];
    value.forEach((item, index) => {
      const normalized = this[normalizeSource](item, index);
      if (normalized) {
        result.push(normalized);
      }
    });
    return result;
  }

  /**
   * Normalizes a suggestion
   * @param value A list of suggestions to process
   * @param index The index of the suggestion on the source list.
   * @return Normalized suggestions
   */
  [normalizeSource](value: Suggestion | string, index: number): InternalSuggestion | null {
    if (typeof value === 'string') {
      return { value, index };
    }
    if (!value.value) {
      return null;
    }
    return { ...value, index };
  }

  /**
   * Handler for target property change.
   */
  _targetChanged(): void {
    const { target, isAttached, _oldTarget } = this;
    if (_oldTarget) {
      _oldTarget.removeEventListener('input', this._targetInputHandler);
      _oldTarget.removeEventListener('focus', this._targetFocusHandler);
      _oldTarget.removeEventListener('keydown', this._targetKeydown);
      this._oldTarget = undefined;
    }
    if (!target || !isAttached) {
      return;
    }
    this.notifyResize();
    if (typeof target === 'string') {
      const parent = this.parentElement;
      if (!parent || !parent.querySelector) {
        return;
      }
      const node = parent.querySelector(`#${target}`) as HTMLInputElement;
      if (node) {
        this.target = node;
      }
    } else if (target) {
      target.addEventListener('input', this._targetInputHandler);
      target.addEventListener('focus', this._targetFocusHandler);
      target.addEventListener('keydown', this._targetKeydown);
      this._setupTargetAria(target);
      this._oldTarget = target;
      if (target === document.activeElement) {
        this._targetFocusHandler();
      }
    }
  }

  /**
   * Sets target input width on the listbox before rendering.
   */
  _setComboboxWidth(): void {
    const { positionTarget, _oldTarget } = this;
    const target = positionTarget || _oldTarget;
    const box = this._listbox;
    if (!target || !box || !target.nodeType || target.nodeType !== Node.ELEMENT_NODE) {
      return;
    }
    const rect = target.getBoundingClientRect();
    const { width } = rect;
    if (!width) {
      return;
    }
    box.style.width = `${width}px`;
  }

  /**
   * Setups the relevant aria attributes in the target input.
   * @param target An element to set attribute on to
   */
  _setupTargetAria(target: HTMLInputElement): void {
    ensureNodeId(this);
    target.setAttribute('aria-autocomplete', 'list');
    target.setAttribute('autocomplete', 'off');
    target.setAttribute('aria-haspopup', 'true');
    target.setAttribute('role', 'combobox');
    target.setAttribute('aria-expanded', 'false');
    // parent node of the input also should have aria attributes
    const parent = target.parentElement;
    if (!parent) {
      return;
    }
    // parent.setAttribute('role', 'combobox');
    // parent.setAttribute('aria-expanded', 'false');
    parent.setAttribute('aria-owns', this.id);
    parent.setAttribute('aria-haspopup', 'listbox');
    if (!parent.hasAttribute('aria-label') && !parent.hasAttribute('aria-labelledby')) {
      parent.setAttribute('aria-label', 'Text input with list suggestions');
    }
  }

  /**
   * Sets `aria-expanded` on input's parent element.
   */
  _openedChanged(opened: boolean): void {
    const target = this._oldTarget;
    if (target) {
      target.setAttribute('aria-expanded', String(opened));
    }
    // const parent = target && target.parentElement;
    // if (!parent) {
    //   return;
    // }
    // parent.setAttribute('aria-expanded', String(opened));
  }

  /**
   * Renders suggestions on target's `input` event
   */
  _targetInputHandler(e: Event): void {
    const typed = e as CustomEvent;
    if (typed.detail || this.disabled) {
      // This event is dispatched by the autocomplete
      return;
    }
    this.renderSuggestions();
  }

  /**
   * Renders suggestions on target input focus if `openOnFocus` is set.
   */
  _targetFocusHandler(): void {
    if (!this.openOnFocus || this.opened || this[autocompleteFocus] || this[ignoreNextFocus] || this.disabled) {
      return;
    }
    this[autocompleteFocus] = true;
    setTimeout(() => {
      this[autocompleteFocus] = false;
      this.renderSuggestions();
    });
  }

  _previousQuery?: string;

  /**
   * Renders suggestions for current input and opens the overlay if
   * there are suggestions to show.
   */
  renderSuggestions(): void {
    if (!this.isAttached || this.disabled) {
      return;
    }
    const target = this._oldTarget;
    if (!target) {
      return;
    }
    let { value } = target;
    if (value === undefined || value === null) {
      value = '';
    }
    if (typeof value !== 'string') {
      value = String(value);
    }
    if (this._previousQuery && value.indexOf(this._previousQuery) === 0) {
      this._previousQuery = value;
      this._filterSuggestions();
      return;
    }
    const box = this._listbox;
    if (box) {
      box.selected = -1;
    }
    this._dispatchQuery(value);
    this._previousQuery = value;
    this._filterSuggestions();
    if (this.loader) {
      this._loading = true;
      if (!this[openedValue]) {
        this._setComboboxWidth();
        this.notifyResize();
        this[openedValue] = true;
      }
    }
  }

  /**
   * Dispatches query event and returns it.
   * @param value Current input value.
   */
  _dispatchQuery(value: string): CustomEvent {
    const e = new CustomEvent('query', {
      detail: {
        value
      }
    });
    this.dispatchEvent(e);
    return e;
  }

  /**
   * Filter `source` array for current value.
   */
  async _filterSuggestions(): Promise<void> {
    if (!this._oldTarget || this._previousQuery === undefined) {
      return;
    }
    const suggestionsBefore = (this._suggestions || []).length;
    this._suggestions = [];
    const source = this[suggestionsValue];
    if (!source || !source.length) {
      this[openedValue] = false;
      return;
    }
    const query = this._previousQuery ? this._previousQuery.toLowerCase() : '';
    const filtered = this._listSuggestions(source, query);
    if (filtered.length === 0) {
      this[openedValue] = false;
      return;
    }
    filtered.sort((a, b) => {
      const valueA = String(a.value);
      const valueB = String(b.value);
      const lowerA = valueA.toLowerCase();
      const lowerB = valueB.toLowerCase();
      const aIndex = lowerA.indexOf(query);
      const bIndex = lowerB.indexOf(query);
      if (aIndex === bIndex) {
        return valueA.localeCompare(valueB);
      }
      if (aIndex === 0 && bIndex !== 0) {
        return -1;
      }
      if (bIndex === 0 && aIndex !== 0) {
        return 1;
      }
      if (valueA > valueB) {
        return 1;
      }
      if (valueA < valueB) {
        return -1;
      }
      return valueA.localeCompare(valueB);
    });
    this._suggestions = filtered;
    const suggestionsAfter = filtered.length;
    if (!this.opened) {
      this[openedValue] = true;
    }
    this.requestUpdate();
    await this.updateComplete;
    if (suggestionsAfter !== suggestionsBefore) {
      this._setComboboxWidth();
      this.notifyResize();
    }
  }

  /**
   * Filters out suggestions
   * @param source Source suggestions (normalized)
   * @param query Filter term
   * @return Filtered suggestions.
   */
  _listSuggestions(source: InternalSuggestion[], query: string): InternalSuggestion[] {
    if (!query && this.openOnFocus) {
      return source;
    }
    const filterFn = (item: InternalSuggestion): boolean => {
      const { value = '', filter } = item;
      const filterValue = filter || String(value);
      return filterValue.toLowerCase().includes(query);
    };
    return source.filter(filterFn);
  }

  _closeHandler(e: Event): void {
    retarget(e, this);
    this._close();
  }

  protected _close(): void {
    if (this[openedValue]) {
      this[openedValue] = false;
    }
  }

  notifyResize(): void {
    const node = this.querySelector('anypoint-dropdown');
    if (node) {
      // @ts-ignore
      node.notifyResize();
      node.refit();
    }
  }

  _selectionHandler(e: Event): void {
    const list = e.target as AnypointListboxElement;
    const { selected } = list;
    if (selected === -1 || selected === null || selected === undefined) {
      return;
    }
    this._selectSuggestion(Number(selected));
  }

  /**
   * Inserts selected suggestion into the text box and closes the suggestions.
   * @param selected Index of suggestion to use.
   */
  _selectSuggestion(selected: number): void {
    // pick from the currently rendered suggestions, selected refers to this list
    const value = this._suggestions![selected] as InternalSuggestion;
    if (!value) {
      return;
    }
    const target = this.target as HTMLInputElement;
    // The suggestion on the `_suggestions` is a subset of `[suggestionsValue]`
    // that has the `index` property, which refers to the index position on the source list.
    const sourceSuggestion = this.source![value.index];
    if (!sourceSuggestion) {
      // the source must have changed.
      return;
    }
    const result = String(value.value);

    if (!this.noTargetValueUpdate) {
      target.value = result;
      target.dispatchEvent(
        new CustomEvent('input', {
          detail: {
            autocomplete: this
          }
        })
      );
    }

    this[openedValue] = false;
    this._inform(sourceSuggestion);
    if (!this.__ignoreCloseRefocus) {
      this._refocusTarget();
    }
  }

  _refocusTarget(): void {
    this[ignoreNextFocus] = true;
    const node = this.target as HTMLInputElement;
    node.blur();
    node.focus();
    setTimeout(() => {
      this[ignoreNextFocus] = false;
    });
  }

  /**
   * Handler for the keydown event.
   * @param {KeyboardEvent} e
   */
  _targetKeydown(e: KeyboardEvent): void {
    if (this.disabled) {
      return;
    }
    if (e.code === 'ArrowDown') {
      this._onDownKey();
      e.preventDefault();
      e.stopPropagation();
    } else if (e.code === 'ArrowUp') {
      this._onUpKey();
      e.preventDefault();
      e.stopPropagation();
    } else if (e.code === 'Enter' || e.code === 'NumEnter') {
      this._onEnterKey();
    } else if (e.code === 'Tab') {
      this._onTabDown();
    } else if (e.code === 'Escape') {
      this._onEscKey();
    }
  }

  /**
   * If the dropdown is opened then it focuses on the first element on the list.
   * If closed it opens the suggestions and focuses on the first element on
   * the list.
   */
  _onDownKey(): void {
    if (!this[openedValue]) {
      this.renderSuggestions();
      setTimeout(() => {
        this._listbox?.highlightNext();
      });
    } else {
      this._listbox?.highlightNext();
    }
  }

  /**
   * If the dropdown is opened then it focuses on the last element on the list.
   * If closed it opens the suggestions and focuses on the last element on
   * the list.
   */
  _onUpKey(): void {
    if (!this[openedValue]) {
      this.renderSuggestions();
      setTimeout(() => {
        if (this[openedValue]) {
          this._listbox?.highlightPrevious();
        }
      });
    } else {
      this._listbox?.highlightPrevious();
    }
  }

  /**
   * Closes the dropdown.
   */
  _onEscKey(): void {
    this[openedValue] = false;
  }

  /**
   * Accepts first suggestion from the dropdown when opened.
   */
  _onEnterKey(): void {
    if (!this[openedValue]) {
      return;
    }
    const { _listbox } = this;
    if (_listbox) {
      const { highlightedItem } = _listbox;
      if (highlightedItem) {
        const index = Number(_listbox.indexOf(highlightedItem));
        if (!Number.isNaN(index) && index > -1) {
          this._selectSuggestion(index);
          return;
        }
      }
    }
    this._selectSuggestion(0);
  }

  /**
   * The element refocuses on the input when suggestions closes.
   * Also, the listbox element is focusable so with tab it can be next target.
   * Finally, the dropdown has close animation that takes some time to finish
   * so it will try to refocus after the animation finish.
   * This function sets flags in debouncer to prohibit this.
   */
  _onTabDown(): void {
    if (this[openedValue]) {
      if (this._listbox) {
        this._listbox.tabIndex = -1;
      }
      this[ignoreNextFocus] = true;
      this.__ignoreCloseRefocus = true;
      this[openedValue] = false;
      setTimeout(() => {
        if (this._listbox) {
          this._listbox.tabIndex = 0;
        }
        this[ignoreNextFocus] = false;
        this.__ignoreCloseRefocus = false;
      }, 300);
    }
  }

  /**
   * Dispatches `selected` event with new value.
   *
   * @param value Selected value.
   */
  _inform(value: string | Suggestion): void {
    const ev = new CustomEvent('selected', {
      detail: {
        value
      },
      cancelable: true
    });
    this.dispatchEvent(ev);
  }

  async _dropdownResizedHandler(): Promise<void> {
    if (!this.opened) {
      return;
    }
    await this.updateComplete;
    setTimeout(() => this.dispatchEvent(new Event('resize')));
  }

  render(): TemplateResult {
    const {
      _oldTarget,
      verticalAlign,
      horizontalAlign,
      scrollAction,
      horizontalOffset,
      verticalOffset,
      noAnimations,
      anypoint,
      fitPositionTarget,
      positionTarget,
    } = this;
    const offset = anypoint ? -2 : 0;
    const finalVerticalOffset = (verticalOffset || 0) + offset;
    return html`
    <anypoint-dropdown
      .positionTarget="${positionTarget || _oldTarget}"
      .verticalAlign="${verticalAlign}"
      .verticalOffset="${finalVerticalOffset}"
      .horizontalAlign="${horizontalAlign}"
      .horizontalOffset="${horizontalOffset}"
      .scrollAction="${scrollAction}"
      .opened="${this[openedValue]}"
      .noAnimations="${noAnimations}"
      ?fitPositionTarget="${fitPositionTarget}"
      noautofocus
      ?noOverlap=${this.noOverlap}
      @closed="${this._closeHandler}"
      @resize="${this._dropdownResizedHandler}"
      @opened="${retargetHandler}"
      @cancel="${retargetHandler}"
      noCancelOnOutsideClick
    >
      ${this._listboxTemplate()}
    </anypoint-dropdown>
    `;
  }

  /**
   * @returns Returns a template for the listbox
   */
  _listboxTemplate(): TemplateResult {
    return html`
      <anypoint-listbox aria-label="Use arrows and enter to select list item. Escape to close the list."
        slot="dropdown-content" selectable="anypoint-item,anypoint-item-body" useAriaSelected
        @select="${this._selectionHandler}" ?anypoint="${this.anypoint}">
        ${this._loaderTemplate()}
        ${this._listTemplate()}
      </anypoint-listbox>
    `;
  }

  /**
   * @returns Returns a template for the progress bar
   */
  _loaderTemplate(): TemplateResult | string {
    const { loader, _loading } = this;
    const _showLoader = !!loader && !!_loading;
    if (!_showLoader) {
      return '';
    }
    return html`<progress style="width: 100%"></progress>`;
  }

  /**
   * @returns Returns a template for the list item
   */
  _listTemplate(): TemplateResult[] {
    const { _suggestions = [] } = this;
    return _suggestions.map((item) => this[itemTemplate](item as Suggestion));
  }

  /**
   * @param item A suggestion to render
   * @returns Value for the label part of the suggestion
   */
  [readLabelValue](item: Suggestion): TemplateResult | string {
    if (item.label && item.label.constructor) {
      return item.label;
    }
    return String(item.label || item.value);
  }

  /**
   * @param item A suggestion to render
   * @returns Template for a single drop down item
   */
  [itemTemplate](item: Suggestion): TemplateResult {
    const label = this[readLabelValue](item);
    const { description } = item;
    const { anypoint } = this;
    if (description) {
      return html`
      <anypoint-item ?anypoint="${anypoint}">
        <anypoint-item-body ?anypoint="${anypoint}" twoline>
          <div>${label}</div>
          <div data-secondary>${description}</div>
        </anypoint-item-body>
      </anypoint-item>`;
    }
    return html`<anypoint-item ?anypoint="${anypoint}">
  <div>${label}</div>
</anypoint-item>`;
  }
}
