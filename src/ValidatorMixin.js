/**
@license
Copyright 2018 The Advanced REST client authors <arc@mulesoft.com>
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
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { register, unregister } from './ValidatorStore.js';

/* eslint-disable class-methods-use-this */

/**
 * @param {typeof HTMLElement} base
 */
const mxFunction = base => {
  class ValidatorMixinImpl extends base {
    static get properties() {
      return {
        /**
         * Validation message for invalid state
         */
        message: { type: String },
      };
    }

    /**
     * @return {string} Validation message to return when invalid.
     */
    get message() {
      return this._message;
    }

    /**
     * @param {string} value Validation message for invalid state
     */
    set message(value) {
      const old = this._message;
      if (old === value) {
        return;
      }
      this._message = value;
      // @ts-ignore
      if (this.requestUpdate) {
        // @ts-ignore
        this.requestUpdate('message', old);
      }
    }

    constructor() {
      super();
      let key = this.nodeName;
      if (key) {
        key = key.toLowerCase();
      }
      if (!key) {
        // @ts-ignore
        key = this.constructor.is;
      }
      register(this, key);
    }

    /**
     * To be used to manually remove the validator instance from memory.
     * After registering the validator in the global store it is not tied to
     * component's lifecycle methods (it can extend an Object instead of HTMLElement).
     * Also, usually validator stays in the document for the entire lifecycle of the
     * web app. But if you need to unregister the validator then call this function
     * and detach this element from the DOM or remove references to the object so
     * it can be GC'd.
     */
    unregister() {
      unregister(this);
    }

    /**
     * Implement custom validation logic in this function.
     *
     * @return {boolean} true if `values` is valid.
     */
    validate() {
      return true;
    }
  }
  return ValidatorMixinImpl;
};

/**
 * Use `ValidatorMixin` to implement a custom input/form validator.
 * Element instances implementing this mixin will be registered for use
 * in elements that implement `ValidatableMixin`.
 *
 * ## Validator name
 *
 * By default it takes lower case name of current HTML element. If this class
 * is used outside custom elements environment then it uses static `is` property
 * to get the name of the validator.
 *
 * ```
 * static get is() {
 *  return 'my-validator';
 * }
 * ```
 *
 * @mixin
 */
export const ValidatorMixin = dedupeMixin(mxFunction);
