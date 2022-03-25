import { html, CSSResult, TemplateResult } from 'lit';
import AnypointElement from './AnypointElement';
import { AnypointDialogMixin } from '../mixins/AnypointDialogMixin.js';
import dialogStyles from '../styles/AnypointDialogStyles.js';

export default class AnypointDialogElement extends AnypointDialogMixin(AnypointElement) {
  static get styles(): CSSResult[] {
    return [
      dialogStyles,
    ];
  }

  render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
