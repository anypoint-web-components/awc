import { html, css, LitElement, CSSResult, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { AnypointInputMixin } from '../mixins/AnypointInputMixin.js';
import commonStyles from '../styles/anypoint-input-styles.js';
import { SupportedInputTypes } from '../types';

/* eslint-disable class-methods-use-this */

const floatTypes = [
  'date',
  'color',
  'datetime-local',
  'file',
  'month',
  'time',
  'week',
];

export default class AnypointInputElement extends AnypointInputMixin(LitElement) {
  get styles(): CSSResult[] {
    return [
      commonStyles,
      css`
        .input-element[type='datetime-local'] {
          /* For default 200px width this type expands outside the border */
          width: calc(100% - 40px);
          margin: 0 8px;
          padding: 0;
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
      `,
    ];
  }

  get _prefixed(): HTMLSlotElement {
    return this.querySelector('[slot=prefix]')!;
  }

  get _labelClass(): string {
    const labelFloating = !!this.value
      || floatTypes.indexOf(this.type) !== -1
      || !!this.placeholder
      || this.focused;
    let result = 'label';
    if (this._prefixed) {
      result += ' with-prefix';
    }
    if (labelFloating && this.noLabelFloat) {
      result += ' hidden';
    } else {
      result += labelFloating ? ' floating' : ' resting';
    }
    if (this.anypoint) {
      result += ' anypoint';
    }
    return result;
  }

  get _infoAddonClass(): string {
    let result = 'info';
    const isInvalidWithMessage = !!this.invalidMessage && this.invalid;
    if (isInvalidWithMessage) {
      result += ' label-hidden';
    }
    return result;
  }

  get _errorAddonClass(): string {
    let result = 'invalid';
    if (!this.invalid) {
      result += ' label-hidden';
    }
    if (this.infoMessage) {
      result += ' info-offset';
    }
    return result;
  }

  get _inputType(): SupportedInputTypes {
    if (this.type) {
      return this.type;
    }
    return 'text';
  }

  get bindValue(): string {
    const { value } = this;
    return value === undefined || value === null ? '' : value;
  }

  /**
   * Re-targets an event that does not bubble
   *
   * @param e The event to retarget
   */
  _retargetEvent(e: Event): void {
    this.dispatchEvent(new Event(e.type));
  }

  render(): TemplateResult {
    return html`
    <style>${this.styles}</style>
    <div class="input-container">
      ${this._prefixTemplate()}
      <div class="input-label">
        ${this._labelTemplate()} ${this._inputTemplate()}
      </div>
      ${this._suffixTemplate()}
    </div>
    ${this._assistiveTemplate()}
    `;
  }

  _suffixTemplate(): TemplateResult {
    return html`<div class="suffixes">
      <slot name="suffix"></slot>
    </div>`;
  }

  _prefixTemplate(): TemplateResult {
    return html`<div class="prefixes">
      <slot name="prefix"></slot>
    </div>`;
  }

  _assistiveTemplate(): TemplateResult {
    const {
      invalidMessage,
      infoMessage,
      _errorAddonClass,
      _infoAddonClass,
    } = this;
    return html`<div class="assistive-info">
      ${infoMessage
        ? html`<p class="${_infoAddonClass}">${this.infoMessage}</p>`
        : ''}
      ${invalidMessage
        ? html`<p class="${_errorAddonClass}">${invalidMessage}</p>`
        : ''}
    </div>`;
  }

  _labelTemplate(): TemplateResult {
    const { _labelClass, _ariaLabelledBy } = this;
    return html`<div class="${_labelClass}" id="${ifDefined(_ariaLabelledBy)}">
      <slot name="label"></slot>
    </div>`;
  }

  _inputTemplate(): TemplateResult {
    const {
      _ariaLabelledBy,
      disabled,
      pattern,
      required,
      autocomplete,
      autofocus,
      inputMode,
      minLength,
      maxLength,
      min,
      max,
      step,
      name,
      placeholder,
      readOnly,
      list,
      size,
      autocapitalize,
      autocorrect,
      results,
      accept,
      multiple,
      spellcheck,
      bindValue,
      _inputType,
    } = this;
    return html`<input
      class="input-element"
      aria-labelledby="${ifDefined(_ariaLabelledBy)}"
      ?disabled="${disabled}"
      type="${ifDefined(_inputType)}"
      pattern="${ifDefined(pattern)}"
      ?required="${required}"
      autocomplete="${ifDefined(autocomplete)}"
      ?autofocus="${autofocus}"
      inputmode="${ifDefined(inputMode)}"
      minlength="${ifDefined(minLength)}"
      maxlength="${ifDefined(maxLength)}"
      min="${ifDefined(min)}"
      max="${ifDefined(max)}"
      step="${ifDefined(step)}"
      name="${ifDefined(name)}"
      placeholder="${ifDefined(placeholder)}"
      ?readonly="${readOnly}"
      list="${ifDefined(list)}"
      size="${ifDefined(size)}"
      autocapitalize="${ifDefined(autocapitalize)}"
      autocorrect="${ifDefined(autocorrect)}"
      tabindex="-1"
      results="${ifDefined(results)}"
      accept="${ifDefined(accept)}"
      ?multiple="${multiple}"
      spellcheck="${ifDefined(spellcheck)}"
      .value="${bindValue}"
      @change="${this._onChange}"
      @input="${this._onInput}"
      @search="${this._retargetEvent}"
    />`;
  }
}
