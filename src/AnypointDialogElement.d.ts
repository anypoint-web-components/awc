import { TemplateResult, LitElement } from 'lit-element';
import { AnypointDialogMixin } from './mixins/AnypointDialogMixin';

export default class AnypointDialogElement extends AnypointDialogMixin(LitElement) {
  /** 
   * Enables Anypoint theme.
   * @attribute
   */
  anypoint: boolean;

  render(): TemplateResult;
}
