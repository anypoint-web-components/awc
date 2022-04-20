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
import { LitElement, html, TemplateResult, CSSResult } from 'lit';
import { property } from 'lit/decorators.js';
import { OverlayMixin } from '../mixins/OverlayMixin.js';
import sheetStyles from '../styles/BottomSheet.js';

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
 * @fires cancel
 * @fires opened
 * @fires closed
 * @fires openedchange
 * 
 * @prop {HTMLElement | Window} fitInto
 * @prop {HTMLElement | Window} positionTarget
 * @prop {HTMLElement} sizingTarget
 * 
 * @attr {HorizontalAlign} horizontalAlign
 * @prop {HorizontalAlign | string | undefined} horizontalAlign
 * 
 * @attr {VerticalAlign} horizontalAlign
 * @prop {VerticalAlign | string | undefined} verticalAlign
 * 
 * @attr {boolean} noOverlap
 * @prop {boolean | undefined} noOverlap
 * 
 * @attr {boolean} dynamicAlign
 * @prop {boolean | undefined} dynamicAlign
 * 
 * @attr {boolean} autoFitOnAttach
 * @prop {boolean | undefined} autoFitOnAttach
 * 
 * @attr {boolean} fitPositionTarget
 * @prop {boolean | undefined} fitPositionTarget
 * 
 * @attr {number} horizontalOffset
 * @prop {number | undefined} horizontalOffset
 * 
 * @attr {number} verticalOffset
 * @prop {number | undefined} verticalOffset
 * 
 * @attr {boolean} noAutoFocus
 * @prop {boolean | undefined} noAutoFocus
 * 
 * @attr {boolean} noCancelOnEscKey
 * @prop {boolean | undefined} noCancelOnEscKey
 * 
 * @attr {boolean} noCancelOnOutsideClick
 * @prop {boolean | undefined} noCancelOnOutsideClick
 * 
 * @attr {boolean} restoreFocusOnClose
 * @prop {boolean | undefined} restoreFocusOnClose
 * 
 * @attr {boolean} allowClickThrough
 * @prop {boolean | undefined} allowClickThrough
 * 
 * @attr {boolean} alwaysOnTop
 * @prop {boolean | undefined} alwaysOnTop
 * 
 * @attr {boolean} opened
 * @prop {boolean | undefined} opened
 * 
 * @attr {boolean} withBackdrop
 * @prop {boolean | undefined} withBackdrop
 * 
 * @attr {string} scrollAction
 * @prop {string | undefined} scrollAction
 * 
 * @prop {boolean | undefined} canceled
 * 
 * @prop {any} closingReason
 */
export default class BottomSheetElement extends OverlayMixin(LitElement) {
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
  @property({ type: String })
  label?: string;

  /**
   * Removes padding from the element styles
   * @attribute
   */
   @property({ type: Boolean, reflect: true })
  noPadding?: boolean;

  _fitInto: HTMLElement | Window;

  @property({ type: Object })
  get fitInto(): HTMLElement | Window {
    return this._fitInto;
  }

  set fitInto(value: HTMLElement | Window) {
    const old = this._fitInto;
    if (old === value) {
      return;
    }
    this._fitInto = value;
    this._onFitIntoChanged(value);
  }

  /**
   * Returns the scrolling element.
   */
  get scrollTarget(): HTMLElement {
    return this.shadowRoot!.querySelector('.scrollable') as HTMLElement;
  }

  constructor() {
    super();
    this.__onTransitionEnd = this.__onTransitionEnd.bind(this);

    this._fitInto = window;
    this._onFitIntoChanged(window);
    this.opened = false;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('transitionend', this.__onTransitionEnd);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('transitionend', this.__onTransitionEnd);
  }

  firstUpdated(): void {
    this.sizingTarget = this.scrollTarget;
  }

  _openedChanged(opened?: boolean): void {
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
    super._openedChanged(opened);
  }

  /**
   * Overridden from `ArcOverlayMixin`.
   */
  _renderOpened(): void {
    const node = this;
    node.classList.add('bottom-sheet-open');
  }

  /**
   * Overridden from `ArcOverlayMixin`.
   */
  _renderClosed(): void {
    const node = this;
    node.classList.remove('bottom-sheet-open');
  }

  _onFitIntoChanged(fitInto?: HTMLElement | Window): void {
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
