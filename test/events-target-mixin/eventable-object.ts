/* eslint-disable no-useless-constructor */
/* eslint-disable max-classes-per-file */
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
import { EventsTargetMixin } from '../../index.js';

class TestClass {
  constructor(public value1: any, public value2: any) { }
}

export class EventableObject extends EventsTargetMixin(TestClass) {
  constructor(value1?: any, value2?: any) {
    super(value1, value2);
    this._eventsTargetChanged();
  }
}
