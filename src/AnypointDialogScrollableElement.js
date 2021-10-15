import { html, LitElement, css } from 'lit-element';

export default class AnypointDialogScrollableElement extends LitElement {

  // eslint-disable-next-line class-methods-use-this
  get styles() {
    return [
      css`
      :host {
        display: block;
        position: relative;
      }

      .scrollable {
        overflow: auto;
        padding: 0 24px;
      }

      :host(.is-scrolled:not(:first-child))::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: var(--divider-color);
      }

      :host(.can-scroll:not(.scrolled-to-bottom):not(:last-child))::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: var(--divider-color);
      }
      `
    ];
  }

  static get properties() {
    return {
      /**
       * Parent element to this element.
       */
      dialogElement: { type: Object }
    };
  }

  /**
   * Returns the scrolling element.
   */
  get scrollTarget() {
    return this.shadowRoot.querySelector('.scrollable');
  }

  constructor() {
    super();
    this.dialogElement = undefined;
  }

  firstUpdated() {
    this._ensureTarget();
    // dialog styles has this style definition
    this.classList.add('no-padding');
  }

  _ensureTarget() {
    const node = this.dialogElement || this.parentElement;
    if (node) {
      node.sizingTarget = this.scrollTarget;
    }
  }

  updateScrollState() {
    const sc = /** @type HTMLElement */ (this.scrollTarget);
    const { scrollTop, offsetHeight, scrollHeight } = sc;
    this._toggleClass('is-scrolled', scrollTop > 0);
    this._toggleClass('can-scroll', offsetHeight < scrollHeight);
    this._toggleClass('scrolled-to-bottom', scrollTop + offsetHeight >= scrollHeight);
  }

  _toggleClass(styles, add) {
    if (add) {
      this.classList.add(styles);
    } else {
      this.classList.remove(styles);
    }
  }

  render() {
    return html`
      <style>${this.styles}</style>
      <div class="scrollable" @scroll="${this.updateScrollState}">
        <slot></slot>
      </div>
    `;
  }
}
