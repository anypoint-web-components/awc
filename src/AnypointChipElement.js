/* eslint-disable lit-a11y/click-events-have-key-events */
/* eslint-disable class-methods-use-this */
import { LitElement, html } from 'lit-element';
import { clear } from '@advanced-rest-client/arc-icons';
import { classMap } from 'lit-html/directives/class-map.js';
import elementStyles from './styles/ChipStyles.js';

/** @typedef {import('lit-element').SVGTemplateResult} SVGTemplateResult */
/** @typedef {import('lit-element').TemplateResult} TemplateResult */

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
export default class AnypointChipElement extends LitElement {
  static get styles() {
    return elementStyles;
  }

  static get properties() {
    return {
      /**
       * If set the chip can be removed.
       * The element does not remove itself from the DOM. It rather dispatch
       * `chipremoved` custom event to inform parent element about the action.
       * @attribute
       */
      removable: { type: Boolean },
      /**
       * If true, the user cannot interact with this element.
       * @attribute
       */
      disabled: { type: Boolean, reflect: true },
      /**
       * If true, the button toggles the active state with each click or press
       * of the space bar or enter.
       * @attribute
       */
      toggles: { type: Boolean, reflect: true },
      /**
       * Enables Anypoint compatibility
       * @attribute
       */
      compatibility: { type: Boolean, reflect: true }
    };
  }

  set disabled(value) {
    this.__disabled = value;
    this._disabledChanged(value);
  }

  /**
   * @return {Boolean} True if the button is in disabled state.
   */
  get disabled() {
    return this.__disabled;
  }

  /**
   * @return {Boolean} True if the button is currently in active state. Only
   * available if the button `toggles`.
   */
  get active() {
    return this.__active;
  }

  get _active() {
    return this.__active;
  }

  set _active(value) {
    this.__active = value;
    this.__activeChanged(value);
  }

  /**
   * @return {Boolean} True if the button is currently in focused state.
   */
  get focused() {
    return this.__focused || false;
  }

  get _focused() {
    return this.__focused;
  }

  set _focused(value) {
    this.__focused = value;
    if (value && !this.hasAttribute('focused')) {
      this.setAttribute('focused', '');
    } else if (!value && this.hasAttribute('focused')) {
      this.removeAttribute('focused');
    }
  }

  /**
   * @return {SVGTemplateResult} An icon to render when `removable` is set.
   * @default ARC's `clear` icon.
   */
  get removeIcon() {
    return this._removeIcon || clear;
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
  set removeIcon(value) {
    if (value && (!value.constructor || value.constructor.name !== 'SVGTemplateResult')) {
      return;
    }
    const old = this._removeIcon;
    this._removeIcon = value;
    this.requestUpdate('removeIcon', old);
  }

  /**
   * @return {HTMLSlotElement} Reference to the icon slot element.
   */
  get _iconSlot() {
    return this.shadowRoot.querySelector('slot[name="icon"]');
  }

  constructor() {
    super();
    this._keyDownHandler = this._keyDownHandler.bind(this);
    this._focusBlurHandler = this._focusBlurHandler.bind(this);
    this._clickHandler = this._clickHandler.bind(this);

    this.toggles = false;
    this.removable = false;
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
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

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    this.removeEventListener('keydown', this._keyDownHandler);
    this.removeEventListener('focus', this._focusBlurHandler);
    this.removeEventListener('blur', this._focusBlurHandler);
    this.removeEventListener('click', this._clickHandler);
  }

  /**
   * @param {Map<string | number | symbol, unknown>} changedProperties 
   */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.__firstUpdated = true;
    this._addSlotEvent();
  }

  /**
   * Adds the `slotchange` event listener to the icon slot.
   */
  _addSlotEvent() {
    if (!this.__firstUpdated) {
      return;
    }
    this._iconSlot.addEventListener('slotchange', () => this._detectHasIcon());
  }

  /**
   * Handler for remove icon click event.
   * Cancels the event and calls `remove()`
   *
   * @param {PointerEvent} e
   */
  _removeHandler(e) {
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
  remove() {
    this._active = false;
    this.dispatchEvent(new CustomEvent('chipremoved'));
  }
  
  /**
   * According to material design spec, when there's no icon the
   * left hand side padding should be 12dp. Slotted styling API does now
   * allow to detect when there's no content so it has to be done using
   * node observer.
   */
  _detectHasIcon() {
    const nodes = this._iconSlot.assignedNodes()
      .filter((node) => node.nodeType === Node.ELEMENT_NODE);
    this[hasIconNodeValue] = !!nodes.length;
    this.requestUpdate();
  }

  /**
   * Handler for key down when element is focused.
   * Removes the item when delete key is pressed.
   * @param {KeyboardEvent} e
   */
  _keyDownHandler(e) {
    if (this.removable && (e.key === 'Backspace' || e.key === 'Delete')) {
      this.remove();
    } else if (e.key === ' ' || e.key === 'Enter') {
      this._clickHandler();
      this._asyncClick();
    }
  }

  /**
   * Sets state of the `focused` property depending on the event handled by this
   * listener.
   * @param {Event} e Either focus or blur events
   */
  _focusBlurHandler(e) {
    this._focused = e.type === 'focus';
  }

  /**
   * Called when the value of `disabled` property change. Sets `aria-disabled`
   * and `tabIndex` attributes.
   * @param {boolean} disabled Current value of `disabled` property.
   */
  _disabledChanged(disabled) {
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
  _clickHandler() {
    if (this.toggles) {
      this._userActivate(!this._active);
    } else if (this._active) {
      this._active = false;
    }
  }

  /**
   * Sets `_active` property depending on the input and current state of `_active`.
   * @param {Boolean} active The value to set.
   */
  _userActivate(active) {
    if (this._active !== active) {
      this._active = active;
    }
  }

  /**
   * Calls `click()` function on this element so event listeners can handle
   * the action.
   */
  _asyncClick() {
    setTimeout(() => {
      this.click();
    }, 1);
  }

  /**
   * Called when the `active` value change.
   * It sets `active` attribute and, if the button toggles, `aria-pressed` attribute.
   * @param {boolean} active Current state of `active`./
   */
  __activeChanged(active) {
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

  _iconSlotTemplate() {
    return html`<span part="anypoint-chip-icon" class="icon"><slot name="icon"></slot></span>`;
  }

  _removeTemplate() {
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

  render() {
    const result = {
      'container': true,
      'with-icon': this[hasIconNodeValue],
      'with-remove': this.removable,
    };
    return html`<div part="anypoint-chip-container" class="${classMap(result)}">
      ${this._iconSlotTemplate()}
      <span part="anypoint-chip-label" class="label"><slot></slot></span>
      ${this._removeTemplate()}
    </div>`;
  }
}
