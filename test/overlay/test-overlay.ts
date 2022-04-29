/* eslint-disable wc/no-self-class */
import { html, css, TemplateResult, CSSResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import OverlayElement from '../../src/elements/overlay/OverlayElement.js';

@customElement('test-overlay')
export class TestOverlay extends OverlayElement {
  get styles(): CSSResult {
    return css`
    :host {
        background: white;
        color: black;
        border: 1px solid black;
      }

      :host([animated]) {
        -webkit-transition: -webkit-transform 0.3s;
        transition: transform 0.3s;
        -webkit-transform: translateY(300px);
        transform: translateY(300px);
      }

      :host(.opened[animated]) {
        -webkit-transform: translateY(0px);
        transform: translateY(0px);
      }`;
  }

  @property({ type: Boolean, reflect: true, attribute: 'animated' })
  _animated = false;
  
  get animated(): boolean {
    return this._animated;
  }

  set animated(value: boolean) {
    this._animated = value;
  }

  constructor() {
    super();
    this.addEventListener('transitionend', this.__onTransitionEnd.bind(this));
  }

  _renderOpened(): void {
    if (this.animated) {
      if (this.withBackdrop) {
        // @ts-ignore
        this.backdropElement.open();
      }
      this.classList.add('opened');
      this.dispatchEvent(new CustomEvent('simple-overlay-open-animation-start', {
        composed: true,
        bubbles: true
      }));
    } else {
      this._finishRenderOpened();
    }
  }

  _renderClosed(): void {
    if (this.animated) {
      if (this.withBackdrop) {
        // @ts-ignore
        this.backdropElement.close();
      }
      this.classList.remove('opened');
      this.dispatchEvent(new CustomEvent('simple-overlay-close-animation-start', {
        composed: true,
        bubbles: true
      }));
    } else {
      this._finishRenderClosed();
    }
  }

  __onTransitionEnd(e: Event): void {
    if (e && e.target === this) {
      if (this.opened) {
        this._finishRenderOpened();
      } else {
        this._finishRenderClosed();
      }
    }
  }

  render(): TemplateResult {
    return html`<style>${this.styles}</style><slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "test-overlay": TestOverlay;
  }
}
