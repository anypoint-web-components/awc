import { LitElement, TemplateResult } from 'lit-element';

/**
 * `arc-overlay-backdrop` is a backdrop used by `OverlayMixin`. It
 * should be a singleton.
 *
 * Originally designed by the Polymer team, ported to LitElement by ARC team.
 *
 * ### Styling
 *
 * The following custom properties and mixins are available for styling.
 *
 * Custom property | Description | Default
 * -------------------------------------------|------------------------|---------
 * `--iron-overlay-backdrop-background-color` | Backdrop background color | #000
 * `--iron-overlay-backdrop-opacity`          | Backdrop opacity | 0.6
 * `--iron-overlay-backdrop`                  | Mixin applied to `iron-overlay-backdrop`.                      | {}
 * `--iron-overlay-backdrop-opened`           | Mixin applied to `iron-overlay-backdrop` when it is displayed | {}
 */
export default class OverlayBackdropElement extends LitElement {
  /**
   * Whether the backdrop is opened
   * @attribute
   */
  opened: boolean;
  constructor();
  connectedCallback(): void;
  disconnectedCallback(): void;
  render(): TemplateResult;

  /**
   * Appends the backdrop to document body if needed.
   */
  prepare(): void;

  /**
   * Shows the backdrop.
   */
  open(): void;

  /**
   * Hides the backdrop.
   */
  close(): void;

  /**
   * Removes the backdrop from document body if needed.
   */
  complete(): void;
  _onTransitionend(e: CustomEvent): void;

  /**
   * Toggles class on this element.
   *
   * @param klass CSS class name to toggle
   * @param condition Boolean condition to test whether the class should be
   * added or removed.
   */
  toggleClass(klass: string, condition: boolean): void;
}
