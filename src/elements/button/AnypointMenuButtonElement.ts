/* eslint-disable lit-a11y/click-events-have-key-events */
import { CSSResult, TemplateResult, html, PropertyValueMap, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import AnypointElement from '../AnypointElement.js';
import AnypointDropdownElement from '../drop-down/AnypointDropdownElement.js';
import { HorizontalAlign, VerticalAlign } from '../overlay/FitElement.js';
import { addListener, getListener } from '../../lib/ElementEventsRegistry.js';
import '../../define/anypoint-dropdown.js';
import { DefaultListOpenAnimation, DefaultListCloseAnimation } from '../../lib/Animations.js';
import { retarget, retargetHandler } from '../../lib/Events.js';

/* eslint-disable no-plusplus */

/**
 * @fires dropdownopen
 * @fires dropdownclose
 * @slot dropdown-trigger - The child that is a trigger image for the menu
 * @slot dropdown-content - The child that is the content to render after opening
 */
export default class AnypointMenuButtonElement extends AnypointElement {
  // eslint-disable-next-line class-methods-use-this
  static get styles(): CSSResult {
    return css`
    :host {
      display: inline-block;
      position: relative;
      padding: 8px;
      outline: none;
    }
    
    :host([disabled]) {
      cursor: auto;
      color: var(--disabled-text-color);
    }
    
    .dropdown-content {
      box-shadow: var(--anypoint-menu-button-context-shadow, var(--anypoint-dropdown-shadow));
      position: relative;
      border-radius: var(--anypoint-menu-button-border-radius, 2px);
      background-color: var(--anypoint-menu-button-dropdown-background, var(--primary-background-color));
    }
    
    :host([verticalalign="top"]) .dropdown-content {
      margin-bottom: 20px;
      margin-top: -10px;
      top: 10px;
    }
    
    :host([verticalalign="bottom"]) .dropdown-content {
      bottom: 10px;
      margin-bottom: -10px;
      margin-top: 20px;
    }
    
    #trigger {
      cursor: pointer;
    }
    
    :host([anypoint]) .dropdown-content {
      box-shadow: none;
      border-top-width: 2px;
      border-bottom-width: 2px;
      border-top-color: var(--anypoint-menu-button-border-top-color, var(--anypoint-color-aluminum4));
      border-bottom-color: var(--anypoint-menu-button-border-bottom-color, var(--anypoint-color-aluminum4));
      border-top-style: solid;
      border-bottom-style: solid;
    }
    `;
  }

  /**
   * If true, the button is a toggle and is currently in the active state.
   * @attr
   */
  @property({ reflect: true, type: Boolean }) disabled?: boolean;

  /**
   * True if the content is currently displayed.
   * @attr
   */
  @property({ type: Boolean, reflect: true }) opened?: boolean;

  /**
   * The orientation against which to align the menu dropdown
   * horizontally relative to the dropdown trigger.
   * @attr
   */
  @property({ type: String, reflect: true }) horizontalAlign: HorizontalAlign = 'left';

  /**
   * The orientation against which to align the menu dropdown
   * vertically relative to the dropdown trigger.
   * @attr
   */
  @property({ type: String, reflect: true }) verticalAlign: VerticalAlign = 'top';

  /**
   * If true, the `horizontalAlign` and `verticalAlign` properties will
   * be considered preferences instead of strict requirements when
   * positioning the dropdown and may be changed if doing so reduces
   * the area of the dropdown falling outside of `fitInto`.
   * @attr
   */
  @property({ type: Boolean, reflect: true }) dynamicAlign?: boolean;

  /**
   * A pixel value that will be added to the position calculated for the
   * given `horizontalAlign`. Use a negative value to offset to the
   * left, or a positive value to offset to the right.
   * @attr
   */
  @property({ type: Number, reflect: true }) horizontalOffset?: number;

  /**
   * A pixel value that will be added to the position calculated for the
   * given `verticalAlign`. Use a negative value to offset towards the
   * top, or a positive value to offset towards the bottom.
   * @attr
   */
  @property({ type: Number, reflect: true }) verticalOffset?: number;

  /**
   * If true, the dropdown will be positioned so that it doesn't overlap
   * the button.
   * @attr
   */
  @property({ type: Boolean, reflect: true }) noOverlap?: boolean;

  /**
   * Set to true to disable animations when opening and closing the
   * dropdown.
   * @attr
   */
  @property({ type: Boolean, reflect: true }) noAnimations?: boolean;

  /**
   * By default, the dropdown will constrain scrolling on the page
   * to itself when opened.
   * Set to true in order to prevent scroll from being constrained
   * to the dropdown when it opens.
   * @attr
   */
  @property({ type: Boolean, reflect: true }) allowOutsideScroll?: boolean;

  /**
   * Set to true to disable automatically closing the dropdown after
   * a selection has been made.
   * @attr
   */
  @property({ type: Boolean, reflect: true }) ignoreSelect?: boolean;

  /**
   * This is the element intended to be bound as the focus target
   * for the `anypoint-dropdown` contained by `anypoint-menu-button`.
   */
  @state() _dropdownContent?: HTMLElement;

  get dropdown(): AnypointDropdownElement {
    return this.shadowRoot!.querySelector('#dropdown') as AnypointDropdownElement;
  }

  get contentElement(): HTMLElement | null {
    const slot = this.shadowRoot!.querySelector('#content') as HTMLSlotElement;
    /* istanbul ignore if */
    if (!slot) {
      return null;
    }
    const nodes = slot.assignedElements();
    for (let i = 0, l = nodes.length; i < l; i++) {
      if (nodes[i].nodeType === Node.ELEMENT_NODE) {
        return nodes[i] as HTMLElement;
      }
    }
    /* istanbul ignore if */
    return null;
  }

  /**
   * @return Previously registered handler for `select` event
   */
  get onselect(): EventListener | null {
    return getListener('select', this);
  }

  /**
   * Registers a callback function for `select` event
   * @param value A callback to register. Pass `null` or `undefined`
   * to clear the listener.
   */
  set onselect(value: EventListener | null) {
    addListener('select', value, this);
  }

  constructor() {
    super();
    this.addEventListener('selected', this._selectHandler.bind(this));
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'group');
    this.setAttribute('aria-haspopup', 'true');
  }

  protected willUpdate(cp: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (cp.has('disabled')) {
      this._disabledChanged();
    }
    if (cp.has('opened')) {
      this._openedChanged();
    }
    super.willUpdate(cp);
  }

  protected updated(cp: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.updated(cp);
    if (cp.has('opened')) {
      this._notifyOpened();
    }
  }

  _openedHandler(e: Event): void {
    const dd = e.target as AnypointDropdownElement;
    const { opened } = dd;
    this.opened = opened;
  }

  /**
  * Toggles the dropdown content between opened and closed.
  */
  toggle(): void {
    if (this.opened) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Make the dropdown content appear as an overlay positioned relative
   * to the dropdown trigger.
   */
  open(): void {
    if (this.disabled) {
      return;
    }
    // this.dropdown.open();
    this.opened = true;
  }

  /**
   * Hides the dropdown content
   */
  close(): void {
    // this.dropdown?.close();
    this.opened = false;
  }

  protected _selectHandler(): void {
    if (!this.ignoreSelect) {
      this.close();
    }
  }

  protected _disabledChanged(): void {
    if (this.disabled && this.opened) {
      this.close();
    }
  }

  protected _openedChanged(): void {
    if (this.disabled) {
      if (this.opened) {
        this.close();
      }
      return;
    }
    if (this.opened) {
      this._dropdownContent = this.contentElement || undefined;
    }
  }

  protected _notifyOpened(): void {
    let type;
    if (this.opened) {
      type = 'dropdownopen';
    } else {
      type = 'dropdownclose';
    }
    this.dispatchEvent(new Event(type));
  }

  __overlayCanceledHandler(e: Event): void {
    const trigger = this.shadowRoot!.querySelector('#trigger') as Element;
    const path = e.composedPath();
    if (path.indexOf(trigger) > -1) {
      e.preventDefault();
    } else {
      retarget(e, this);
    }
  }

  _closedHandler(e: Event): void {
    retarget(e, this);
    const slot = this.shadowRoot!.querySelector('slot[name=dropdown-trigger]') as HTMLSlotElement;
    const triggers = slot.assignedElements() as HTMLElement[];
    for (const trigger of triggers) {
      if (typeof trigger.focus === 'function') {
        trigger.focus();
        break;
      }
    }
  }

  render(): TemplateResult {
    const {
      opened,
      horizontalAlign,
      verticalAlign,
      dynamicAlign,
      horizontalOffset,
      verticalOffset,
      noOverlap,
      noAnimations,
      allowOutsideScroll,
      _dropdownContent
    } = this;
    return html`
    <div id="trigger" @click="${this.toggle}">
      <slot name="dropdown-trigger"></slot>
    </div>

    <anypoint-dropdown
      id="dropdown"
      .opened="${opened}"
      @openedchange="${this._openedHandler}"
      horizontalAlign="${ifDefined(horizontalAlign)}"
      verticalAlign="${ifDefined(verticalAlign)}"
      horizontalOffset="${ifDefined(horizontalOffset)}"
      verticalOffset="${ifDefined(verticalOffset)}"
      ?dynamicAlign="${dynamicAlign}"
      ?noOverlap="${noOverlap}"
      ?noAnimations="${noAnimations}"
      .focusTarget="${_dropdownContent}"
      ?allowOutsideScroll="${allowOutsideScroll}"
      .openAnimationConfig="${DefaultListOpenAnimation}"
      .closeAnimationConfig="${DefaultListCloseAnimation}"
      @cancel="${this.__overlayCanceledHandler}"
      @closed="${this._closedHandler}"
      @opened="${retargetHandler}"
    >
      <div slot="dropdown-content" class="dropdown-content"><slot id="content" name="dropdown-content"></slot></div>
    </anypoint-dropdown>
    `;
  }
}
