/* eslint-disable lit-a11y/click-events-have-key-events */
/* eslint-disable class-methods-use-this */
import { SVGTemplateResult, TemplateResult, CSSResult, html, PropertyValueMap } from 'lit';
import { property, query } from 'lit/decorators.js';
import { classMap, ClassInfo } from 'lit/directives/class-map.js';
import AnypointElement from '../AnypointElement.js';
import { clear } from '../../resources/Icons.js';
import elementStyles from './ChipStyles.js';

export const hasIconNodeValue = Symbol('hasIconNodeValue');
// eslint-disable-next-line no-use-before-define
const tabIndexes = new WeakMap<AnypointChipElement, string>();

/**
 * `anypoint-chip`
 *
 * A compact material design element that represent and input, attribute, or action.
 *
 * A chip contains a label and optionally an icon and remove icon.
 *
 * Remove icon is predefined. However icon can be any HTML element with
 * `slot="icon"` attribute. Per material design guidelines the icon is rounded.
 *
 * ## Example
 *
 * ```html
 * <anypoint-chip removable>
 *  <img src="..." slot="icon"/>
 *  Biking
 * </anypoint-chip>
 * ```
 *
 * The "Biking" is the label rendered next to the icon. The chip also renders
 * built-in remove icon. Clicking on the icon dispatches `chipremoved`
 * custom event only. It does not remove the chip from the document as the
 * application logic might use different ways of removing elements from dom
 * than web platform APIs.
 * 
 * @fires chipremoved - Fired when the user requested to remove the chip.
 * @slot icon - A slot dedicated to render the item icon. It is rendered as a prefix to the label
 * @slot - This element renders any child
 */
export default class AnypointChipElement extends AnypointElement {
  static get styles(): CSSResult {
    return elementStyles;
  }

  /**
   * If set the chip can be removed.
   * The element does not remove itself from the DOM. It rather dispatch
   * `chipremoved` custom event to inform parent element about the action.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) removable?: boolean;
  
  /**
   * If true, the button toggles the active state with each click or press
   * of the space bar or enter.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) toggles?: boolean;

  [hasIconNodeValue] = false;
  
  /**
   * If true, the user cannot interact with this element.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) disabled?: boolean;

  /**
   * @return True if the button is currently in active state. Only available if the button `toggles`.
   */
  @property({ type: Boolean, reflect: true }) active?: boolean;

  /**
   * Whether the element is currently in the focused state.
   */
  @property({ type: Boolean, reflect: true }) focused?: boolean;

  /**
   * An icon to be used to render "remove" icon.
   * It must be an instance of `SVGTemplateResult` that can be created from `lit-html`
   * library.
   *
   * ```javascript
   * import { svg } from 'lit-html';
   * const icon = svg`...`; // content of the icon.
   * ```
   */
  @property({ type: Object }) removeIcon?: SVGTemplateResult;

  /**
   * @return Reference to the icon slot element.
   */
  @query('slot[name="icon"]') protected _iconSlot?: HTMLSlotElement;

  get _removeIcon(): SVGTemplateResult {
    return this.removeIcon || clear;
  }

  constructor() {
    super();
    this.addEventListener('keydown', this._keyDownHandler.bind(this), true);
    this.addEventListener('click', this._clickHandler.bind(this), true);
    const focusBlur = this._focusBlurHandler.bind(this);
    this.addEventListener('focus', focusBlur);
    this.addEventListener('blur', focusBlur);
    this._detectHasIcon = this._detectHasIcon.bind(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'button');
    }
    this._addSlotEvent();
  }

  protected shouldUpdate(cp: PropertyValueMap<any> | Map<PropertyKey, unknown>): boolean {
    if ((cp.has('active') || cp.has('focused')) && this.disabled) {
      return false;
    }
    return true;
  }

  protected willUpdate(cp: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (cp.has('disabled')) {
      this._disabledChanged();
    }
    if (cp.has('active')) {
      this._activeChanged();
    }
    super.willUpdate(cp);
  }

  private __firstUpdated = false;

  firstUpdated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.firstUpdated(changedProperties);
    this.__firstUpdated = true;
    this._addSlotEvent();
  }

  /**
   * Adds the `slotchange` event listener to the icon slot.
   */
  protected _addSlotEvent(): void {
    if (!this.__firstUpdated) {
      return;
    }
    this._iconSlot?.addEventListener('slotchange', this._detectHasIcon);
  }

  /**
   * Handler for remove icon click event.
   * Cancels the event and calls `remove()`
   */
  protected _removeHandler(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this.notifyRemove();
  }

  /**
   * Dispatches `chip-remove` custom event to inform application
   * that the user requested to remove the item.
   *
   * Note, this does not check if `removable` is set
   */
  notifyRemove(): void {
    this.active = false;
    this.dispatchEvent(new Event('chipremoved'));
  }
  
  /**
   * According to material design spec, when there's no icon the
   * left hand side padding should be 12dp. Slotted styling API does now
   * allow to detect when there's no content so it has to be done using
   * node observer.
   */
  protected _detectHasIcon(): void {
    const slot = this._iconSlot;
    if (!slot) {
      return;
    }
    const nodes = slot.assignedNodes().filter((node) => node.nodeType === Node.ELEMENT_NODE);
    this[hasIconNodeValue] = !!nodes.length;
    this.requestUpdate();
  }

  /**
   * Handler for key down when element is focused.
   * Removes the item when delete key is pressed.
   */
  protected _keyDownHandler(e: KeyboardEvent): void {
    if (this.removable && ['Backspace', 'Delete'].includes(e.code)) {
      this.notifyRemove();
    } else if (['Enter', 'Space'].includes(e.code)) {
      this._clickHandler();
      this._asyncClick();
    }
  }

  /**
   * Called when the value of `disabled` property change. Sets `aria-disabled`
   * and `tabIndex` attributes.
   */
  protected _disabledChanged(): void {
    const { disabled } = this;
    this.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    this.style.pointerEvents = disabled ? 'none' : '';
    if (disabled) {
      const old = this.getAttribute('tabindex');
      if (old) {
        tabIndexes.set(this, old);
      }
      this.setAttribute('tabindex', '-1');
      this.blur();
      this.active = false;
      this.focused = false;
    } else if (tabIndexes.has(this)) {
      const old = tabIndexes.get(this)!;
      this.setAttribute('tabindex', old);
    } else {
      this.removeAttribute('tabindex');
    }
  }

  /**
   * Called when the `active` value change.
   * It sets `active` attribute and, if the button toggles, `aria-pressed` attribute.
   */
  protected _activeChanged(): void {
    if (this.toggles) {
      this.setAttribute('aria-pressed', this.active ? 'true' : 'false');
    }
  }

  /**
   * Sets state of the `focused` property depending on the event handled by this
   * listener.
   * @param e Either focus or blur events
   */
  protected _focusBlurHandler(e: Event): void {
    this.focused = e.type === 'focus';
  }

  /**
   * Handles click event (as well as Space and Enter key down) as sets the
   * `active` property.
   */
  protected _clickHandler(): void {
    if (this.toggles) {
      this._userActivate(!this.active);
    } else if (this.active) {
      this.active = false;
    }
  }

  /**
   * Sets `_active` property depending on the input and current state of `_active`.
   * @param active The value to set.
   */
  protected _userActivate(active?: boolean): void {
    if (this.active !== active) {
      this.active = active;
    }
  }

  /**
   * Calls `click()` function on this element so event listeners can handle
   * the action.
   */
  protected _asyncClick(): void {
    setTimeout(() => {
      this.click();
    }, 1);
  }

  protected _iconSlotTemplate(): TemplateResult {
    return html`<span part="anypoint-chip-icon" class="icon"><slot name="icon"></slot></span>`;
  }

  protected _removeTemplate(): TemplateResult | string {
    if (!this.removable) {
      return '';
    }
    const { _removeIcon } = this;
    return html`<span part="anypoint-chip-remove" class="close" @click="${this._removeHandler}" >${_removeIcon}</span>`;
  }

  protected render(): TemplateResult {
    const result: ClassInfo = {
      container: true,
      'with-icon': this[hasIconNodeValue],
      'with-remove': !!this.removable,
    };
    return html`<div part="anypoint-chip-container" class="${classMap(result)}">
      ${this._iconSlotTemplate()}
      <span part="anypoint-chip-label" class="label"><slot></slot></span>
      ${this._removeTemplate()}
    </div>`;
  }
}
