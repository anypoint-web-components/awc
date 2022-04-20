/**
@license
Copyright 2016 The Advanced REST client authors <arc@mulesoft.com>
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
import { CSSResult, TemplateResult, html, css } from 'lit';
import AnypointElement from './AnypointElement.js';
import { HoverableMixin } from '../mixins/HoverableMixin.js';
import { ButtonStateMixin } from '../mixins/ButtonStateMixin.js';
import { ControlStateMixin } from '../mixins/ControlStateMixin.js';
import styles from '../styles/ItemStyles.js';

/* eslint-disable class-methods-use-this */

/**
 * `anypoint-icon-item`
 * An Anypoint icon list item is a convenience element to make an item with icon. It is an
 * interactive list item with a fixed-width icon area.
 * This is useful if the icons are of varying widths, but you want the item
 * bodies to line up. Use this like a `<anypoint-item>`. The child node with the slot
 * name `item-icon` is placed in the icon area.
 * 
 * @attr {boolean} focused
 * @prop {boolean | undefined} focused
 * 
 * @attr {boolean} disabled
 * @prop {boolean | undefined} disabled
 * 
 * @attr {boolean} toggles
 * @prop {boolean | undefined} toggles
 * 
 * @attr {boolean} active
 * @prop {boolean | undefined} active
 * 
 * @attr {string} ariaActiveAttribute
 * @prop {string | undefined} ariaActiveAttribute
 * 
 * @prop {readonly boolean | undefined} pressed
 * @prop {readonly boolean | undefined} pointerDown
 * @prop {readonly boolean | undefined} receivedFocusFromKeyboard
 */
export default class AnypointIconItemElement extends HoverableMixin(ControlStateMixin(ButtonStateMixin(AnypointElement))) {
  static get styles(): CSSResult[] {
    return [
      styles,
      css`
        :host {
          display: flex;
          flex-direction: row;
          align-items: center;
        }

        .content-icon {
          display: flex;
          flex-direction: row;
          align-items: center;
          width: var(--anypoint-item-icon-width, 40px);
        }
      `,
    ];
  }

  render(): TemplateResult {
    return html`
      <div class="content-icon">
        <slot name="item-icon"></slot>
      </div>
      <slot></slot>
    `;
  }

  connectedCallback(): void {
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'option');
    }
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
    super.connectedCallback();
  }
}
