import { html, css, CSSResult, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import AnypointButtonElement from '../button/AnypointButtonElement.js';
import '../../define/material-ripple.js';

/**
 * @slot - The content rendered in the tab
 */
export default class AnypointTabElement extends AnypointButtonElement {
  static get styles(): CSSResult[] {
    return [
      AnypointButtonElement.styles as CSSResult,
      css`
        :host {
          overflow: hidden;
          vertical-align: middle;
          margin: 0;
        }

        .tab-content {
          height: 100%;
          transition: opacity 0.1s cubic-bezier(0.4, 0, 1, 1);
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        }

        :host(:not(.selected)) > .tab-content {
          opacity: 0.8;
        }

        :host(:focus) .tab-content {
          opacity: 1;
          font-weight: 700;
        }

        :host([link]) {
          padding: 0;
        }

        material-ripple {
          color: var(--anypoint-tab-ink, var(--accent-color));
        }

        .tab-content > ::slotted(a) {
          flex: 1 1 auto;
          height: 100%;
        }
      `,
    ];
  }

  /**
   * If true, the tab will forward keyboard clicks (enter/space) to
   * the first anchor element found in its descendants
   * @attr
   */
  @property({ type: Boolean, reflect: true })
  link?: boolean;
  
  constructor() {
    super();
    this._clickHandler = this._clickHandler.bind(this);
  }

  connectedCallback(): void {
    /* istanbul ignore else */
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'tab');
    }
    super.connectedCallback();
    this.addEventListener('click', this._clickHandler);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('click', this._clickHandler);
  }

  _clickHandler(e: MouseEvent): void {
    if (this.link) {
      const slot = this.shadowRoot!.querySelector('slot') as HTMLSlotElement;
      const nodes = slot.assignedElements();
      const target = Array.from(nodes).find((node) => node.localName === 'a');
      /* istanbul ignore else */
      if (!target) {
        return;
      }
      // Don't get stuck in a loop delegating
      // the listener from the child anchor
      /* istanbul ignore next */
      if (e.target === target) {
        return;
      }
      /* istanbul ignore next */
      (target as HTMLElement).click();
    }
  }

  render(): TemplateResult {
    const { noink, anypoint } = this;
    const stopRipple = !!noink || !!anypoint;
    return html`<div class="tab-content"><slot></slot></div>
      <material-ripple .noink="${stopRipple}"></material-ripple>`;
  }
}
