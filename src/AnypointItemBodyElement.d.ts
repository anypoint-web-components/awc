import { TemplateResult, LitElement } from 'lit-element';

/**
 * `anypoint-item`
 * An Anypoint list item with 2 or 3 lines.
 */
export default class AnypointItemBodyElement extends LitElement {
  /**
   * @deprecated Use `compatibility` instead.
   */
  legacy: boolean;

  /**
   * Enables compatibility with Anypoint components.
   * @attribute
   */
  compatibility: boolean;
  /**
   * Renders the item in a 2-line layout
   * @attribute
   */
  twoLine: boolean;
  /**
   * Renders the item in a 3-line layout
   * @attribute
   */
  threeLine: boolean;
  constructor();
  render(): TemplateResult;
}
