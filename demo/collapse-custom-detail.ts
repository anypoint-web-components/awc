import { html, css, LitElement, TemplateResult, CSSResult } from 'lit';
import { property } from 'lit/decorators.js';
import '../define/anypoint-collapse.js';
import { AnypointCollapseElement } from '../index.js';

export class CustomDetail extends LitElement {
  static get styles(): CSSResult {
    return css`
    :host {
      display: block;
    }

    #trigger {
      padding: 10px 15px;
      background-color: #f3f3f3;
      border: 1px solid #dedede;
      border-radius: 5px;
      font-size: 18px;
      cursor: pointer;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      text-align: left;
    }

    :host([opened]) #trigger {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    anypoint-collapse {
      border: 1px solid #dedede;
      border-top: none;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 5px;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
                    0 1px 5px 0 rgba(0, 0, 0, 0.12),
                    0 3px 1px -2px rgba(0, 0, 0, 0.2);
    }
    `;
  }
  
  @property({ type: Boolean })
  horizontal?: boolean;

  @property({ type: Boolean, reflect: true })
  opened?: boolean;

  @property({ type: Boolean })
  noAnimation?: boolean;

  get buttonLabel(): string {
    return this.opened ? 'Collapse' : 'Expand';
  }

  toggle(): void {
    const node = this.shadowRoot!.querySelector('#collapse') as AnypointCollapseElement;
    node.toggle();
  }

  render(): TemplateResult {
    const { opened, buttonLabel, horizontal, noAnimation } = this;
    return html`
    <button id="trigger" @click="${this.toggle}" aria-expanded="${opened ? 'true' : 'false'}" aria-controls="collapse">${buttonLabel}</button>
    <anypoint-collapse
      id="collapse"
      ?opened="${opened}"
      ?horizontal="${horizontal}"
      ?noanimation="${noAnimation}"
      tabindex="0"
    >
      <slot></slot>
    </anypoint-collapse>`;
  }
}
window.customElements.define('custom-detail', CustomDetail);
