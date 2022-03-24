import { LitElement } from 'lit';
import { property } from 'lit/decorators';
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { OverlayMixin, OverlayMixinInterface } from './OverlayMixin.js';

/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */

type Constructor<T = {}> = new (...args: any[]) => T;

export interface AnypointDialogMixinInterface extends OverlayMixinInterface {
  /**
   * If `modal` is true, this implies `noCancelOnOutsideClick`,
   * `noCancelOnEscKey` and `withBackdrop`.
   */
  modal: boolean | undefined;
}

/**
 * A mixin with common methods for Anypoint Dialog
 *
 * @mixin
 */
export const AnypointDialogMixin = dedupeMixin(<T extends Constructor<LitElement>>(superClass: T): Constructor<AnypointDialogMixinInterface> & T => {
  class MyMixinClass extends OverlayMixin(superClass) {
    protected _modal?: boolean;

    /**
     * If `modal` is true, this implies `noCancelOnOutsideClick`,
     * `noCancelOnEscKey` and `withBackdrop`.
     */
    @property({ type: Boolean })
    get modal(): boolean | undefined {
      return this._modal;
    }

    set modal(value: boolean | undefined) {
      const old = this._modal;
      /* istanbul ignore if */
      if (old === value) {
        return;
      }
      this._modal = value;
      if (this.requestUpdate) {
        this.requestUpdate('modal', old);
      }
      this._modalChanged(value);
    }

    private __ready = false;

    constructor() {
      super();
      this._clickHandler = this._clickHandler.bind(this);
      this._resizeHandler = this._resizeHandler.bind(this);
    }

    connectedCallback(): void {
      super.connectedCallback();
      this.setAttribute('role', 'dialog');
      this.setAttribute('tabindex', '-1');
      this.addEventListener('click', this._clickHandler as EventListener);
      this.addEventListener('resize', this._resizeHandler);
      this.__ready = true;
      if (this.modal) {
        this._modalChanged(this.modal);
      }
    }

    disconnectedCallback(): void {
      super.disconnectedCallback();
      this.removeEventListener('click', this._clickHandler as EventListener);
      this.removeEventListener('resize', this._resizeHandler);
    }

    _updateClosingReasonConfirmed(confirmed: boolean): void {
      if (!this.closingReason) {
        this.closingReason = {};
      }
      this.closingReason.confirmed = confirmed;
    }

    /**
     * Checks if the click target is the dialog closing target
     */
    _isTargetClosingReason(target: Element): boolean {
      if (!target.hasAttribute) {
        return false;
      }
      const attrs = ['dialog-dismiss', 'dialog-confirm', 'data-dialog-dismiss', 'data-dialog-confirm'];
      return attrs.some((name) => target.hasAttribute(name));
    }

    _clickHandler(e: PointerEvent): void {
      // @ts-ignore
      const path = (e.path || e.composedPath()) as Element[];
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
    _resizeHandler(): void {
      this.refit();
    }

    __mncooc?: boolean;

    __mncoek?: boolean;

    __mwb?: boolean;

    _modalChanged(modal?: boolean): void {
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
        this.noCancelOnOutsideClick = this.noCancelOnOutsideClick && !!this.__mncooc;
        this.noCancelOnEscKey = this.noCancelOnEscKey && !!this.__mncoek;
        this.withBackdrop = this.withBackdrop && this.__mwb;
      }
    }
  }

  return MyMixinClass as Constructor<AnypointDialogMixinInterface> & T;
});
