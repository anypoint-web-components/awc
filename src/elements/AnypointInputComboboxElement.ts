/* eslint-disable lit-a11y/click-events-have-key-events */
import { html, TemplateResult, CSSResult, PropertyValueMap } from 'lit';
import { property } from 'lit/decorators';
import { classMap } from 'lit/directives/class-map.js';
import AnypointInputElement from './AnypointInputElement.js';
import { arrowDown } from '../resources/Icons.js';
import elementStyles from '../styles/InputComboboxStyles.js';
import { VerticalAlign, HorizontalAlign } from '../mixins/FitMixin.js';
import '../../define/anypoint-dropdown.js';
import { IAnimationConfig } from '../lib/Animations.js';

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

/** @typedef {import('./mixins/FitMixin').HorizontalAlign} HorizontalAlign */
/** @typedef {import('./mixins/FitMixin').VerticalAlign} VerticalAlign */

/**
 * `anypoint-input-combobox`
 */
export default class AnypointInputComboboxElement extends AnypointInputElement {
  get styles(): CSSResult[] {
    return [
      ...super.styles,
      elementStyles,
    ];
  }

  /**
   * The orientation against which to align the element vertically
   * relative to the `positionTarget`. Possible values are "top", "bottom",
   * "middle", "auto".
   */
  @property({ type: String })
  verticalAlign?: VerticalAlign = 'top';

  /**
   * The orientation against which to align the element horizontally
   * relative to the `positionTarget`. Possible values are "left", "right",
   * "center", "auto".
   */
  @property({ type: String })
  horizontalAlign: HorizontalAlign = 'left';

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
  @property({ type: Number })
  verticalOffset = 0;

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
  @property({ type: Number })
  horizontalOffset = 0;

  /**
   * If true, it will use `horizontalAlign` and `verticalAlign` values as
   * preferred alignment and if there's not enough space, it will pick the
   * values which minimize the cropping.
   */
  @property({ type: Boolean, reflect: true })
  dynamicAlign?: boolean;

  /**
   * Will position the list around the button without overlapping
   * it.
   */
  @property({ type: Boolean })
  noOverlap?: boolean;

  /**
   * An animation config. If provided, this will be used to animate the
   * opening of the dropdown. Pass an Array for multiple animations.
   * See `neon-animation` documentation for more animation configuration
   * details.
   */
  @property({ type: Array })
  openAnimationConfig?: IAnimationConfig[];

  /**
   * An animation config. If provided, this will be used to animate the
   * closing of the dropdown. Pass an Array for multiple animations.
   * See `neon-animation` documentation for more animation configuration
   * details.
   */
  @property({ type: Array })
  closeAnimationConfig?: IAnimationConfig[];

  /**
   * Set to true to disable animations when opening and closing the
   * dropdown.
   */
  @property({ type: Boolean, reflect: true })
  noAnimations?: boolean;

  /**
   * By default, the dropdown will constrain scrolling on the page
   * to itself when opened.
   * Set to true in order to prevent scroll from being constrained
   * to the dropdown when it opens.
   * This property is a shortcut to set `scrollAction` to lock or refit.
   * Prefer directly setting the `scrollAction` property.
   */
  @property({ type: Boolean, reflect: true })
  allowOutsideScroll?: boolean;

  /**
   * Dropdown fits the content width.
   * Default value is false.
   */
  @property({ type: Boolean })
  fitPositionTarget?: boolean;
  
  [openedValue]?: boolean;

  /**
   * Whether the dropdown is rendered.
   * @attribute
   */
  @property({ type: Boolean, reflect: true })
  get opened(): boolean|undefined {
    return this[openedValue];
  }

  set opened(value: boolean|undefined) {
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
   * @returns The content element that is contained by the dropdown, if any.
   */
  get contentElement(): HTMLElement | null {
    const slot = this.shadowRoot!.querySelector('slot[name="dropdown-content"]') as HTMLSlotElement;
    if (!slot) {
      return null;
    }
    const nodes = slot.assignedElements();
    return Array.from(nodes).find((node) => node.nodeType === Node.ELEMENT_NODE) as HTMLElement;
  }

  constructor() {
    super();
    this[keydownHandler] = this[keydownHandler].bind(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (this.opened === undefined) {
      this.opened = false;
    }
    if (!this.hasAttribute('aria-haspopup')) {
      this.setAttribute('aria-haspopup', 'true');
    }
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'combobox');
    }
    this.addEventListener('keydown', this[keydownHandler]);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('keydown', this[keydownHandler]);
  }

  firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.firstUpdated(_changedProperties);
    // const ce = this.contentElement;
    // if (ce) {
    //   ce.setAttribute('aria-expanded', String(this.opened));
    // }
    this.setAttribute('aria-expanded', String(this.opened));
  }

  [openedChanged](opened?: boolean): void {
    const openState = opened ? 'true' : 'false';
    this.setAttribute('aria-expanded', openState);
    // const ce = this.contentElement;
    // if (ce) {
    //   ce.setAttribute('aria-expanded', openState);
    // }
  }

  /**
   * Toggles the dropdown opened state
   */
  toggle(): void {
    this.opened = !this.opened;
  }

  /**
   * Handler for the keydown event.
   */
  [keydownHandler](e: KeyboardEvent): void {
    if (e.code === 'ArrowDown') {
      this[onArrowDown](e);
    } else if (e.code === 'ArrowUp') {
      this[onArrowUp](e);
    }
  }

  /**
   * Handles arrow down press.
   * Opens the dropdown if not opened and moves selection when needed.
   */
  [onArrowUp](e: KeyboardEvent): void {
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
   */
  [onArrowDown](e: KeyboardEvent): void {
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
   */
  [selectHandler](e: CustomEvent): void {
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
    this.dispatchEvent(new Event('input'));
    this.dispatchEvent(new Event('change'));
  }

  [dropdownClosed](): void {
    this.opened = false;
    this.inputElement.focus();
  }

  [dropdownOpened](): void {
    this.opened = true;
  }

  render(): TemplateResult {
    return html`
    <style>${this.styles}</style>
    ${super.render()}
    ${this[dropdownTemplate]()}
    `;
  }

  _suffixTemplate(): TemplateResult {
    const classes = {
      'trigger-icon': true,
      opened: !!this.opened,
    };
    return html`
    <div class="suffixes">
      <slot name="suffix"></slot>
      <span class="${classMap(classes)}"
        title="Toggle suggestions"
        @click="${this.toggle}"
      >${arrowDown}</span>
    </div>`;
  }

  [dropdownTemplate](): TemplateResult {
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
