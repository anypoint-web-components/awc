import { html, css, CSSResult, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import AnypointElement from './AnypointElement.js';

/* eslint-disable class-methods-use-this */

/**
 * `anypoint-item`
 * An Anypoint list item with 2 or 3 lines.
 */
export default class AnypointItemBodyElement extends AnypointElement {
  static get styles(): CSSResult {
    return css`
      :host {
        overflow: hidden; /* needed for text-overflow: ellipsis to work on ff */
        flex-direction: column;
        display: flex;
        justify-content: center;
        flex: 1;
        flex-basis: 0.000000001px;
      }

      :host([twoline]) {
        min-height: var(--anypoint-item-body-two-line-min-height, 72px);
      }

      :host([threeline]) {
        min-height: var(--anypoint-item-body-three-line-min-height, 88px);
      }

      :host > ::slotted(*) {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      :host > ::slotted([secondary]),
      :host > ::slotted([data-secondary]) {
        font-size: var(--font-body-font-size);
        letter-spacing: var(--font-body-letter-spacing);
        font-weight: var(--font-body-font-weight);
        color: var(--anypoint-item-body-secondary-color, var(--secondary-text-color));
        margin-top: 4px;
      }

      :host([anypoint]:hover) > ::slotted([secondary]),
      :host([anypoint]:hover) > ::slotted([data-secondary]),
      .anypoint-item[anypoint]:hover > [secondary],
      .anypoint-item[anypoint]:hover > [data-secondary] {
        color: var(
          --anypoint-item-secondary-focus-color,
          var(--anypoint-item-focus-color,
            var(--anypoint-color-coreBlue3)
          )
        );

        border-left-color: var(
          --anypoint-item-border-left-hover-color,
          var(--anypoint-color-coreBlue3)
        );
        border-right-color: var(
          --anypoint-item-border-right-hover-color,
          var(--anypoint-color-coreBlue3)
        );
      }
    `;
  }

  /**
   * Renders the item in a 2-line layout
   * @attribute
   */
  @property({ type: Boolean, reflect: true })
  twoLine?: boolean;

  /**
   * Renders the item in a 3-line layout
   * @attribute
   */
  @property({ type: Boolean, reflect: true })
  threeLine?: boolean;
  
  render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
