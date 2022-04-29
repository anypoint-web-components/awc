import { html, LitElement, css, CSSResult, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

/**
 * @slot - The scrollable content
 */
export default class AnypointDialogScrollableElement extends LitElement {
  static get styles(): CSSResult[] {
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

  /**
   * Parent element to this element.
   */
  @property({ type: Object })
  dialogElement?: HTMLElement;
  
  /**
   * Returns the scrolling element.
   */
  get scrollTarget(): HTMLElement {
    return this.shadowRoot!.querySelector('.scrollable')!;
  }

  firstUpdated(): void {
    this._ensureTarget();
    // dialog styles has this style definition
    this.classList.add('no-padding');
  }

  _ensureTarget(): void {
    const node = this.dialogElement || this.parentElement;
    if (node) {
      // @ts-ignore
      node.sizingTarget = this.scrollTarget;
    }
  }

  updateScrollState(): void {
    const sc = this.scrollTarget;
    const { scrollTop, offsetHeight, scrollHeight } = sc;
    this._toggleClass('is-scrolled', scrollTop > 0);
    this._toggleClass('can-scroll', offsetHeight < scrollHeight);
    this._toggleClass('scrolled-to-bottom', scrollTop + offsetHeight >= scrollHeight);
  }

  _toggleClass(styles: string, add?: boolean): void {
    if (add) {
      this.classList.add(styles);
    } else {
      this.classList.remove(styles);
    }
  }

  render(): TemplateResult {
    return html`
      <div class="scrollable" @scroll="${this.updateScrollState}">
        <slot></slot>
      </div>
    `;
  }
}
