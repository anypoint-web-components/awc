import { TemplateResult, LitElement } from 'lit-element';
import { ButtonStateMixin } from './mixins/ButtonStateMixin';
import { ControlStateMixin } from './mixins/ControlStateMixin';
import { HoverableMixin } from './mixins/HoverableMixin';

/**
 * `anypoint-item`
 * An Anypoint list item.
 */
export default class AnypointItemElement extends HoverableMixin(ControlStateMixin(ButtonStateMixin(LitElement))) {
  /**
   * Enables Anypoint theme.
   * @attribute
   */
  anypoint: boolean;
  render(): TemplateResult;
  connectedCallback(): void;
}
