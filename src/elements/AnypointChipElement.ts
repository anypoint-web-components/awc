/* eslint-disable lit-a11y/click-events-have-key-events */
/* eslint-disable class-methods-use-this */
import { SVGTemplateResult, TemplateResult, CSSResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap, ClassInfo } from 'lit/directives/class-map.js';
import AnypointElement from './AnypointElement.js';
import { clear } from '../resources/Icons.js';
import elementStyles from '../styles/ChipStyles.js';

export const hasIconNodeValue = Symbol('hasIconNodeValue');
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
  @property({ type: Boolean })
  removable?: boolean;
  
  /**
   * If true, the button toggles the active state with each click or press
   * of the space bar or enter.
   * @attribute
   */
  @property({ type: Boolean, reflect: true })
  toggles?: boolean;
  
  protected __disabled?: boolean;

  protected __active?: boolean;

  protected __focused?: boolean;

  [hasIconNodeValue] = false;
  
  set disabled(value: boolean | undefined) {
    this.__disabled = value;
    this._disabledChanged(value);
  }

  /**
   * If true, the user cannot interact with this element.
   * @attribute
   */
  @property({ type: Boolean, reflect: true })
  get disabled(): boolean | undefined {
    return this.__disabled;
  }

  /**
   * @return True if the button is currently in active state. Only
   * available if the button `toggles`.
   */
  get active(): boolean | undefined {
    return this.__active;
  }

  get _active(): boolean | undefined {
    return this.__active;
  }

  set _active(value: boolean | undefined) {
    this.__active = value;
    this.__activeChanged(value);
  }

  /**
   * @returns True if the button is currently in focused state.
   */
  get focused(): boolean | undefined {
    return this.__focused || false;
  }

  get _focused(): boolean | undefined {
    return this.__focused;
  }

  set _focused(value: boolean | undefined) {
    this.__focused = value;
    if (value && !this.hasAttribute('focused')) {
      this.setAttribute('focused', '');
    } else if (!value && this.hasAttribute('focused')) {
      this.removeAttribute('focused');
    }
  }

  _removeIcon?: SVGTemplateResult;

  /**
   * @return An icon to render when `removable` is set.
   * @default ARC's `clear` icon.
   */
  get removeIcon(): SVGTemplateResult {
    return this._removeIcon || clear;
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
  set removeIcon(value: SVGTemplateResult) {
    const old = this._removeIcon;
    this._removeIcon = value;
    this.requestUpdate('removeIcon', old);
  }

  /**
   * @return Reference to the icon slot element.
   */
  get _iconSlot(): HTMLSlotElement {
    return this.shadowRoot!.querySelector('slot[name="icon"]') as HTMLSlotElement;
  }

  constructor() {
    super();
    this._keyDownHandler = this._keyDownHandler.bind(this);
    this._focusBlurHandler = this._focusBlurHandler.bind(this);
    this._clickHandler = this._clickHandler.bind(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'button');
    }
    /* istanbul ignore else */
    if (this.__active === undefined) {
      this._active = false;
    }
    this._addSlotEvent();
    this.addEventListener('keydown', this._keyDownHandler, true);
    this.addEventListener('focus', this._focusBlurHandler, true);
    this.addEventListener('blur', this._focusBlurHandler, true);
    this.addEventListener('click', this._clickHandler, true);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this._keyDownHandler);
    this.removeEventListener('focus', this._focusBlurHandler);
    this.removeEventListener('blur', this._focusBlurHandler);
    this.removeEventListener('click', this._clickHandler);
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
  _addSlotEvent(): void {
    if (!this.__firstUpdated) {
      return;
    }
    this._iconSlot.addEventListener('slotchange', () => this._detectHasIcon());
  }

  /**
   * Handler for remove icon click event.
   * Cancels the event and calls `remove()`
   */
  _removeHandler(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this.remove();
  }

  /**
   * Dispatches `chip-remove` custom event to inform application
   * that the user requested to remove the item.
   *
   * Note, this does not check if `removable` is set
   */
  remove(): void {
    this._active = false;
    this.dispatchEvent(new CustomEvent('chipremoved'));
  }
  
  /**
   * According to material design spec, when there's no icon the
   * left hand side padding should be 12dp. Slotted styling API does now
   * allow to detect when there's no content so it has to be done using
   * node observer.
   */
  _detectHasIcon(): void {
    const nodes = this._iconSlot.assignedNodes()
      .filter((node) => node.nodeType === Node.ELEMENT_NODE);
    this[hasIconNodeValue] = !!nodes.length;
    this.requestUpdate();
  }

  /**
   * Handler for key down when element is focused.
   * Removes the item when delete key is pressed.
   */
  _keyDownHandler(e: KeyboardEvent): void {
    if (this.removable && ['Backspace', 'Delete'].includes(e.code)) {
      this.remove();
    } else if (['Enter', 'Space'].includes(e.code)) {
      this._clickHandler();
      this._asyncClick();
    }
  }

  /**
   * Sets state of the `focused` property depending on the event handled by this
   * listener.
   * @param e Either focus or blur events
   */
  _focusBlurHandler(e: Event): void {
    this._focused = e.type === 'focus';
  }

  private _oldTabIndex?: string | null;

  /**
   * Called when the value of `disabled` property change. Sets `aria-disabled`
   * and `tabIndex` attributes.
   * @param disabled Current value of `disabled` property.
   */
  _disabledChanged(disabled?: boolean): void {
    this.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    this.style.pointerEvents = disabled ? 'none' : '';
    if (disabled) {
      // Read the `tabindex` attribute instead of the `tabIndex` property.
      // The property returns `-1` if there is no `tabindex` attribute.
      // This distinction is important when restoring the value because
      // leaving `-1` hides shadow root children from the tab order.
      this._oldTabIndex = this.getAttribute('tabindex');
      this._focused = false;
      this.setAttribute('tabindex', '-1');
      this.blur();
    } else if (this._oldTabIndex !== undefined) {
      if (this._oldTabIndex === null) {
        this.removeAttribute('tabindex');
      } else {
        this.setAttribute('tabindex', this._oldTabIndex);
      }
    }
  }

  /**
   * Handles click event (as well as Space and Enter key down) as sets the
   * `active` property.
   */
  _clickHandler(): void {
    if (this.toggles) {
      this._userActivate(!this._active);
    } else if (this._active) {
      this._active = false;
    }
  }

  /**
   * Sets `_active` property depending on the input and current state of `_active`.
   * @param active The value to set.
   */
  _userActivate(active?: boolean): void {
    if (this._active !== active) {
      this._active = active;
    }
  }

  /**
   * Calls `click()` function on this element so event listeners can handle
   * the action.
   */
  _asyncClick(): void {
    setTimeout(() => {
      this.click();
    }, 1);
  }

  /**
   * Called when the `active` value change.
   * It sets `active` attribute and, if the button toggles, `aria-pressed` attribute.
   * @param active Current state of `active`./
   */
  __activeChanged(active?: boolean): void {
    if (active) {
      if (!this.hasAttribute('active')) {
        this.setAttribute('active', '');
      }
    } else if (this.hasAttribute('active')) {
      this.removeAttribute('active');
    }
    if (this.toggles) {
      this.setAttribute('aria-pressed', active ? 'true' : 'false');
    } else if (this.hasAttribute('aria-pressed')) {
      this.removeAttribute('aria-pressed');
    }
  }

  _iconSlotTemplate(): TemplateResult {
    return html`<span part="anypoint-chip-icon" class="icon"><slot name="icon"></slot></span>`;
  }

  _removeTemplate(): TemplateResult | string {
    if (!this.removable) {
      return '';
    }
    const { removeIcon } = this;
    return html`<span
      part="anypoint-chip-remove"
      class="close"
      @click="${this._removeHandler}"
    >${removeIcon}</span>`;
  }

  render(): TemplateResult {
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
