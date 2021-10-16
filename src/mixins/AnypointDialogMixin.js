import { ArcOverlayMixin } from '@advanced-rest-client/arc-overlay-mixin';
import { dedupeMixin } from '@open-wc/dedupe-mixin';

/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */

/**
 * @param {typeof HTMLElement} base
 */
const mxFunction = (base) => {
  class AnypointDialogMixinImpl extends ArcOverlayMixin(base) {
    static get properties() {
      return {
        /**
         * If `modal` is true, this implies `noCancelOnOutsideClick`,
         * `noCancelOnEscKey` and `withBackdrop`.
         */
        modal: { type: Boolean },
      };
    }

    get modal() {
      return this._modal;
    }

    set modal(value) {
      const old = this._modal;
      /* istanbul ignore if */
      if (old === value) {
        return;
      }
      this._modal = value;
      // @ts-ignore
      if (this.requestUpdate) {
        // @ts-ignore
        this.requestUpdate('modal', old);
      }
      this._modalChanged(value);
    }

    constructor() {
      super();
      this._clickHandler = this._clickHandler.bind(this);
      this._resizeHandler = this._resizeHandler.bind(this);
    }

    connectedCallback() {
      /* istanbul ignore else */
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      this.setAttribute('role', 'dialog');
      this.setAttribute('tabindex', '-1');
      this.addEventListener('click', this._clickHandler);
      this.addEventListener('resize', this._resizeHandler);
      this.__ready = true;
      if (this.modal) {
        this._modalChanged(this.modal);
      }
    }

    disconnectedCallback() {
      /* istanbul ignore else */
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
      this.removeEventListener('click', this._clickHandler);
      this.removeEventListener('resize', this._resizeHandler);
    }

    _updateClosingReasonConfirmed(confirmed) {
      if (!this.closingReason) {
        // @ts-ignore
        this.closingReason = {};
      }
      // @ts-ignore
      this.closingReason.confirmed = confirmed;
    }

    /**
     * Checks if the click target is the dialog closing target
     * @param {Element} target
     * @returns
     */
    _isTargetClosingReason(target) {
      if (!target.hasAttribute) {
        return false;
      }
      const attrs = ['dialog-dismiss', 'dialog-confirm', 'data-dialog-dismiss', 'data-dialog-confirm'];
      return attrs.some((name) => target.hasAttribute(name));
    }

    /**
     * @param {PointerEvent} e
     */
    _clickHandler(e) {
      // @ts-ignore
      const path = /** @type Element[] */ (e.path || e.composedPath());
      for (let i = 0, l = path.indexOf(this); i < l; i++) {
        const target = path[i];
        if (this._isTargetClosingReason(target)) {
          this._updateClosingReasonConfirmed(target.hasAttribute('dialog-confirm') || target.hasAttribute('data-dialog-confirm'));
          this.close();
          e.stopPropagation();
          break;
        }
      }
    }

    /**
     * Handler for the resize event dispatched by the children. 
     * Causes the content to resize.
     */
    _resizeHandler() {
      this.refit();
    }

    _modalChanged(modal) {
      if (!this.__ready) {
        return;
      }
      if (modal) {
        this.__mncooc = this.noCancelOnOutsideClick;
        this.__mncoek = this.noCancelOnEscKey;
        this.__mwb = this.withBackdrop;
        this.noCancelOnOutsideClick = true;
        this.noCancelOnEscKey = true;
        this.withBackdrop = true;
      } else {
        this.noCancelOnOutsideClick = this.noCancelOnOutsideClick && this.__mncooc;
        this.noCancelOnEscKey = this.noCancelOnEscKey && this.__mncoek;
        this.withBackdrop = this.withBackdrop && this.__mwb;
      }
    }
  }

  return AnypointDialogMixinImpl;
}
/**
 * A mixin with common methods for Anypoint Dialog
 *
 * @mixin
 */
export const AnypointDialogMixin = dedupeMixin(mxFunction);
