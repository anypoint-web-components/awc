import { TemplateResult, LitElement } from 'lit-element';
import { AnypointDialogMixin } from './mixins/AnypointDialogMixin';

export default class AnypointDialogElement extends AnypointDialogMixin(LitElement) {
  /** 
   * Enables compatibility theme for Anypoint
   * @attribute
   */
  compatibility: boolean;

  render(): TemplateResult;
}
