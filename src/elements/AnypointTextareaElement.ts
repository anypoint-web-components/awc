import { html, css, CSSResult, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { property } from 'lit/decorators.js';
import AnypointInputElement from './AnypointInputElement.js';
import commonStyles from '../styles/anypoint-input-styles.js';

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

        .textarea .label {
          left: 8px;
          top: 8px;
        }

        .textarea .input-label {
          align-items: start;
        }

        .textarea .label.resting {
          transform: scale(0.75);
        }

        .textarea .label.floating {
          top: 8px;
          transform: scale(0.75);
        }

        .input-container {
          min-height: inherit;
        }

        .input-label {
          min-height: inherit;
        }

        .input-element {
          height: calc(100% - 16px);
          min-height: inherit;
          margin: 20px 0 8px 0;
        }

        :host([outlined]) .label.resting {
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

        :host([anypoint]) .textarea .label {
          top: -18px;
          transform: none;
        }

        :host([anypoint]) .textarea .input-element {
          margin: 0;
        }

        :host([nolabelfloat]) {
          height: auto;
          min-height: 72px;
        }

        :host([nolabelfloat]) .textarea .input-element {
          margin: 8px 0;
        }
      `,
    ];
  }

  get _labelClass(): string {
    const labelFloating = !!this.value || !!this.placeholder || this.focused;
    let klas = 'label';

    if (labelFloating && this.noLabelFloat) {
      klas += ' hidden';
    } else {
      klas += labelFloating ? ' floating' : ' resting';
    }

    return klas;
  }

  get _infoAddonClass(): string {
    let klas = 'info';
    const isInvalidWithMessage = !!this.invalidMessage && this.invalid;
    if (isInvalidWithMessage) {
      klas += ' label-hidden';
    }
    return klas;
  }

  get _errorAddonClass(): string {
    let klas = 'invalid';
    if (!this.invalid) {
      klas += ' label-hidden';
    }
    if (this.infoMessage) {
      klas += ' info-offset';
    }
    return klas;
  }

  /**
   * Binds this to the `<textarea>`'s `cols` property.
   */
  @property({ type: Number })
  cols?: number;

  /**
   * Binds this to the `<textarea>`'s `rows` property.
   */
  @property({ type: Number })
  rows?: number;

  /**
   * Binds this to the `<textarea>`'s `wrap` property.
   */
  @property({ type: String })
  wrap?: "soft" | "hard";

  render(): TemplateResult {
    const {
      value,
      _ariaLabelledBy,
      disabled,
      cols,
      rows,
      spellcheck,
      required,
      autocomplete,
      autofocus,
      inputMode,
      minLength,
      maxLength,
      wrap,
      name,
      placeholder,
      readOnly,
      autocapitalize,
      autocorrect,
      invalidMessage,
      infoMessage,
      _labelClass,
      _errorAddonClass,
      _infoAddonClass,
    } = this;
    const bindValue = value || '';

    return html`
      <div class="input-container">
        <div class="textarea input-label">
          <div class="${_labelClass}" id="${ifDefined(_ariaLabelledBy)}">
            <slot name="label"></slot>
          </div>
          <textarea
            class="input-element"
            aria-labelledby="${ifDefined(_ariaLabelledBy)}"
            autocomplete="${ifDefined(autocomplete)}"
            autocapitalize="${ifDefined(autocapitalize)}"
            autocorrect="${ifDefined(autocorrect)}"
            ?autofocus="${autofocus}"
            cols="${ifDefined(cols)}"
            ?disabled="${disabled}"
            inputmode="${ifDefined(inputMode)}"
            maxlength="${ifDefined(maxLength)}"
            minlength="${ifDefined(minLength)}"
            name="${ifDefined(name)}"
            placeholder="${ifDefined(placeholder)}"
            ?required="${required}"
            ?readonly="${readOnly}"
            rows="${ifDefined(rows)}"
            spellcheck="${ifDefined(spellcheck)}"
            tabindex="-1"
            wrap="${ifDefined(wrap)}"
            .value="${bindValue}"
            @change="${this._onChange}"
            @input="${this._onInput}"
          ></textarea>
        </div>
      </div>
      <div class="assistive-info">
        ${infoMessage
          ? html`<p class="${_infoAddonClass}">${this.infoMessage}</p>`
          : ''}
        ${invalidMessage
          ? html`<p class="${_errorAddonClass}">${invalidMessage}</p>`
          : ''}
      </div> `;
  }
}
