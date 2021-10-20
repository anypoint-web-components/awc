/* eslint-disable class-methods-use-this */
/*
Copyright 2021 Pawel Psztyc, The ARC team

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
import { LitElement, TemplateResult } from 'lit-element';
import { RangeMixin } from './mixins/RangeMixin.js';

export const secondaryProgressValue: unique symbol;
export const indeterminateValue: unique symbol;
export const secondaryRatioValue: unique symbol;

/**
 * Anypoint styles progress bar.
 * 
 * The progress bars are for situations where the percentage completed can be
 * determined. They give users a quick sense of how much longer an operation
 * will take.
 */
export default class AnypointProgressElement extends RangeMixin(LitElement) {
  /**
   * The number that represents the current secondary progress.
   * @attribute
   */
  secondaryProgress: number;
  [secondaryProgressValue]: number;
  /**
  * Use an indeterminate progress indicator.
  * @attribute
  */
  indeterminate: boolean;
  [indeterminateValue]: boolean;

  /**
  * True if the progress is disabled.
  * @attribute
  */
  disabled: boolean;
  [secondaryRatioValue]: number;
  /**
   * @returns {number} The ratio of the secondary progress.
   */
  get secondaryRatio(): number;

  constructor();

  render(): TemplateResult;
}
