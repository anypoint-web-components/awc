import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { MenuMixin, MenuMixinInterface } from './MenuMixin.js';

type Constructor<T = {}> = new (...args: any[]) => T;

export interface MenubarMixinInterface extends MenuMixinInterface {
  get _isRTL(): boolean;
  _onLeftKey(e: KeyboardEvent): void;
  _onRightKey(e: KeyboardEvent): void;
}

/**
 * Port of `@polymer/iron-menubar-behavior`.
 *
 * A mixin that implement accessible menubar.
 *
 * Note, by default the mixin works with LitElement. If used with different class
 * make sure that attributes are reflected to properties correctly.
 *
 * @mixin
 */
export const MenubarMixin = dedupeMixin(<T extends Constructor<HTMLElement>>(superClass: T): Constructor<MenubarMixinInterface> & T => {
  class MyMixinClass extends MenuMixin(superClass) {
    get _isRTL(): boolean {
      return window.getComputedStyle(this).direction === 'rtl';
    }

    connectedCallback(): void {
      /* istanbul ignore else */
      // @ts-ignore
      if (super.connectedCallback) {
        // @ts-ignore
        super.connectedCallback();
      }
      if (this.getAttribute('role') === 'menu') {
        this.setAttribute('role', 'menubar');
      }
    }

    _onUpKey(e: KeyboardEvent): void {
      this.focusedItem?.click();
      e.preventDefault();
    }

    _onDownKey(e: KeyboardEvent): void {
      this.focusedItem?.click();
      e.preventDefault();
    }

    _onLeftKey(e: KeyboardEvent): void {
      if (this._isRTL) {
        this.focusNext();
      } else {
        this.focusPrevious();
      }
      e.preventDefault();
    }

    _onRightKey(e: KeyboardEvent): void {
      if (this._isRTL) {
        this.focusPrevious();
      } else {
        this.focusNext();
      }
      e.preventDefault();
    }

    _onKeydown(e: KeyboardEvent): void {
      if (e.code === 'ArrowLeft') {
        this._onLeftKey(e);
      } else if (e.code === 'ArrowRight') {
        this._onRightKey(e);
      } else {
        super._onKeydown(e);
      }
    }
  }
  return MyMixinClass as Constructor<MenubarMixinInterface> & T;
});
