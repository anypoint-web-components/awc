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
import { html, css, CSSResult, TemplateResult } from 'lit';
import AnypointElement from './AnypointElement.js';
import { HoverableMixin } from '../mixins/HoverableMixin.js';
import { ButtonStateMixin } from '../mixins/ButtonStateMixin.js';
import { ControlStateMixin } from '../mixins/ControlStateMixin.js';
import styles from '../styles/ItemStyles.js';

/* eslint-disable class-methods-use-this */

/**
 * `anypoint-item`
 * An Anypoint list item.
 */
export default class AnypointItemElement extends HoverableMixin(ControlStateMixin(ButtonStateMixin(AnypointElement))) {
  get styles(): CSSResult[] {
    return [
      styles,
      css`
        :host {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
      `,
    ];
  }

  render(): TemplateResult {
    return html`<style>${this.styles}</style>
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
