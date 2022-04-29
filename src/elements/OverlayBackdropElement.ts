/**
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
import { LitElement, html, css, CSSResult, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

/* eslint-disable class-methods-use-this */
/* eslint-disable no-plusplus */
/* eslint-disable no-continue */

/*
`arc-overlay-backdrop` is a backdrop used by `OverlayElement`. It
should be a singleton.

Originally designed by the Polymer team, ported to LitElement by ARC team.

*/
export default class OverlayBackdropElement extends LitElement {
  static get styles(): CSSResult {
    return css`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--arc-overlay-backdrop-background-color, var(--overlay-backdrop-background-color, #000));
      opacity: 0;
      transition: var(--arc-overlay-backdrop-transition, opacity 0.2s);
      pointer-events: none;
    }

    :host(.opened) {
      opacity: var(--arc-overlay-backdrop-opacity, var(--overlay-backdrop-opacity, 0.6));
      pointer-events: auto;
    }`;
  }

  __opened = false;

  // Used to cancel previous requestAnimationFrame calls when opened changes.
  __openedRaf?: number;

  private isAttached = false;

  @property({ type: Boolean, reflect: true })
  get opened(): boolean {
    return this.__opened;
  }

  set opened(value: boolean) {
    const old = this.__opened;
    if (old === value) {
      return;
    }
    this.__opened = value;
    this._openedChanged(value);
  }

  constructor() {
    super();
    this.opened = false;
    this._onTransitionend = this._onTransitionend.bind(this);
  }

  connectedCallback(): void {
    this.isAttached = true;
    super.connectedCallback();
    this.addEventListener('transitionend', this._onTransitionend, true);
    if (this.opened) {
      this._openedChanged(this.opened);
    }
  }

  disconnectedCallback(): void {
    this.isAttached = false;
    super.disconnectedCallback();
    this.removeEventListener('transitionend', this._onTransitionend);
  }

  /**
   * Appends the backdrop to document body if needed.
   */
  prepare(): void {
    if (this.opened && !this.parentNode) {
      document.body.appendChild(this);
    }
  }

  /**
   * Shows the backdrop.
   */
  open(): void {
    this.opened = true;
  }

  /**
   * Hides the backdrop.
   */
  close(): void {
    this.opened = false;
  }

  /**
   * Removes the backdrop from document body if needed.
   */
  complete(): void {
    if (!this.opened && this.parentNode === document.body) {
      this.parentNode.removeChild(this);
    }
  }

  _onTransitionend(e: Event): void {
    if (e && e.target === this) {
      this.complete();
    }
  }

  _openedChanged(opened: boolean): void {
    if (opened) {
      // Auto-attach.
      this.prepare();
    } else {
      // Animation might be disabled via the element or opacity custom property.
      // If it is disabled in other ways, it's up to the user to call complete.
      const cs = window.getComputedStyle(this);
      if (cs.transitionDuration === '0s' || cs.opacity === '0') {
        this.complete();
      }
    }

    if (!this.isAttached) {
      return;
    }

    // Always cancel previous requestAnimationFrame.
    if (this.__openedRaf) {
      window.cancelAnimationFrame(this.__openedRaf);
      this.__openedRaf = undefined;
    }
    // Force relayout to ensure proper transitions.
    const { scrollTop } = this;
    // @ts-ignore
    this.scrollTop = undefined;
    this.scrollTop = scrollTop;
    this.__openedRaf = window.requestAnimationFrame(() => {
      this.__openedRaf = undefined;
      this.toggleClass('opened', this.opened);
    });
  }

  /**
   * Toggles class on this element.
   * @param klass CSS class name to toggle
   * @param condition Boolean condition to test whether the class should be added or removed.
   */
  toggleClass(klass: string, condition?: boolean): void {
    if (condition) {
      if (!this.classList.contains(klass)) {
        this.classList.add(klass);
      }
    } else if (this.classList.contains(klass)) {
        this.classList.remove(klass);
      }
  }

  render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
