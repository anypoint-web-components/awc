import { html, LitElement } from 'lit-element';
import { AnypointDialogMixin } from './mixins/AnypointDialogMixin.js';
import dialogStyles from './styles/AnypointDialogStyles.js';

export default class AnypointDialogElement extends AnypointDialogMixin(LitElement) {
  // eslint-disable-next-line class-methods-use-this
  get styles() {
    return [
      dialogStyles,
    ];
  }

  static get properties() {
    return {
      /** 
       * Enables compatibility theme for Anypoint
       */
      compatibility: { type: Boolean, reflect: true, }
    };
  }

  render() {
    return html`
      <style>${this.styles}</style>
      <slot></slot>
    `;
  }
}
