import { html, css, CSSResult, TemplateResult, SVGTemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { visibilityOff, visibility, } from '../resources/Icons.js';
import AnypointInputElement from './AnypointInputElement.js';
import '../../define/anypoint-icon-button.js';
import { SupportedInputTypes } from '../types';

/* eslint-disable class-methods-use-this */

export default class AnypointMaskedInputElement extends AnypointInputElement {
  static get styles(): CSSResult[] {
    return [
      ...AnypointInputElement.styles,
      css`
        .icon {
          display: inline-block;
          width: 24px;
          height: 24px;
          fill: currentColor;
        }
      `,
    ];
  }

  /**
   * @return An icon to render
   */
  get _visibilityToggleIcon(): SVGTemplateResult {
    return this.visible ? visibilityOff : visibility;
  }

  /**
   * @return Title for the toggle icon
   */
  get _visibilityToggleTitle(): string {
    return this.visible ? 'Hide input value' : 'Show input value';
  }

  /**
   * @return Label for the toggle icon
   */
  get _visibilityToggleLabel(): string {
    return this.visible
      ? 'Activate to hide input value'
      : 'Activate to show input value';
  }

  /**
   * @return Input type to pass to the control
   */
  get _inputType(): SupportedInputTypes {
    if (this.visible) {
      return this.type || 'text';
    }
    return 'password';
  }

  /**
   * When set the input renders the value visible and restores
   * original input type.
   */
  @property({ type: Boolean })
  visible?: boolean;

  /**
   * Toggles `visible` property value.
   */
  toggleVisibility(): void {
    this.visible = !this.visible;
  }

  _suffixTemplate(): TemplateResult {
    const {
      disabled,
      _visibilityToggleIcon,
      _visibilityToggleTitle,
      _visibilityToggleLabel,
    } = this;
    return html`
      <div class="suffixes">
        <anypoint-icon-button
          @click="${this.toggleVisibility}"
          title="${_visibilityToggleTitle}"
          aria-label="${_visibilityToggleLabel}"
          ?disabled="${disabled}"
        >
          <span class="icon">${_visibilityToggleIcon}</span>
        </anypoint-icon-button>
        <slot name="suffix"></slot>
      </div>`;
  }
}
