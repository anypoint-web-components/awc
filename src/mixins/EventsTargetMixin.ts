/* eslint-disable @typescript-eslint/no-unused-vars */
/**
@license
Copyright 2017 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/

/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */

type Constructor<T = {}> = new (...args: any[]) => T;

/**
 * `EventsTargetMixin` is a mixin that allows to set event listeners on a default or set node.
 *
 * By default the element listens on the `window` element for events. By setting
 * `eventsTarget` property on this element it removes all previously set
 * listeners and adds the same listeners to the node.
 * It also restores default state when the `eventsTarget` is removed.
 *
 * Implementations should implement two abstract methods:
 * `_attachListeners(node)` and `_detachListeners(node)`. Both of them will be
 * called with event target argument when it's required to either set or remove
 * listeners.
 *
 * ```javascript
 * class EventableElement extends EventsTargetMixin(HTMLElement) {
 *   _attachListeners: function(node) {
 *    mode.addEventListener('event', this._callback);
 *  }
 *
 *  _detachListeners: function(node) {
 *    mode.removeEventListener('event', this._callback);
 *  }
 * }
 * ```
 *
 * The mixin handles connectedCallback / disconnectedCallback and calls the
 * functions with required parameters.
 *
 * @mixin
 * 
 * @prop {EventTarget | undefined} eventsTarget
 */
export interface EventsTargetMixinInterface {
  eventsTarget: EventTarget | undefined;
  /**
   * To be implement by the element to set event listeners from the target.
   * @param node A node to which attach event listeners to
   */
  _attachListeners(node: EventTarget): void;

  /**
   * To be implement by the element to remove event listeners from the target.
   * @param node A node to which remove event listeners to
   */
  _detachListeners(node: EventTarget): void;

  /**
   * Removes old handlers (if any) and attaches listeners on new event
   * event target.
   *
   * @param eventsTarget Event target to set handlers on. If not set it
   * will set handlers on the `window` object.
   */
  _eventsTargetChanged(eventsTarget?: EventTarget): void;
}

/**
 * `EventsTargetMixin` is a mixin that allows to set event listeners on a default or set node.
 *
 * By default the element listens on the `window` element for events. By setting
 * `eventsTarget` property on this element it removes all previously set
 * listeners and adds the same listeners to the node.
 * It also restores default state when the `eventsTarget` is removed.
 *
 * Implementations should implement two abstract methods:
 * `_attachListeners(node)` and `_detachListeners(node)`. Both of them will be
 * called with event target argument when it's required to either set or remove
 * listeners.
 *
 * ```javascript
 * class EventableElement extends EventsTargetMixin(HTMLElement) {
 *   _attachListeners: function(node) {
 *    mode.addEventListener('event', this._callback);
 *  }
 *
 *  _detachListeners: function(node) {
 *    mode.removeEventListener('event', this._callback);
 *  }
 * }
 * ```
 *
 * The mixin handles connectedCallback / disconnectedCallback and calls the
 * functions with required parameters.
 *
 * @mixin
 * 
 * @prop {EventTarget | undefined} eventsTarget
 */
export function EventsTargetMixin<T extends Constructor<Object>>(superClass: T): Constructor<EventsTargetMixinInterface> & T {
  class MyMixinClass extends superClass {
    _eventsTarget?: EventTarget;

    _oldEventsTarget?: EventTarget;

    /**
     * @return Currently registered events target,
     */
    get eventsTarget(): EventTarget | undefined {
      return this._eventsTarget;
    }

    /**
     * By default the element listens on the `window` object. If this value is set,
     * then all events listeners will be attached to this object instead of `window`.
     * @param value Events handlers target.
     */
    set eventsTarget(value: EventTarget | undefined) {
      const old = this._eventsTarget;
      if (old === value) {
        return;
      }
      this._eventsTarget = value;
      this._eventsTargetChanged(value);
      // @ts-ignore
      if (this.requestUpdate) {
        // @ts-ignore
        this.requestUpdate('eventsTarget', old);
      }
    }

    connectedCallback(): void {
      // @ts-ignore
      if (super.connectedCallback) {
        // @ts-ignore
        super.connectedCallback();
      }
      this._eventsTargetChanged(this.eventsTarget);
    }

    disconnectedCallback(): void {
      // @ts-ignore
      if (super.disconnectedCallback) {
        // @ts-ignore
        super.disconnectedCallback();
      }
      if (this._oldEventsTarget) {
        this._detachListeners(this._oldEventsTarget);
      }
    }

    /**
     * Removes old handlers (if any) and attaches listeners on new event
     * event target.
     *
     * @param eventsTarget Event target to set handlers on. If not set it
     * will set handlers on the `window` object.
     */
    _eventsTargetChanged(eventsTarget: EventTarget = window): void {
      if (this._oldEventsTarget) {
        this._detachListeners(this._oldEventsTarget);
      }
      this._oldEventsTarget = eventsTarget;
      this._attachListeners(this._oldEventsTarget);
    }

    /**
     * To be implement by the element to set event listeners from the target.
     * @param node A node to which attach event listeners to
     */
    _attachListeners(node: EventTarget): void {}

    /**
     * To be implement by the element to remove event listeners from the target.
     * @param node A node to which remove event listeners to
     */
    _detachListeners(node: EventTarget): void {}
  }

  return MyMixinClass as Constructor<EventsTargetMixinInterface> & T;
}
