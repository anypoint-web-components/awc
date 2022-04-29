import { html, CSSResult, TemplateResult } from 'lit';
import { onIcon, offIcon } from '../../resources/AnypointSwitchIcons.js';
import styles from '../../styles/Switch.js';
import AnypointCheckboxElement from './AnypointCheckboxElement.js';

/**
 * `anypoint-switch`
 * 
 * @slot - The label of the control
 */
export default class AnypointSwitchElement extends AnypointCheckboxElement {
  static get styles(): CSSResult {
    return styles;
  }

  _mdContent(): TemplateResult {
    return html`<div class="track"></div>
    <div class="toggle-container">
      <div class="button"></div>
    </div>`;
  }

  _compatibleContent(): TemplateResult {
    const { checked } = this;
    const icon = checked ? onIcon : offIcon;
    return html`
    <div class="anypoint container">
      <div class="tracker">
        <div class="toggle">
          <span class="icon">${icon}</span>
        </div>
      </div>
    </div>`;
  }

  render(): TemplateResult {
    const { anypoint } = this;
    return html`
    ${anypoint
      ? this._compatibleContent()
      : this._mdContent()}
    <div class="label"><slot></slot></div>
    `;
  }
}
