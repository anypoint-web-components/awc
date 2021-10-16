import { LitElement } from 'lit-element';
import { ButtonStateMixin, ControlStateMixin } from '../';

export declare type EmphasisValue = 'low'|'medium'|'high';

/**
 * A base class for Anypoint buttons.
 */
export declare class AnypointButtonBase  extends ControlStateMixin(ButtonStateMixin(LitElement)) {
  /**
   * The z-depth of this element, from 0-5. Setting to 0 will remove the
   * shadow, and each increasing number greater than 0 will be "deeper"
   * than the last.
   * This is for MD implementation.
   * 
   * @attribute
   */
  elevation?: boolean;
  /**
   * Button emphasis in the UI.
   *
   * Possible values:
   * - `low` - Text buttons are typically used for less important actions.
   * - `medium` - Outlined buttons are used for more emphasis than text buttons due to the stroke.
   * - `high` - Contained buttons have more emphasis, as they use use a color fill and shadow.
   *
   * Default is "low".
   * 
   * @attribute
   */
  emphasis?: EmphasisValue;
  /**
   * When set ripple effect is not rendered.
   * @attribute
   */
  noink?: boolean;
  /**
   * Enables Anypoint theme.
   * @attribute
   */
  anypoint: boolean;
  constructor();

  /**
   * Computes current elevation for the material design.
   * The `emphasis` property is set when the updates are committed.
   */
  _calculateElevation(): Promise<void>;
  _controlStateChanged(): void;
  _buttonStateChanged(): void;
  /**
   * Redirects the `transitionend` from the `material-ripple` element.
   * This is the only way to perform an action when the animation ends instead of counting on `click`.
   * Note, when anypoint is enabled this event is not dispatched.
   */
  _transitionEndHandler(e: TransitionEvent): void;
}
