/* eslint-disable lit-a11y/click-events-have-key-events */
import { html, LitElement } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { ControlStateMixin } from './mixins/ControlStateMixin.js';
import '../anypoint-dropdown.js';
import buttonStyles from './styles/MenuButton.js';

/** @typedef {import('./AnypointDropdownElement').default} AnypointDropdownElement */

/* eslint-disable no-plusplus */

export default class AnypointMenuButtonElement extends ControlStateMixin(LitElement) {

  // eslint-disable-next-line class-methods-use-this
  get styles() {
    return buttonStyles;
  }

  static get properties() {
    return {
      /**
       * True if the content is currently displayed.
       */
      opened: { type: Boolean },
      /**
       * The orientation against which to align the menu dropdown
       * horizontally relative to the dropdown trigger.
       */
      horizontalAlign: { type: String, reflect: true },
      /**
       * The orientation against which to align the menu dropdown
       * vertically relative to the dropdown trigger.
       */
      verticalAlign: { type: String, reflect: true },
      /**
       * If true, the `horizontalAlign` and `verticalAlign` properties will
       * be considered preferences instead of strict requirements when
       * positioning the dropdown and may be changed if doing so reduces
       * the area of the dropdown falling outside of `fitInto`.
       */
      dynamicAlign: { type: Boolean },
      /**
       * A pixel value that will be added to the position calculated for the
       * given `horizontalAlign`. Use a negative value to offset to the
       * left, or a positive value to offset to the right.
       */
      horizontalOffset: { type: Number },
      /**
       * A pixel value that will be added to the position calculated for the
       * given `verticalAlign`. Use a negative value to offset towards the
       * top, or a positive value to offset towards the bottom.
       */
      verticalOffset: { type: Number },
      /**
       * If true, the dropdown will be positioned so that it doesn't overlap
       * the button.
       */
      noOverlap: { type: Boolean },
      /**
       * Set to true to disable animations when opening and closing the
       * dropdown.
       */
      noAnimations: { type: Boolean },
      /**
       * By default, the dropdown will constrain scrolling on the page
       * to itself when opened.
       * Set to true in order to prevent scroll from being constrained
       * to the dropdown when it opens.
       */
      allowOutsideScroll: { type: Boolean },
      /**
       * Whether focus should be restored to the button when the menu closes.
       */
      restoreFocusOnClose: { type: Boolean },
      /**
       * Set to true to disable automatically closing the dropdown after
       * a selection has been made.
       */
      ignoreSelect: { type: Boolean },

      /**
       * Set to true to enable automatically closing the dropdown after an
       * item has been activated, even if the selection did not change.
       */
      closeOnActivate: { type: Boolean },
      /**
       * Enables Anypoint theme.
       */
      anypoint: { type: Boolean, reflect: true },
      /**
       * This is the element intended to be bound as the focus target
       * for the `iron-dropdown` contained by `paper-menu-button`.
       */
      _dropdownContent: { type: Object }
    };
  }

  /**
   * @return {AnypointDropdownElement}
   */
  get dropdown() {
    return this.shadowRoot.querySelector('#dropdown');
  }

  get opened() {
    return this._opened;
  }

  set opened(value) {
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
   * @returns {HTMLElement}
   */
  get contentElement() {
    const slot = /** @type HTMLSlotElement */ (this.shadowRoot.querySelector('#content'));
    /* istanbul ignore if */
    if (!slot) {
      return null;
    }
    const nodes = slot.assignedElements();
    for (let i = 0, l = nodes.length; i < l; i++) {
      if (nodes[i].nodeType === Node.ELEMENT_NODE) {
        return /** @type HTMLElement */ (nodes[i]);
      }
    }
    /* istanbul ignore if */
    return null;
  }

  /**
   * @return {EventListener} Previously registered handler for `select` event
   */
  get onselect() {
    return this._onselect;
  }

  /**
   * Registers a callback function for `select` event
   * @param {EventListener} value A callback to register. Pass `null` or `undefined`
   * to clear the listener.
   */
  set onselect(value) {
    if (this._onselect) {
      this.removeEventListener('select', this._onselect);
    }
    if (typeof value !== 'function') {
      this._onselect = null;
      return;
    }
    this._onselect = value;
    this.addEventListener('select', value);
  }

  constructor() {
    super();
    this._activateHandler = this._activateHandler.bind(this);
    this._selectHandler = this._selectHandler.bind(this);

    this.horizontalOffset = 0;
    this.verticalOffset = 0;
    this.horizontalAlign = 'left';
    this.verticalAlign = 'top';

    this.closeOnActivate = false;
    this.ignoreSelect = false;
    this.dynamicAlign = false;
    this.noOverlap = false;
    this.noAnimations = false;
    this.allowOutsideScroll = false;
    this.restoreFocusOnClose = false;
    this.anypoint = false;
  }

  connectedCallback() {
    /* istanbul ignore else */
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    this.setAttribute('role', 'group');
    this.setAttribute('aria-haspopup', 'true');
    this.addEventListener('activate', this._activateHandler);
    this.addEventListener('selected', this._selectHandler);
  }

  disconnectedCallback() {
    /* istanbul ignore else */
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    this.removeEventListener('activate', this._activateHandler);
    this.removeEventListener('selected', this._selectHandler);
  }

  _openedHandler(e) {
    this.opened = e.target.opened;
  }

  /**
  * Toggles the dropdown content between opened and closed.
  */
  toggle() {
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
  open() {
    if (this.disabled) {
      return;
    }
    // @ts-ignore
    this.dropdown.open();
  }

  /**
   * Hides the dropdown content
   */
  close() {
    // @ts-ignore
    this.dropdown.close();
  }

  _activateHandler() {
    if (this.closeOnActivate) {
      this.close();
    }
  }

  _selectHandler() {
    if (!this.ignoreSelect) {
      this.close();
    }
  }

  _disabledChanged(value) {
    super._disabledChanged(value);
    if (value && this.opened) {
      this.close();
    }
  }

  _openedChanged(opened) {
    let type;
    if (opened) {
      this._dropdownContent = this.contentElement;
      type = 'dropdownopen';
    } else {
      type = 'dropdownclose';
    }
    this.dispatchEvent(new Event(type));
  }

  __overlayCanceledHandler(e) {
    const trigger = this.shadowRoot.querySelector('#trigger');
    const path = e.composedPath();
    if (path.indexOf(trigger) > -1) {
      e.preventDefault();
    }
  }

  render() {
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
