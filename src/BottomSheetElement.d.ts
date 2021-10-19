/**
@license
Copyright 2018 The Advanced REST Client authors
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
import { OverlayMixin } from './mixins/OverlayMixin.js';

/**
 * Material design: [Bottom sheets](https://material.google.com/components/bottom-sheets.html#)
 *
 * # `<bottom-sheet>`
 *
 * Bottom sheets slide up from the bottom of the screen to reveal more content.
 *
 * ### Example
 *
 * ```html
 * <bottom-sheet>
 *    <paper-icon-item>
 *      <iron-icon src="inbox.png" item-icon></iron-icon>
 *      Inbox
 *    </paper-icon-item>
 *    <paper-icon-item>
 *      <iron-icon src="keep.png" item-icon></iron-icon>
 *      Keep
 *    </paper-icon-item>
 *    <paper-icon-item>
 *      <iron-icon src="hangouts.png" item-icon></iron-icon>
 *      Hangouts
 *    </paper-icon-item>
 *  </bottom-sheet>
 * ```
 *
 * ### Positioning
 *
 * Use the `fit-bottom` class to position the bar at the bottom of the app and with full width;
 *
 * Use `center-bottom` class to display the bar at the bottom centered on a page.
 *
 * ### Styling
 *
 * `<bottom-sheet>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--bottom-sheet-background-color` | The bottom-sheet background-color | `#fff`
 * `--bottom-sheet-color` | The bottom-sheet color | `#323232`
 * `--bottom-sheet-max-width` | Max width of the element | ``
 * `--bottom-sheet-max-height` | Max height of the element | ``
 * `--bottom-sheet-label-color` | Color of the label | `rgba(0, 0, 0, 0.54)`
 * `--bottom-sheet-box-shadow` | Box shadow property of the element | `0 2px 5px 0 rgba(0, 0, 0, 0.26)`
 *
 */
export default class BottomSheetElement extends OverlayMixin(LitElement) {
  render(): TemplateResult;
  /**
   * The label of the bottom sheet.
   * @attribute
   */
  label: string;
  /**
   * Removes padding from the element styles
   * @attribute
   */
  noPadding: boolean;

  fitInto: HTMLElement;

  /**
   * Returns the scrolling element.
   */
  get scrollTarget(): HTMLElement;

  constructor();

  connectedCallback(): void;

  disconnectedCallback(): void;

  firstUpdated(): void;

  _openedChanged(opened: boolean): void;

  /**
   * Overridden from `ArcOverlayMixin`.
   */
  _renderOpened(): void;

  /**
   * Overridden from `ArcOverlayMixin`.
   */
  _renderClosed(): void;

  _onFitIntoChanged(fitInto: HTMLElement): void;
}
