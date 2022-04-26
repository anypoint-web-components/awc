import { PropertyValueMap } from 'lit';
import { property } from 'lit/decorators.js';
import AnypointElement from './AnypointElement.js';
import { ControlStateMixin } from '../mixins/ControlStateMixin.js';
import { ButtonStateMixin } from '../mixins/ButtonStateMixin.js';
import '../define/material-ripple.js';

export type EmphasisValue = 'low'|'medium'|'high';

/**
 * A base class for Anypoint buttons.
 * 
 * @attr {boolean} focused
 * @prop {boolean | undefined} focused
 * 
 * @attr {boolean} disabled
 * @prop {boolean | undefined} disabled
 * 
 * @attr {boolean} toggles
 * @prop {boolean | undefined} toggles
 * 
 * @attr {boolean} active
 * @prop {boolean | undefined} active
 * 
 * @attr {string} ariaActiveAttribute
 * @prop {string | undefined} ariaActiveAttribute
 * 
 * @prop {readonly boolean | undefined} pressed
 * @prop {readonly boolean | undefined} pointerDown
 * @prop {readonly boolean | undefined} receivedFocusFromKeyboard
 * 
 * @attr {boolean} anypoint
 * @prop {boolean | undefined} anypoint
 * 
 * @attr {boolean} outlined
 * @prop {boolean | undefined} outlined
 */
export class AnypointButtonBase extends ControlStateMixin(ButtonStateMixin(AnypointElement)) {
  /**
   * The z-depth of this element, from 0-5. Setting to 0 will remove the
   * shadow, and each increasing number greater than 0 will be "deeper"
   * than the last.
   * This is for MD implementation.
   */
  @property({ type: Number, reflect: true })
  elevation?: number;

  /**
   * When set ripple effect is not rendered.
   */
  @property({ type: Boolean, reflect: true })
  noink?: boolean;

  /**
   * When set it won't elevate the element, even when high emphasis.
   */
  @property({ type: Boolean, reflect: true })
  flat?: boolean;

  /**
   * Button emphasis in the UI.
   *
   * Possible values:
   * - `low` - Text buttons are typically used for less important actions.
   * - `medium` - Outlined buttons are used for more emphasis than text buttons due to the stroke.
   * - `high` - Contained buttons have more emphasis, as they use use a color fill and shadow.
   *
   * Default is "low".
   * @attribute
   */
  @property({ type: String, reflect: true }) emphasis: EmphasisValue = 'low';

  protected updated(cp: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (cp.has('emphasis') || cp.has('active') || cp.has('toggles') || cp.has('flat') || cp.has('anypoint') || cp.has('_pressed')) {
      this._calculateElevation();
    }
    super.updated(cp);
  }

  /**
   * Computes current elevation for the material design.
   * The `emphasis` property is set when the updates are committed.
   */
  _calculateElevation(): void {
    let e = 0;
    if (this.emphasis === 'high' && !this.anypoint && !this.flat) {
      if (this.toggles && this.active) {
        e = 2;
      } else if (this.pressed) {
        e = 3;
      } else {
        e = 1;
      }
    }
    this.elevation = e;
  }

  /**
   * Redirects the `transitionend` from the `material-ripple` element.
   * This is the only way to perform an action when the animation ends instead of counting on `click`.
   * Note, when anypoint is enabled this event is not dispatched.
   */
  _transitionEndHandler(e: TransitionEvent): void {
    const { propertyName } = e;
    if (propertyName !== undefined) {
      // the material-ripple dispatches `transitionend` as a custom event
      // which has no propertyName on it.
      return;
    }
    this.dispatchEvent(new Event('transitionend'));
  }
}
