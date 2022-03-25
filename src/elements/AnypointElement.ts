/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/**
@license
Copyright 2022 The Advanced REST client authors <arc@mulesoft.com>
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

/**
 * The base class for Anypoint elements.
 */
export default class AnypointElement extends LitElement {
  private anypointValue?: boolean;

  private outlinedValue?: boolean;

  /**
   * Enables Anypoint theme.
   * @attribute
   */
  @property({ type: Boolean, reflect: true })
  get anypoint(): boolean | undefined {
    return this.anypointValue;
  }

  set anypoint(value: boolean | undefined) {
    const old = this.anypointValue;
    if (old === value) {
      return;
    }
    this.anypointValue = value;
    this.requestUpdate('anypoint', old);
    this.anypointChanged(value);
  }

  /**
   * Enables Material's outlined theme.
   * @attribute
   */
  @property({ type: Boolean, reflect: true })
  get outlined(): boolean | undefined {
    return this.outlinedValue;
  }

  set outlined(value: boolean | undefined) {
    const old = this.outlinedValue;
    if (old === value) {
      return;
    }
    this.outlinedValue = value;
    this.requestUpdate('outlined', old);
    this.anypointChanged(value);
  }

  /**
   * To be used by child classes when the `anypoint` property change.
   */
  protected anypointChanged(value?: boolean): void {
    // ...
  }

  /**
   * To be used by child classes when the `outlined` property change.
   */
  protected outlinedChanged(value?: boolean): void {
    // ...
  }
}
