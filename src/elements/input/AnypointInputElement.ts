import { CSSResult, css, html, TemplateResult } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { classMap } from "lit/directives/class-map.js";
import { retargetHandler } from "../../lib/Events.js";
import InputElement from "./InputElement.js";
import styles from './CommonStyles.js';
import { SupportedInputTypes } from "../../types.js";

/**
 * @slot prefix - The content rendered before the input. It is centered in the input.
 * @slot suffix - The content rendered after the input. It is centered in the input.
 */
export default class AnypointInputElement extends InputElement {
  static get styles(): CSSResult[] {
    return [
      styles,
      css`
      .input-element[type='datetime-local'] {
        /* For default 200px width this type expands outside the border */
        width: calc(100% - 40px);
        margin: 8px 8px 0 8px;
        padding: 0;
      }

      .input-element[type='color'],
      .input-element[type='file'] {
        height: 70%;
        margin: 0;
        align-self: end;
        padding: 0;
      }

      .input-element[type='file'] {
        height: 50%;
      }

      .prefixes ::slotted(*) {
        margin: 0 0 0 8px;
      }

      .suffixes ::slotted(*) {
        margin: 0 8px 0 0;
      }

      :host([nolabelfloat]) {
        height: 40px;
      }
      `
    ];
  }

  /**
   * @return Input type to pass to the control
   */
  get _inputType(): SupportedInputTypes {
    return this.type || 'text';
  }
  
  protected render(): TemplateResult {
    return html`
    <div class="input-container">
    ${this._prefixTemplate()}
    <div class="label-area">
      ${this._labelTemplate()}
      ${this._inputTemplate()}
    </div>
    ${this._suffixTemplate()}
    </div>
    ${this._assistiveTemplate()}
    `;
  }

  protected _suffixTemplate(): TemplateResult | string {
    return html`<div class="suffixes"><slot name="suffix"></slot></div>`;
  }

  protected _prefixTemplate(): TemplateResult | string {
    return html`<div class="prefixes"><slot name="prefix"></slot></div>`;
  }

  protected _labelTemplate(): TemplateResult {
    const { label = '', _isFloating, noLabelFloat, anypoint = false } = this;
    const classes = {
      label: true,
      floating: _isFloating,
      hidden: _isFloating && !!noLabelFloat,
      anypoint,
    };
    return html`
    <label class="${classMap(classes)}" for="input">${label}</label>
    `;
  }

  protected _inputTemplate(): TemplateResult {
    const step = typeof this.step === 'undefined' ? undefined : Number(this.step);
    const tabIndex = this.focused ? '0' : '-1';
    let value: string = ''; 
    const { value: v } = this;
    if (v !== null && v !== undefined && this.type !== 'file') {
      value = String(v);
    }
    return html`<input
      id="input"
      class="input-element"
      aria-invalid="${this.invalid ? 'true' : 'false'}"
      ?disabled="${this.disabled}"
      type="${this._inputType}"
      pattern="${ifDefined(this.pattern)}"
      ?required="${this.required}"
      autocomplete="${ifDefined(this.autocomplete)}"
      ?autofocus="${this.autofocus}"
      inputmode="${ifDefined(this.inputMode)}"
      minlength="${ifDefined(this.minLength)}"
      maxlength="${ifDefined(this.maxLength)}"
      min="${ifDefined(this.min)}"
      max="${ifDefined(this.max)}"
      step="${ifDefined(step)}"
      name="${ifDefined(this.name)}"
      placeholder="${ifDefined(this.placeholder)}"
      ?readonly="${this.readOnly}"
      size="${ifDefined(this.size)}"
      autocapitalize="${ifDefined(this.autocapitalize)}"
      autocorrect="${ifDefined(this.autocorrect)}"
      tabindex="${tabIndex}"
      results="${ifDefined(this.results)}"
      accept="${ifDefined(this.accept)}"
      ?multiple="${this.multiple}"
      spellcheck="${ifDefined(this.spellcheck)}"
      .value="${value}"
      @input="${this._inputHandler}"
      @change="${retargetHandler}"
      @search="${retargetHandler}"
    />
    `;
  }

  _assistiveTemplate(): TemplateResult {
    return html`
    <div class="assistive-info">
      ${this._infoMessageTemplate()}
      ${this._errorMessageTemplate()}
    </div>`;
  }

  protected _infoMessageTemplate(): TemplateResult | string {
    const { infoMessage } = this;
    if (!infoMessage) {
      return '';
    }
    const isInvalidWithMessage = !!this.invalidMessage && !!this.invalid;
    const classes = {
      info: true,
      'label-hidden': isInvalidWithMessage,
    };
    return html`<p class="${classMap(classes)}" aria-hidden="${this.invalid ? 'true' : 'false'}" id="infoDescription">${infoMessage}</p>`;
  }

  protected _errorMessageTemplate(): TemplateResult | string {
    const { invalidMessage } = this;
    if (!invalidMessage) {
      return '';
    }
    const classes = {
      invalid: true,
      'label-hidden': !this.invalid,
      'info-offset': !!this.infoMessage,
    };
    return html`<p class="${classMap(classes)}" aria-hidden="${this.invalid ? 'false' : 'true'}" id="errorDescription">${invalidMessage}</p>`;
  }
}
