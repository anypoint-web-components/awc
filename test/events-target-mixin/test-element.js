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
/*
Example implementation.
*/
import { LitElement } from 'lit-element';
import { EventsTargetMixin } from '../../index.js';

class EventableElement extends EventsTargetMixin(LitElement) {
  static get properties() {
    return {
      _calledCount: { type: Number }
    };
  }

  constructor() {
    super();
    this._calledCount = 0;
    this._testEventHandler = this._testEventHandler.bind(this);
  }

  get called() {
    return this._calledCount > 0;
  }

  get calledOnce() {
    return this._calledCount === 1;
  }

  _attachListeners(node) {
    node.addEventListener('test-event', this._testEventHandler);
  }

  _detachListeners(node) {
    node.removeEventListener('test-event', this._testEventHandler);
  }

  _testEventHandler() {
    this._calledCount++;
  }
}
window.customElements.define('eventable-element', EventableElement);
