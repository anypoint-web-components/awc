/**
@license
Copyright 2017 MuleSoft.

All rights reserved.
*/

import { dedupeMixin } from '@open-wc/dedupe-mixin';

/**
 * @param {typeof HTMLElement} base
 * @deprecated This mixin is deprecated and should not be used in any new project.
 */
const mxFunction = base => {
  class HoverableMixinImpl extends base {
    static get properties() {
      return {
        /**
         * True when the element is currently hovered by a pointing device.
         */
        _hovered: { type: Boolean, reflect: true, attribute: 'hovered' },
      };
    }

    /**
     * @return {Boolean} True when the element is currently hovered by a pointing device.
     */
    get hovered() {
      return this._hovered;
    }

    get _hovered() {
      return this.__hovered || false;
    }

    set _hovered(value) {
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

    constructor() {
      super();
      this._hoverCallback = this._hoverCallback.bind(this);
      this._leaveCallback = this._leaveCallback.bind(this);
    }

    /**
     * Registers hover listeners
     */
    connectedCallback() {
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
    disconnectedCallback() {
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
    _hoverCallback() {
      this._hovered = true;
    }

    /**
     * Updates `hovered` if the control is not hovered anymore.
     */
    _leaveCallback() {
      this._hovered = false;
    }

    _notifyHovered(value) {
      // this is the legacy event
      this.dispatchEvent(
        new CustomEvent('hovered-changed', {
          composed: true,
          detail: {
            value,
          },
        })
      );
      // this is the correct event
      this.dispatchEvent(
        new CustomEvent('hoverchange', {
          composed: true,
          detail: {
            value,
          },
        })
      );
    }
  }
  return HoverableMixinImpl;
};

/**
 * Use `HoverableMixin` to implement an element that can be hovered.
 * The control gets a `hovered` attribute when it's hovered by the pointing device.
 *
 * Be aware that mobile devices will not support hovering as desktop devices and behavior
 * may vary depending on platform. You should use this as little as possible.
 *
 * @mixin
 */
export const HoverableMixin = dedupeMixin(mxFunction);
