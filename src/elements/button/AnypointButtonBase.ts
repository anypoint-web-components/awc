import { PropertyValueMap } from 'lit';
import { property } from 'lit/decorators.js';
import '../../define/material-ripple.js';
import ButtonElement from './ButtonElement.js';

export type EmphasisValue = 'low'|'medium'|'high';

/**
 * A base class for Anypoint buttons.
 */
export class AnypointButtonBase extends ButtonElement {
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
   */
  @property({ type: String, reflect: true }) emphasis: EmphasisValue = 'low';

  protected willUpdate(cp: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    super.willUpdate(cp);
    if (cp.has('emphasis') || cp.has('active') || cp.has('toggles') || cp.has('flat') || cp.has('anypoint') || cp.has('_pressed')) {
      this._calculateElevation();
    }
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
