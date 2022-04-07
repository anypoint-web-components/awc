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
import { LitElement, html, TemplateResult } from 'lit';
import { ValidatableMixin } from '../../src/index.js';

export class TestValidatable extends ValidatableMixin(LitElement) {
  render(): TemplateResult {
    return html`<slot></slot>`;
  }

  constructor() {
    super();
    this.addEventListener('input', this._onInput.bind(this));
  }

  _onInput(e: any): void {
    this.validate(e.target.value);
  }
}
window.customElements.define('test-validatable', TestValidatable);

declare global {
  interface HTMLElementTagNameMap {
    "test-validatable": TestValidatable
  }
}
