import { TemplateResult, LitElement } from 'lit-element';

export declare const colorValue: unique symbol;
export declare const colorTriggerHandler: unique symbol;
export declare const inputHandler: unique symbol;

export default class ColorSelectorElement extends LitElement {
  /**
   * A color to be picked.
   * @attribute
   */
  value: string;

  get [colorValue](): string;

  constructor();

  connectedCallback(): void;

  disconnectedCallback(): void;

  /**
   * Triggers the native color picker.
   */
  [colorTriggerHandler](): void;

  [inputHandler](e: Event): void;

  render(): TemplateResult;
}
