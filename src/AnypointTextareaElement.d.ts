import { TemplateResult, LitElement, CSSResult } from 'lit-element';
import { AnypointInputMixin } from './AnypointInputMixin';

export default class AnypointTextareaElement extends AnypointInputMixin(LitElement) {
  get styles(): CSSResult | CSSResult[];
  get _labelClass(): string;
  get _infoAddonClass(): string;
  get _errorAddonClass(): string;
  /**
   * Binds this to the `<textarea>`'s `cols` property.
   */
  cols: number | undefined;
  /**
   * Binds this to the `<textarea>`'s `rows` property.
   */
  rows: number | undefined;
  /**
   * Binds this to the `<textarea>`'s `wrap` property.
   */
  wrap: boolean | undefined;
  render(): TemplateResult;
}
