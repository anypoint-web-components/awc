import { html, css } from 'lit-element';
import { visibilityOff, visibility, } from '@advanced-rest-client/arc-icons/ArcIcons.js';
import AnypointInputElement from './AnypointInputElement.js';
import '../anypoint-icon-button.js';

/* eslint-disable class-methods-use-this */

/** @typedef {import('lit-element').CSSResult} CSSResult */
/** @typedef {import('lit-element').SVGTemplateResult} SVGTemplateResult */

export default class AnypointMaskedInputElement extends AnypointInputElement {
  get styles() {
    return [
      // @ts-ignore
      super.styles,
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
   * @return {SVGTemplateResult} An icon to render
   */
  get _visibilityToggleIcon() {
    return this.visible ? visibilityOff : visibility;
  }

  /**
   * @return {string} Title for the toggle icon
   */
  get _visibilityToggleTitle() {
    return this.visible ? 'Hide input value' : 'Show input value';
  }

  /**
   * @return {string} Label for the toggle icon
   */
  get _visibilityToggleLabel() {
    return this.visible
      ? 'Activate to hide input value'
      : 'Activate to show input value';
  }

  /**
   * @return {string} Input type to pass to the control
   */
  get _inputType() {
    if (this.visible) {
      return this.type || 'text';
    }
    return 'password';
  }

  static get properties() {
    return {
      /**
       * When set the input renders the value visible and restores
       * original input type.
       */
      visible: { type: Boolean },
    };
  }

  /**
   * Toggles `visible` property value.
   */
  toggleVisibility() {
    this.visible = !this.visible;
  }

  _suffixTemplate() {
    const {
      disabled,
      _visibilityToggleIcon,
      _visibilityToggleTitle,
      _visibilityToggleLabel,
    } = this;
    return html`<style>
        ${this.styles}
      </style>
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
