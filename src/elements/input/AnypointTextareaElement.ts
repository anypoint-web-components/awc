import { html, css, CSSResult, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { property } from 'lit/decorators.js';
import AnypointInputElement from './AnypointInputElement.js';
import commonStyles from '../../styles/anypoint-input-styles.js';
import { retargetHandler } from '../../lib/Events.js';

/* eslint-disable class-methods-use-this */

export default class AnypointTextareaElement extends AnypointInputElement {
  static get styles(): CSSResult[] {
    return [
      commonStyles,
      css`
        :host {
          min-height: 96px;
          min-width: 200px;
          width: auto;
          height: auto;
        }

        .label {
          left: 8px;
          top: 20px;
          transform: scale(1);
          transition: transform 0.12s ease-in-out, max-width 0.12s ease-in-out, top 0.12s ease-in-out;
        }

        .label.floating {
          top: 8px;
          transform: scale(0.75);
        }

        .input-container {
          min-height: inherit;
        }

        .label-area {
          position: relative;
          align-self: stretch;
          flex: 1;
          display: flex;
        }

        .input-element {
          height: calc(100% - 16px);
          min-height: inherit;
          margin: 20px 0 8px 0;
        }

        :host([outlined]) .label {
          margin-top: 0px;
          top: 8px;
          transform: scale(1);
        }

        :host([outlined]) .label.floating {
          transform: translateY(-15px) scale(0.75);
        }

        :host([outlined]) .input-element {
          margin-top: 8px;
          top: 0;
        }

        :host([anypoint]) {
          height: auto;
        }

        :host([anypoint]) .label {
          top: -18px;
          transform: none;
        }

        :host([anypoint]) .input-element {
          margin: 0;
          height: 100%;
        }

        :host([nolabelfloat]) {
          height: auto;
          min-height: 72px;
        }

        :host([nolabelfloat]) .input-element {
          margin: 8px 0;
        }
      `,
    ];
  }

  /**
   * Binds this to the `<textarea>`'s `cols` property.
   * @attr
   */
  @property({ type: Number })
  cols?: number;

  /**
   * Binds this to the `<textarea>`'s `rows` property.
   * @attr
   */
  @property({ type: Number })
  rows?: number;

  /**
   * Binds this to the `<textarea>`'s `wrap` property.
   * @attr
   */
  @property({ type: String })
  wrap?: "soft" | "hard";

  protected _suffixTemplate(): string {
    return '';
  }

  protected _prefixTemplate(): string {
    return '';
  }

  protected _inputTemplate(): TemplateResult {
    return html`
    <textarea
      id="input"
      class="input-element"
      autocomplete="${ifDefined(this.autocomplete)}"
      autocapitalize="${ifDefined(this.autocapitalize)}"
      autocorrect="${ifDefined(this.autocorrect)}"
      ?autofocus="${this.autofocus}"
      cols="${ifDefined(this.cols)}"
      ?disabled="${this.disabled}"
      inputmode="${ifDefined(this.inputMode)}"
      maxlength="${ifDefined(this.maxLength)}"
      minlength="${ifDefined(this.minLength)}"
      name="${ifDefined(this.name)}"
      placeholder="${ifDefined(this.placeholder)}"
      ?required="${this.required}"
      ?readonly="${this.readOnly}"
      rows="${ifDefined(this.rows)}"
      spellcheck="${ifDefined(this.spellcheck)}"
      tabindex="-1"
      wrap="${ifDefined(this.wrap)}"
      .value="${this.value || ''}"
      @input="${this._inputHandler}"
      @change="${retargetHandler}"
    ></textarea>
    `;
  }
}
