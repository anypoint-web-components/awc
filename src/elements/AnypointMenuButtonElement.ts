/* eslint-disable lit-a11y/click-events-have-key-events */
import { CSSResult, TemplateResult, html } from 'lit';
import { property, state } from 'lit/decorators';
import { ifDefined } from 'lit/directives/if-defined.js';
import AnypointElement from './AnypointElement.js';
import AnypointDropdownElement from './AnypointDropdownElement.js';
import { ControlStateMixin } from '../mixins/ControlStateMixin.js';
import { HorizontalAlign, VerticalAlign } from '../mixins/FitMixin.js';
import { addListener, getListener } from '../lib/ElementEventsRegistry.js';
import buttonStyles from '../styles/MenuButton.js';
import '../../define/anypoint-dropdown.js';

/* eslint-disable no-plusplus */

export default class AnypointMenuButtonElement extends ControlStateMixin(AnypointElement) {
  // eslint-disable-next-line class-methods-use-this
  get styles(): CSSResult {
    return buttonStyles;
  }

  @state()
  protected _opened?: boolean;
  
  /**
   * True if the content is currently displayed.
   */
  @property({ type: Boolean })
  get opened(): boolean | undefined {
    return this._opened;
  }

  set opened(value: boolean | undefined) {
    const old = this._opened;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this._opened = value;
    this.requestUpdate('opened', old);
    this._openedChanged(value);
  }
  
  /**
   * The orientation against which to align the menu dropdown
   * horizontally relative to the dropdown trigger.
   */
  @property({ type: String, reflect: true })
  horizontalAlign: HorizontalAlign = 'left';
  
  /**
   * The orientation against which to align the menu dropdown
   * vertically relative to the dropdown trigger.
   */
  @property({ type: String, reflect: true })
  verticalAlign: VerticalAlign = 'top';

  /**
   * If true, the `horizontalAlign` and `verticalAlign` properties will
   * be considered preferences instead of strict requirements when
   * positioning the dropdown and may be changed if doing so reduces
   * the area of the dropdown falling outside of `fitInto`.
   */
  @property({ type: Boolean })
  dynamicAlign?: boolean;

  /**
   * A pixel value that will be added to the position calculated for the
   * given `horizontalAlign`. Use a negative value to offset to the
   * left, or a positive value to offset to the right.
   */
  @property({ type: Number })
  horizontalOffset?: number = 0;

  /**
   * A pixel value that will be added to the position calculated for the
   * given `verticalAlign`. Use a negative value to offset towards the
   * top, or a positive value to offset towards the bottom.
   */
  @property({ type: Number })
  verticalOffset?: number = 0;

  /**
   * If true, the dropdown will be positioned so that it doesn't overlap
   * the button.
   */
  @property({ type: Boolean })
  noOverlap?: boolean;
  
  /**
   * Set to true to disable animations when opening and closing the
   * dropdown.
   */
  @property({ type: Boolean })
  noAnimations?: boolean;

  /**
   * By default, the dropdown will constrain scrolling on the page
   * to itself when opened.
   * Set to true in order to prevent scroll from being constrained
   * to the dropdown when it opens.
   */
  @property({ type: Boolean })
  allowOutsideScroll?: boolean;
  
  /**
   * Whether focus should be restored to the button when the menu closes.
   */
  @property({ type: Boolean })
  restoreFocusOnClose?: boolean;

  /**
   * Set to true to disable automatically closing the dropdown after
   * a selection has been made.
   */
  @property({ type: Boolean })
  ignoreSelect?: boolean;

  /**
   * Set to true to enable automatically closing the dropdown after an
   * item has been activated, even if the selection did not change.
   */
  @property({ type: Boolean })
  closeOnActivate?: boolean;

  /**
   * This is the element intended to be bound as the focus target
   * for the `iron-dropdown` contained by `paper-menu-button`.
   */
  @state()
  _dropdownContent?: HTMLElement | null;
  
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
  get onselect(): EventListener {
    return getListener('select', this) as EventListener;
  }

  /**
   * Registers a callback function for `select` event
   * @param value A callback to register. Pass `null` or `undefined`
   * to clear the listener.
   */
  set onselect(value: EventListener) {
    addListener('select', value, this);
  }

  constructor() {
    super();
    this._activateHandler = this._activateHandler.bind(this);
    this._selectHandler = this._selectHandler.bind(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'group');
    this.setAttribute('aria-haspopup', 'true');
    this.addEventListener('activate', this._activateHandler);
    this.addEventListener('selected', this._selectHandler);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('activate', this._activateHandler);
    this.removeEventListener('selected', this._selectHandler);
  }

  _openedHandler(e: Event): void {
    const dd = e.target as AnypointDropdownElement;
    this.opened = dd.opened;
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
    this.dropdown.open();
  }

  /**
   * Hides the dropdown content
   */
  close(): void {
    this.dropdown.close();
  }

  _activateHandler(): void {
    if (this.closeOnActivate) {
      this.close();
    }
  }

  _selectHandler(): void {
    if (!this.ignoreSelect) {
      this.close();
    }
  }

  _disabledChanged(value?: boolean): void {
    super._disabledChanged(value);
    if (value && this.opened) {
      this.close();
    }
  }

  _openedChanged(opened?: boolean): void {
    let type;
    if (opened) {
      this._dropdownContent = this.contentElement;
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
      restoreFocusOnClose,
      _dropdownContent
    } = this;
    return html`
    <style>${this.styles}</style>
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
      ?restoreFocusOnClose="${restoreFocusOnClose}"
      @cancel="${this.__overlayCanceledHandler}"
    >
      <div slot="dropdown-content" class="dropdown-content">
        <slot id="content" name="dropdown-content"></slot>
      </div>
    </anypoint-dropdown>
    `;
  }
}
