import { html, css, LitElement } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { AnypointInputMixin } from './mixins/AnypointInputMixin.js';
import commonStyles from './styles/anypoint-input-styles.js';

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
  get styles() {
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

  get _prefixed() {
    return this.querySelector('[slot=prefix]');
  }

  get _labelClass() {
    const labelFloating =
      !!this.value ||
      floatTypes.indexOf(this.type) !== -1 ||
      !!this.placeholder ||
      this.focused;
    let klas = 'label';
    if (this._prefixed) {
      klas += ' with-prefix';
    }
    if (labelFloating && this.noLabelFloat) {
      klas += ' hidden';
    } else {
      klas += labelFloating ? ' floating' : ' resting';
    }
    if (this.compatibility) {
      klas += ' compatibility';
    }
    return klas;
  }

  get _infoAddonClass() {
    let klas = 'info';
    const isInvalidWithMessage = !!this.invalidMessage && this.invalid;
    if (isInvalidWithMessage) {
      klas += ' label-hidden';
    }
    return klas;
  }

  get _errorAddonClass() {
    let klas = 'invalid';
    if (!this.invalid) {
      klas += ' label-hidden';
    }
    if (this.infoMessage) {
      klas += ' info-offset';
    }
    return klas;
  }

  get _inputType() {
    if (this.type) {
      return this.type;
    }
    return 'text';
  }

  get bindValue() {
    const {value} = this;
    return value === undefined || value === null ? '' : value;
  }

  /**
   * Re-targets an event that does not bubble
   *
   * @param {Event} e The event to retarget
   */
  _retargetEvent(e) {
    this.dispatchEvent(new CustomEvent(e.type));
  }

  render() {
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

  _suffixTemplate() {
    return html`<div class="suffixes">
      <slot name="suffix"></slot>
    </div>`;
  }

  _prefixTemplate() {
    return html`<div class="prefixes">
      <slot name="prefix"></slot>
    </div>`;
  }

  _assistiveTemplate() {
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

  _labelTemplate() {
    const { _labelClass, _ariaLabelledBy } = this;
    return html`<div class="${_labelClass}" id="${_ariaLabelledBy}">
      <slot name="label"></slot>
    </div>`;
  }

  _inputTemplate() {
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
      aria-labelledby="${_ariaLabelledBy}"
      ?disabled="${disabled}"
      type="${_inputType}"
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
