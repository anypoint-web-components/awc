import { TemplateResult, LitElement, CSSResult } from 'lit-element';
import AnypointDropdownElement from './AnypointDropdownElement';
import { ControlStateMixin } from './ControlStateMixin';

/**
 * @fires dropdownopen When the dropdown becomes opened
 * @fires dropdownclose When the dropdown becomes closed
 */
export default class AnypointMenuButtonElement extends ControlStateMixin(LitElement) {
  get styles(): CSSResult;

  /**
   * True if the content is currently displayed.
   * @attribute
   */
  opened: boolean;
  /**
   * The orientation against which to align the menu dropdown
   * horizontally relative to the dropdown trigger.
   * @attribute
   */
  horizontalAlign: string;
  /**
   * The orientation against which to align the menu dropdown
   * vertically relative to the dropdown trigger.
   * @attribute
   */
  verticalAlign: string;
  /**
   * If true, the `horizontalAlign` and `verticalAlign` properties will
   * be considered preferences instead of strict requirements when
   * positioning the dropdown and may be changed if doing so reduces
   * the area of the dropdown falling outside of `fitInto`.
   * @attribute
   */
  dynamicAlign: boolean;
  /**
   * A pixel value that will be added to the position calculated for the
   * given `horizontalAlign`. Use a negative value to offset to the
   * left, or a positive value to offset to the right.
   * @attribute
   */
  horizontalOffset: number;
  /**
   * A pixel value that will be added to the position calculated for the
   * given `verticalAlign`. Use a negative value to offset towards the
   * top, or a positive value to offset towards the bottom.
   * @attribute
   */
  verticalOffset: number;
  /**
   * If true, the dropdown will be positioned so that it doesn't overlap
   * the button.
   * @attribute
   */
  noOverlap: boolean;
  /**
   * Set to true to disable animations when opening and closing the
   * dropdown.
   * @attribute
   */
  noAnimations: boolean;
  /**
   * By default, the dropdown will constrain scrolling on the page
   * to itself when opened.
   * Set to true in order to prevent scroll from being constrained
   * to the dropdown when it opens.
   * @attribute
   */
  allowOutsideScroll: boolean;
  /**
   * Whether focus should be restored to the button when the menu closes.
   * @attribute
   */
  restoreFocusOnClose: boolean;
  /**
   * Set to true to disable automatically closing the dropdown after
   * a selection has been made.
   * @attribute
   */
  ignoreSelect: boolean;

  /**
   * Set to true to enable automatically closing the dropdown after an
   * item has been activated, even if the selection did not change.
   * @attribute
   */
  closeOnActivate: boolean;
  /**
   * Enables Anypoint compatibility
   * @attribute
   */
  compatibility: boolean;
  /**
   * This is the element intended to be bound as the focus target
   * for the `iron-dropdown` contained by `paper-menu-button`.
   */
  _dropdownContent: object;

  get dropdown(): AnypointDropdownElement;

  get contentElement(): HTMLElement;

  /**
   * Handler for `select` event
   */
  onselect: EventListener|null;

  constructor();

  connectedCallback(): void;

  disconnectedCallback(): void;

  _openedHandler(e: CustomEvent): void;

  /**
  * Toggles the dropdown content between opened and closed.
  */
  toggle(): void;

  /**
   * Make the dropdown content appear as an overlay positioned relative
   * to the dropdown trigger.
   */
  open(): void;

  /**
   * Hides the dropdown content
   */
  close(): void;

  _activateHandler(): void;

  _selectHandler(): void;

  _disabledChanged(value: boolean): void;

  _openedChanged(opened: boolean): void;

  __overlayCanceledHandler(e: CustomEvent): void;

  render(): TemplateResult;
}

// export declare interface AnypointMenuButton extends ControlStateMixin, LitElement {

// }
