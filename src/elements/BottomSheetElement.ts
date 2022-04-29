/* eslint-disable no-use-before-define */
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
import { html, TemplateResult, CSSResult, PropertyValueMap } from 'lit';
import { property } from 'lit/decorators.js';
import sheetStyles from '../styles/BottomSheet.js';
import OverlayElement from './overlay/OverlayElement.js';

// Keeps track of the toast currently opened.
let currentSheet: BottomSheetElement | null;

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
 *      <anypoint-icon src="inbox.png" item-icon></anypoint-icon>
 *      Inbox
 *    </paper-icon-item>
 *    <paper-icon-item>
 *      <anypoint-icon src="keep.png" item-icon></anypoint-icon>
 *      Keep
 *    </paper-icon-item>
 *    <paper-icon-item>
 *      <anypoint-icon src="hangouts.png" item-icon></anypoint-icon>
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
 * @fires announce
 * @slot - The main content
 */
export default class BottomSheetElement extends OverlayElement {
  static get styles(): CSSResult {
    return sheetStyles;
  }

  render(): TemplateResult {
    const { label } = this;
    return html`
    ${label ? html`<label>${label}</label>` : ''}
    <div class="scrollable">
      <slot></slot>
    </div>`;
  }

  /**
   * The label of the bottom sheet.
   * @attribute
   */
  @property({ type: String }) label?: string;

  /**
   * Removes padding from the element styles
   * @attribute
   */
   @property({ type: Boolean, reflect: true }) noPadding?: boolean;

  /**
   * Returns the scrolling element.
   */
  get scrollTarget(): HTMLElement {
    return this.shadowRoot!.querySelector('.scrollable') as HTMLElement;
  }

  constructor() {
    super();
    this.addEventListener('transitionend', this.__onTransitionEnd.bind(this));
  }

  firstUpdated(): void {
    this.sizingTarget = this.scrollTarget;
  }

  protected willUpdate(cp: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.willUpdate(cp);
    if (cp.has('fitInto')) {
      this._onFitIntoChanged(this.fitInto);
    }
  }

  _openedChanged(): void {
    const { opened } = this;
    if (opened) {
      if (currentSheet && currentSheet !== this) {
        currentSheet.close();
      }
      currentSheet = this;
      this.dispatchEvent(new CustomEvent('announce', {
        bubbles: true,
        composed: true,
        detail: {
          text: 'Menu opened'
        }
      }));
    } else if (currentSheet === this) {
      currentSheet = null;
    }
    super._openedChanged();
  }

  /**
   * Overridden from `OverlayElement`.
   */
  override _renderOpened(): void {
    const node = this;
    node.classList.add('bottom-sheet-open');
  }

  /**
   * Overridden from `OverlayElement`.
   */
  _renderClosed(): void {
    const node = this;
    node.classList.remove('bottom-sheet-open');
  }

  _onFitIntoChanged(fitInto: HTMLElement | Window = window): void {
    this.positionTarget = fitInto;
  }

  __onTransitionEnd(e: TransitionEvent): void {
    // there are different transitions that are happening when opening and
    // closing the toast. The last one so far is for `opacity`.
    // This marks the end of the transition, so we check for this to determine if this
    // is the correct event.
    if (e && e.target === this && e.propertyName === 'opacity') {
      if (this.opened) {
        this._finishRenderOpened();
      } else {
        this._finishRenderClosed();
      }
    }
  }
}
