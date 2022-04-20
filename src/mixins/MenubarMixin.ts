import { LitElement } from 'lit';
import { MenuMixin, MenuMixinInterface } from './MenuMixin.js';

type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * Port of `@polymer/iron-menubar-behavior`.
 *
 * A mixin that implement accessible menubar.
 *
 * Note, by default the mixin works with LitElement. If used with different class
 * make sure that attributes are reflected to properties correctly.
 *
 * @mixin
 * 
 * @fires deselect
 * @fires selected
 * @fires activate
 * @fires selectedchange
 * @fires itemschange
 * @fires selecteditemchange
 * @fires childrenchange
 * @fires selectedvalueschange
 * @fires selecteditemschange
 * 
 * @attr {string} selected The selected element. The default is to use the index of the item.
 * @prop {string | number | undefined} selected - The selected element. The default is to use the index of the item.
 * 
 * @attr {string} fallbackSelection
 * @prop {string | number | undefined} fallbackSelection
 * 
 * @attr {string} attrForSelected
 * @prop {string | undefined} attrForSelected
 * 
 * @attr {string} selectable
 * @prop {string | undefined} selectable
 * 
 * @attr {string} selectedClass
 * @prop {string | undefined} selectedClass
 * 
 * @attr {string} selectedAttribute
 * @prop {string | undefined} selectedAttribute
 * 
 * @attr {string} activateEvent
 * @prop {string | undefined} activateEvent
 * 
 * @prop {readonly HTMLElement[]} items
 * 
 * @attr {boolean} multi
 * @prop {boolean | undefined} multi
 * 
 * @attr {unknown[]} selectedValues
 * @prop {unknown[] | undefined} selectedValues
 * 
 * @prop {readonly HTMLElement[]} selectedItems
 * 
 * @attr {string} attrForItemTitle
 * @prop {string | undefined} attrForItemTitle
 * 
 * @attr {boolean} useAriaSelected
 * @prop {boolean | undefined} useAriaSelected
 * 
 * @attr {boolean} highlightAriaSelected
 * @prop {boolean | undefined} highlightAriaSelected
 * 
 * @attr {boolean} disabled
 * @prop {boolean | undefined} disabled
 * 
 * @prop {readonly HTMLElement | undefined} focusedItem
 * 
 * @prop {readonly HTMLElement | undefined} highlightedItem
 */
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
 * 
 * @fires deselect
 * @fires selected
 * @fires activate
 * @fires selectedchange
 * @fires itemschange
 * @fires selecteditemchange
 * @fires childrenchange
 * @fires selectedvalueschange
 * @fires selecteditemschange
 * 
 * @attr {string} selected The selected element. The default is to use the index of the item.
 * @prop {string | number | undefined} selected - The selected element. The default is to use the index of the item.
 * 
 * @attr {string} fallbackSelection
 * @prop {string | number | undefined} fallbackSelection
 * 
 * @attr {string} attrForSelected
 * @prop {string | undefined} attrForSelected
 * 
 * @attr {string} selectable
 * @prop {string | undefined} selectable
 * 
 * @attr {string} selectedClass
 * @prop {string | undefined} selectedClass
 * 
 * @attr {string} selectedAttribute
 * @prop {string | undefined} selectedAttribute
 * 
 * @attr {string} activateEvent
 * @prop {string | undefined} activateEvent
 * 
 * @prop {readonly HTMLElement[]} items
 * 
 * @attr {boolean} multi
 * @prop {boolean | undefined} multi
 * 
 * @attr {unknown[]} selectedValues
 * @prop {unknown[] | undefined} selectedValues
 * 
 * @prop {readonly HTMLElement[]} selectedItems
 * 
 * @attr {string} attrForItemTitle
 * @prop {string | undefined} attrForItemTitle
 * 
 * @attr {boolean} useAriaSelected
 * @prop {boolean | undefined} useAriaSelected
 * 
 * @attr {boolean} highlightAriaSelected
 * @prop {boolean | undefined} highlightAriaSelected
 * 
 * @attr {boolean} disabled
 * @prop {boolean | undefined} disabled
 * 
 * @prop {readonly HTMLElement | undefined} focusedItem
 * 
 * @prop {readonly HTMLElement | undefined} highlightedItem
 */
export function MenubarMixin<T extends Constructor<LitElement>>(superClass: T): Constructor<MenubarMixinInterface> & T {
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
}
