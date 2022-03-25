/**
@license
Copyright 2017 MuleSoft.

All rights reserved.
*/
import { LitElement } from 'lit';
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { property } from 'lit/decorators.js';

type Constructor<T = {}> = new (...args: any[]) => T;

export interface HoverableMixinInterface {
  /**
   * @return True when the element is currently hovered by a pointing device.
   */
  get hovered(): boolean | undefined;

  _hovered: boolean | undefined;
}

/**
 * Use `HoverableMixin` to implement an element that can be hovered.
 * The control gets a `hovered` attribute when it's hovered by the pointing device.
 *
 * Be aware that mobile devices will not support hovering as desktop devices and behavior
 * may vary depending on platform. You should use this as little as possible.
 *
 * @fires hoverchange
 * @mixin
 */
export const HoverableMixin = dedupeMixin(<T extends Constructor<LitElement>>(superClass: T): Constructor<HoverableMixinInterface> & T => {
  class MyMixinClass extends superClass {
    /**
     * @return True when the element is currently hovered by a pointing device.
     */
    get hovered(): boolean | undefined {
      return this._hovered;
    }

    __hovered: boolean | undefined;

    @property({ type: Boolean, reflect: true, attribute: 'hovered' })
    get _hovered(): boolean | undefined {
      return this.__hovered || false;
    }

    set _hovered(value: boolean | undefined) {
      const old = this.__hovered;
      if (value === old) {
        return;
      }
      this.__hovered = value;
      this._notifyHovered(value);
      // @ts-ignore
      if (this.requestUpdate) {
        // @ts-ignore
        this.requestUpdate('_hovered', old);
      }
    }

    constructor(...args: any[]) {
      super(...args);
      this._hoverCallback = this._hoverCallback.bind(this);
      this._leaveCallback = this._leaveCallback.bind(this);
    }

    /**
     * Registers hover listeners
     */
    connectedCallback(): void {
      // @ts-ignore
      if (super.connectedCallback) {
        // @ts-ignore
        super.connectedCallback();
      }
      this.addEventListener('mouseover', this._hoverCallback);
      this.addEventListener('mouseleave', this._leaveCallback);
    }

    /**
     * Removes hover listeners
     */
    disconnectedCallback(): void {
      // @ts-ignore
      if (super.disconnectedCallback) {
        // @ts-ignore
        super.disconnectedCallback();
      }
      this.removeEventListener('mouseover', this._hoverCallback);
      this.removeEventListener('mouseleave', this._leaveCallback);
    }

    /**
     * Set's the `hovered` attribute to true when handled.
     */
    _hoverCallback(): void {
      this._hovered = true;
    }

    /**
     * Updates `hovered` if the control is not hovered anymore.
     */
    _leaveCallback(): void {
      this._hovered = false;
    }

    _notifyHovered(value: boolean | undefined): void {
      this.dispatchEvent(new CustomEvent('hoverchange', { detail: { value } }));
    }
  }
  return MyMixinClass as Constructor<HoverableMixinInterface> & T;
});
