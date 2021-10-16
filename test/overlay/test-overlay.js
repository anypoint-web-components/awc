import { LitElement, html, css } from 'lit-element';
import { OverlayMixin } from '../../index.js';

export class TestOverlay extends OverlayMixin(LitElement) {
  get styles() {
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

  static get properties() {
    return {
      _animated: { type: Boolean, reflect: true, attribute: 'animated' }
    };
  }

  get animated() {
    return this._animated;
  }

  set animated(value) {
    this._animated = value;
  }

  constructor() {
    super();

    this.__onTransitionEnd = this.__onTransitionEnd.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('transitionend', this.__onTransitionEnd);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('transitionend', this.__onTransitionEnd);
  }

  _renderOpened() {
    if (this.animated) {
      if (this.withBackdrop) {
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

  _renderClosed() {
    if (this.animated) {
      if (this.withBackdrop) {
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

  __onTransitionEnd(e) {
    if (e && e.target === this) {
      if (this.opened) {
        this._finishRenderOpened();
      } else {
        this._finishRenderClosed();
      }
    }
  }

  render() {
    return html`<style>${this.styles}</style>
<slot></slot>`;
  }
}
customElements.define('test-overlay', TestOverlay);
