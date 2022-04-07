/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { register, unregister } from './ValidatorStore.js';

/* eslint-disable class-methods-use-this */

type Constructor<T = {}> = new (...args: any[]) => T;

export interface ValidatorMixinInterface {
  /**
   * @return Validation message to return when invalid.
   */
  message: string | undefined;
  /**
   * To be used to manually remove the validator instance from memory.
   * After registering the validator in the global store it is not tied to
   * component's lifecycle methods (it can extend an Object instead of HTMLElement).
   * Also, usually validator stays in the document for the entire lifecycle of the
   * web app. But if you need to unregister the validator then call this function
   * and detach this element from the DOM or remove references to the object so
   * it can be GC'd.
   */
  unregister(): void;

  /**
   * Implement custom validation logic in this function.
   *
   * @return true if `values` is valid.
   */
  validate(...args: any[]): boolean;
}

/**
 * Use `ValidatorMixin` to implement a custom input/form validator.
 * Element instances implementing this mixin will be registered for use
 * in elements that implement `ValidatableMixin`.
 *
 * @mixin
 */
export function ValidatorMixin<T extends Constructor<LitElement>>(superClass: T): Constructor<ValidatorMixinInterface> & T {
  class MyMixinClass extends superClass {
    private _message?: string;

    /**
     * @return Validation message to return when invalid.
     */
    @property()
    get message(): string | undefined {
      return this._message;
    }

    /**
     * @param value Validation message for invalid state
     */
    set message(value: string | undefined) {
      const old = this._message;
      if (old === value) {
        return;
      }
      this._message = value;
      const litSelf = (this as unknown) as LitElement;
      if (litSelf.requestUpdate) {
        litSelf.requestUpdate('message', old);
      }
    }

    constructor(...args: any[]) {
      super(...args);
      let key = this.nodeName;
      if (key) {
        key = key.toLowerCase();
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
    unregister(): void {
      unregister(this);
    }

    /**
     * Implement custom validation logic in this function.
     *
     * @return true if `values` is valid.
     */
    validate(...args: any[]): boolean {
      return true;
    }
  }
  return MyMixinClass as Constructor<ValidatorMixinInterface> & T;
}
