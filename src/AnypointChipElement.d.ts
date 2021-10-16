import { LitElement, SVGTemplateResult, TemplateResult, CSSResult } from 'lit-element';

export declare const hasIconNodeValue: unique symbol;
/**
 * `anypoint-chip`
 *
 * A compact material design element that represent and input, attribute, or action.
 *
 * A chip contains a label and optionally an icon and remove icon.
 *
 * Remove icon is predefined. However icon can be any HTML element with
 * `slot="icon"` attribute. Per material design guidelines the icon is rounded.
 *
 * ## Example
 *
 * ```html
 * <anypoint-chip removable>
 *  <img src="..." slot="icon"/>
 *  Biking
 * </anypoint-chip>
 * ```
 *
 * The "Biking" is the label rendered next to the icon. The chip also renders
 * built-in remove icon. Clicking on the icon dispatches `chipremoved`
 * custom event only. It does not remove the chip from the document as the
 * application logic might use different ways of removing elements from dom
 * than web platform APIs.
 * 
 * @fires chipremoved
 */
export default class AnypointChipElement extends LitElement {
  styles: CSSResult;

  /**
   * If set the chip can be removed.
   * The element does not remove itself from the DOM. It rather dispatch
   * `chipremoved` custom event to inform parent element about the action.
   * 
   * @attribute
   */
  removable: boolean;

  /**
   * If true, the user cannot interact with this element.
   * @attribute
   */
  disabled: boolean;

  /**
   * If true, the button toggles the active state with each click or press
   * of the space bar or enter.
   * @attribute
   */
  toggles: boolean;

  /**
   * Enables Anypoint theme.
   * @attribute
   */
  anypoint: boolean;

  /**
   * True if the button is currently in active state. Only
   * available if the button `toggles`.
   */
  readonly active: boolean;
  _active: boolean;

  /**
   * True if the button is currently in focused state.
   */
  readonly focused: boolean;
  _focused: boolean;
  
  /**
   * An icon to be used to render "remove" icon.
   * It must be an instance of `SVGTemplateResult` that can be created from `lit-html`
   * library.
   *
   * ```javascript
   * import { svg } from 'lit-html';
   * const icon = svg`...`; // content of the icon.
   * ```
   * 
   * @default ARC's `clear` icon.
   */
  removeIcon: SVGTemplateResult;

  readonly _iconSlot: HTMLSlotElement;

  [hasIconNodeValue]: boolean;
  __firstUpdated: boolean;
  
  constructor();
  connectedCallback(): void;
  disconnectedCallback(): void;
  firstUpdated(changedProperties: Map<string | number | symbol, unknown>): void;
  
  /**
   * Adds the `slotchange` event listener to the icon slot.
   */
  _addSlotEvent(): void;

  /**
   * Handler for remove icon click event.
   * Cancels the event and calls `remove()`
   */
  _removeHandler(e: PointerEvent): void;

  /**
   * Dispatches `chip-remove` custom event to inform application
   * that the user requested to remove the item.
   *
   * Note, this does not check if `removable` is set.
   */
  remove(): void;

  /**
   * According to material design spec, when there's no icon the
   * left hand side padding should be 12dp. Slotted styling API does now
   * allow to detect when there's no content so it has to be done using
   * node observer.
   */
  _detectHasIcon(): void;

  /**
   * Computes class name for the container.
   *
   * @param hasIconNode True if the element has an icon in the light DOM.
   * @param removable True if the element can be removed.
   * @returns Class name.
   */
  _computeContainerClass(hasIconNode: boolean, removable: boolean): string;

  /**
   * Handler for key down when element is focused.
   * Removes the item when delete key is pressed.
   */
  _keyDownHandler(e: KeyboardEvent): void;

  /**
   * Sets state of the `focused` property depending on the event handled by this
   * listener.
   *
   * @param e Either focus or blur events
   */
  _focusBlurHandler(e: Event): void;

  /**
   * Called when the value of `disabled` property change. Sets `aria-disabled`
   * and `tabIndex` attributes.
   *
   * @param disabled Current value of `disabled` property.
   */
  _disabledChanged(disabled: boolean): void;

  /**
   * Handles click event (as well as Space and Enter key down) as sets the
   * `active` property.
   */
  _clickHandler(): void;

  /**
   * Sets `_active` property depending on the input and current state of `_active`.
   *
   * @param active The value to set.
   */
  _userActivate(active: boolean): void;

  /**
   * Calls `click()` function on this element so event listeners can handle
   * the action.
   */
  _asyncClick(): void;

  /**
   * Called when the `active` value change.
   * It sets `active` attribute and, if the button toggles, `aria-pressed` attribute.
   * @param active Current state of `active`./
   */
  __activeChanged(active: boolean): void;

  _iconSlotTemplate(): TemplateResult;
  _removeTemplate(): TemplateResult;
  render(): TemplateResult;
}
