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
import { LitElement, html } from 'lit-element';
import { ValidatableMixin } from '../index.js';

class ValidatableInput extends ValidatableMixin(LitElement) {
  render() {
    return html`<slot></slot>`;
  }

  constructor() {
    super();
    this.invalid = false;
    this.addEventListener('input', this._onInput.bind(this));
  }

  _onInput(e) {
    this.validate(e.target.value);
  }
}
window.customElements.define('validatable-input', ValidatableInput);
