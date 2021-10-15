/* eslint-disable lit-a11y/click-events-have-key-events */
import { html} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map.js';
import AnypointInputElement from './AnypointInputElement.js';
import '../anypoint-dropdown.js';
import { arrowDown } from './InputComboboxIcons.js';
import elementStyles from './styles/InputComboboxStyles.js';

export const dropdownTemplate = Symbol('dropdownTemplate');
export const openedChanged = Symbol('openedChanged');
export const openedValue = Symbol('openedValue');
export const dropdownClosed = Symbol('dropdownClosed');
export const dropdownOpened = Symbol('dropdownOpened');
export const selectHandler = Symbol('selectHandler');
export const deselectHandler = Symbol('deselectHandler');
export const keydownHandler = Symbol('keydownHandler');
export const onArrowUp = Symbol('onArrowUp');
export const onArrowDown = Symbol('onArrowDown');
export const onEsc = Symbol('onEsc');

/**
 * `anypoint-input-combobox`
 */
export default class AnypointInputComboboxElement extends AnypointInputElement {
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
       * Whether the dropdown is rendered.
       */
      opened: { type: Boolean, reflect: true },
      /**
       * The orientation against which to align the element vertically
       * relative to the `positionTarget`. Possible values are "top", "bottom",
       * "middle", "auto".
       */
      verticalAlign: { type: String },
      /**
       * The orientation against which to align the element horizontally
       * relative to the `positionTarget`. Possible values are "left", "right",
       * "center", "auto".
       */
      horizontalAlign: { type: String },
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
       */
      verticalOffset: { type: Number },
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
       */
      horizontalOffset: { type: Number },
      /**
       * If true, it will use `horizontalAlign` and `verticalAlign` values as
       * preferred alignment and if there's not enough space, it will pick the
       * values which minimize the cropping.
       */
      dynamicAlign: { type: Boolean, reflect: true },
      /**
       * Will position the list around the button without overlapping
       * it.
       */
      noOverlap: { type: Boolean },
      /**
       * An animation config. If provided, this will be used to animate the
       * opening of the dropdown. Pass an Array for multiple animations.
       * See `neon-animation` documentation for more animation configuration
       * details.
       */
      openAnimationConfig: { type: Object },

      /**
       * An animation config. If provided, this will be used to animate the
       * closing of the dropdown. Pass an Array for multiple animations.
       * See `neon-animation` documentation for more animation configuration
       * details.
       */
      closeAnimationConfig: { type: Object },
      /**
       * Set to true to disable animations when opening and closing the
       * dropdown.
       */
      noAnimations: { type: Boolean, reflect: true },
      /**
       * By default, the dropdown will constrain scrolling on the page
       * to itself when opened.
       * Set to true in order to prevent scroll from being constrained
       * to the dropdown when it opens.
       * This property is a shortcut to set `scrollAction` to lock or refit.
       * Prefer directly setting the `scrollAction` property.
       */
      allowOutsideScroll: { type: Boolean, reflect: true },
      /**
       * Dropdown fits the content width.
       * Default value is false.
       */
      fitPositionTarget: { type: Boolean },
    };
  }

  get opened() {
    return this[openedValue];
  }

  set opened(value) {
    const old = this[openedValue];
    if (old === value) {
      return;
    }
    if (value && this.disabled) {
      return;
    }
    this[openedValue] = value;
    this.requestUpdate('opened', old);
    this[openedChanged](value);
  }

  /**
   * @return {HTMLElement|null} The content element that is contained by the dropdown, if any.
   */
  get contentElement() {
    const slot = /** @type HTMLSlotElement */ (this.shadowRoot.querySelector('slot[name="dropdown-content"]'));
    if (!slot) {
      return null;
    }
    const nodes = slot.assignedElements();
    return /** @type HTMLElement */(Array.from(nodes).find((node) => node.nodeType === Node.ELEMENT_NODE));
  }

  constructor() {
    super();
    this.horizontalAlign = 'left';
    this.verticalAlign = 'top';
    this.noAnimations = false;
    this.allowOutsideScroll = false;
    this.dynamicAlign = false;
    this.noOverlap = false;
    this.horizontalOffset = 0;
    this.verticalOffset = 0;
    this.openAnimationConfig = undefined;
    this.closeAnimationConfig = undefined;
    this.fitPositionTarget = false;

    this[keydownHandler] = this[keydownHandler].bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.opened === undefined) {
      this.opened = false;
    }
    if (!this.hasAttribute('aria-haspopup')) {
      this.setAttribute('aria-haspopup', 'true');
    }
    this.addEventListener('keydown', this[keydownHandler]);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this[keydownHandler]);
  }

  firstUpdated(updated) {
    super.firstUpdated(updated);
    const ce = this.contentElement;
    if (ce) {
      ce.setAttribute('aria-expanded', String(this.opened));
    }
  }

  [openedChanged](opened) {
    const openState = opened ? 'true' : 'false';
    this.setAttribute('aria-expanded', openState);
    const ce = this.contentElement;
    if (ce) {
      ce.setAttribute('aria-expanded', openState);
    }
  }

  /**
   * Toggles the dropdown opened state
   */
  toggle() {
    this.opened = !this.opened;
  }

  /**
   * Handler for the keydown event.
   * @param {KeyboardEvent} e
   */
  [keydownHandler](e) {
    if (e.key === 'ArrowDown') {
      this[onArrowDown](e);
    } else if (e.key === 'ArrowUp') {
      this[onArrowUp](e);
    }
  }

  /**
   * Handles arrow down press.
   * Opens the dropdown if not opened and moves selection when needed.
   *
   * @param {KeyboardEvent} e
   */
  [onArrowUp](e) {
    if (!this.opened) {
      this.opened = true;
    } else {
      const ce = this.contentElement;
      // @ts-ignore
      if (ce && ce.focusPrevious) {
        // @ts-ignore
        ce.focusPrevious();
      }
    }
    e.preventDefault();
    e.stopPropagation();
  }

  /**
   * Handles arrow up press.
   * Opens the dropdown if not opened and moves selection when needed.
   *
   * @param {KeyboardEvent} e
   */
  [onArrowDown](e) {
    if (!this.opened) {
      this.opened = true;
    } else {
      const ce = this.contentElement;
      // @ts-ignore
      if (ce && ce.focusNext) {
        // @ts-ignore
        ce.focusNext();
      }
    }
    e.preventDefault();
    e.stopPropagation();
  }

  /**
   * Sets value after an item was selected in the dropdown.
   * @param {CustomEvent} e
   */
  [selectHandler](e) {
    this.opened = false;
    // @ts-ignore
    const node = /** @type HTMLElement */ (e.detail.item);
    if (!node) {
      return;
    }
    // @ts-ignore
    const value = node.label || node.getAttribute('label') || node.textContent.trim();
    this.value = value;
    // the input is dispatched as selection changes the input value
    // but the input won't dispatch this event in this situation. However,
    // this is an input from the user side. Change, however, is dispatched
    // when value is changed on the input's property.
    this.dispatchEvent(new CustomEvent('input'));
    this.dispatchEvent(new CustomEvent('change'));
  }

  [dropdownClosed]() {
    this.opened = false;
    this.inputElement.focus();
  }

  [dropdownOpened]() {
    this.opened = true;
  }

  render() {
    return html`
    <style>${this.styles}</style>
    ${super.render()}
    ${this[dropdownTemplate]()}
    `;
  }

  _suffixTemplate() {
    const classes = classMap({
      'trigger-icon': true,
      'opened': this.opened,
    });
    return html`
    <div class="suffixes">
      <slot name="suffix"></slot>
      <span class="${classes}"
        aria-label="Activate to toggle suggestions"
        title="Toggle suggestions"
        @click="${this.toggle}"
      >${arrowDown}</span>
    </div>`;
  }

  [dropdownTemplate]() {
    const {
      opened,
      horizontalAlign,
      verticalAlign,
      dynamicAlign,
      horizontalOffset,
      verticalOffset,
      noOverlap,
      openAnimationConfig,
      closeAnimationConfig,
      noAnimations,
      allowOutsideScroll,
      fitPositionTarget,
    } = this;
    return html`
    <anypoint-dropdown
      ?fitPositionTarget="${fitPositionTarget}"
      ?opened="${opened}"
      .horizontalAlign="${horizontalAlign}"
      .verticalAlign="${verticalAlign}"
      ?dynamicAlign="${dynamicAlign}"
      .horizontalOffset="${horizontalOffset}"
      .verticalOffset="${verticalOffset}"
      ?noOverlap="${noOverlap}"
      .openAnimationConfig="${openAnimationConfig}"
      .closeAnimationConfig="${closeAnimationConfig}"
      ?noAnimations="${noAnimations}"
      ?allowOutsideScroll="${allowOutsideScroll}"
      @overlay-closed="${this[dropdownClosed]}"
      @overlay-opened="${this[dropdownOpened]}"
      @select="${this[selectHandler]}"
    >
      <div slot="dropdown-content" class="dropdown-content">
        <slot id="content" name="dropdown-content"></slot>
      </div>
    </anypoint-dropdown>
    `;
  }
}
