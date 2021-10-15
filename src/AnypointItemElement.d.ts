import { TemplateResult, LitElement } from 'lit-element';
import { ButtonStateMixin } from './ButtonStateMixin';
import { ControlStateMixin } from './ControlStateMixin';
import { HoverableMixin } from './HoverableMixin';

/**
 * `anypoint-item`
 * An Anypoint list item.
 */
export default class AnypointItemElement extends HoverableMixin(ControlStateMixin(ButtonStateMixin(LitElement))) {
  /**
   * @deprecated Use `compatibility` instead.
   */
  legacy: boolean;

  /**
   * Enables compatibility with Anypoint components.
   * @attribute
   */
  compatibility: boolean;
  render(): TemplateResult;
  connectedCallback(): void;
}
