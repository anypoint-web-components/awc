import { TemplateResult, LitElement } from 'lit-element';
import '../color-selector';

export declare const checkedHandler: unique symbol;
export declare const colorHandler: unique symbol;
export declare const toggleHandler: unique symbol;
export declare const keydownHandler: unique symbol;
export declare const notify: unique symbol;
export declare const checkboxTemplate: unique symbol;
export declare const selectorTemplate: unique symbol;
export declare const labelTemplate: unique symbol;

export default class ColorInputSelectorElement extends LitElement {
  /**
   * A color to be picked.
   * @attribute
   */
  value: string;
  /**
   * Whether the color is enabled or not
   * @attribute
   */
  enabled: boolean;

  constructor();

  [notify](): void;

  [checkedHandler](e: CustomEvent): void;

  /**
   * A handler for the color change. Updates color property value.
   */
  [colorHandler](e: CustomEvent): void;

  /**
   * A handler for the label click. Toggles enabled property.
   */
  [toggleHandler](): void;

  [keydownHandler](e: KeyboardEvent): void;

  render(): TemplateResult;

  /**
   * @returns Template for the checkbox element
   */
  [checkboxTemplate](): TemplateResult;

  /**
   * @returns Template for the color selector element
   */
  [selectorTemplate](): TemplateResult;

  /**
   * @returns Template for the label element
   */
  [labelTemplate](): TemplateResult;
}
