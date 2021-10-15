import { LitElement, TemplateResult } from 'lit-element';
import { CheckedElementMixin } from './CheckedElementMixin';

/**
 * `anypoint-radio-button`
 *
 * Anypoint styled radio button.
 *
 * ## Usage
 *
 * Install element:
 *
 * ```
 * npm i --save @anypoint-components/anypoint-radio-button
 * ```
 *
 * Import into your app:
 *
 * ```html
 * <script type="module" src="node_modules/@anypoint-components/anypoint-radio-button.js"></script>
 * ```
 *
 * Or into another component
 *
 * ```javascript
 * import '@anypoint-components/anypoint-radio-button.js';
 * ```
 *
 * Use it:
 *
 * ```html
 * <paper-radio-group selectable="anypoint-radio-button">
 *  <anypoint-radio-button name="a">Apple</anypoint-radio-button>
 *  <anypoint-radio-button name="b">Banana</anypoint-radio-button>
 *  <anypoint-radio-button name="c">Orange</anypoint-radio-button>
 * </paper-radio-group>
 * ```
 */
export default class AnypointRadioButtonElement extends CheckedElementMixin(LitElement) {
  onchange: EventListener;

  render(): TemplateResult;
  /**
   * Controls whether this button is in checked state.
   * @attribute
   */
  checked: boolean;
  /**
   * Controls whether this button is in disabled state.
   * @attribute
   */
  disabled: boolean;

  connectedCallback(): void;

  disconnectedCallback(): void;

  _updateCheckedAria(checked?: boolean): void;

  /**
   * Handler for keyboard down event
   */
  _keyDownHandler(e: KeyboardEvent): void;

  /**
   * Handler for pointer click event
   */
  _clickHandler(): void;

  /**
   * Performs a click operation in next macro-task.
   */
  _asyncClick(): void;

  /**
   * Handles `disable` property state change and manages `aria-disabled`
   * and `tabindex` attributes
   */
  _disabledChanged(disabled: boolean): void;
}
