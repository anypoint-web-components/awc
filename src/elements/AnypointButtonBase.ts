import { property } from 'lit/decorators.js';
import AnypointElement from './AnypointElement.js';
import { ControlStateMixin } from '../mixins/ControlStateMixin.js';
import { ButtonStateMixin } from '../mixins/ButtonStateMixin.js';
import '../../define/material-ripple.js';

export type EmphasisValue = 'low'|'medium'|'high';

/**
 * A base class for Anypoint buttons.
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

  // /** 
  //  * In some cases, this support auto focus on the button.
  //  */
  // @property({ type: Boolean, reflect: true })
  // autofocus?: boolean;
  
  private _emphasis?: EmphasisValue = 'low';

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
  @property({ type: String, reflect: true })
  get emphasis(): EmphasisValue | undefined {
    return this._emphasis;
  }

  set emphasis(value: EmphasisValue | undefined) {
    const old = this._emphasis;
    if (old === value) {
      return;
    }
    this._emphasis = value;
    this._calculateElevation();
    this.requestUpdate('emphasis', old);
  }

  _toggles?: boolean;

  get toggles(): boolean | undefined {
    return this._toggles;
  }

  set toggles(value: boolean | undefined) {
    const old = this._toggles;
    if (old === value) {
      return;
    }
    this._toggles = value;
    this._calculateElevation();
    this.requestUpdate('toggles', old);
  }

  constructor() {
    super();
    this.requestUpdate('emphasis', '');
    this._calculateElevation();
  }

  /**
   * Computes current elevation for the material design.
   * The `emphasis` property is set when the updates are committed.
   */
  async _calculateElevation(): Promise<void> {
    let e = 0;
    if (this.emphasis === 'high' && !this.anypoint) {
      if (this.toggles && this.active) {
        e = 2;
      } else if (this.pressed) {
        e = 3;
      } else {
        e = 1;
      }
    }
    await this.updateComplete;
    this.elevation = e;
  }

  _changedControlState(): void {
    super._changedControlState();
    this._calculateElevation();
  }

  _buttonStateChanged(): void {
    this._calculateElevation();
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

  protected anypointChanged(): void {
    this._calculateElevation();
  }
}
