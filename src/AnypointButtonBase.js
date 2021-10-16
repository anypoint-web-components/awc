import { LitElement } from 'lit-element';
import { ControlStateMixin } from './mixins/ControlStateMixin.js';
import { ButtonStateMixin } from './mixins/ButtonStateMixin.js';
import '../material-ripple.js';

/**
 * A base class for Anypoint buttons.
 * Use this class to create buttons that can be elevated (Material Design) and has
 * compatibility layer with the Anypoint platform.
 */
export class AnypointButtonBase extends ControlStateMixin(ButtonStateMixin(LitElement)) {
  static get properties() {
    return {
      /**
       * The z-depth of this element, from 0-5. Setting to 0 will remove the
       * shadow, and each increasing number greater than 0 will be "deeper"
       * than the last.
       * This is for MD implementation.
       */
      elevation: { type: Number, reflect: true },
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
      emphasis: { type: String, reflect: true },
      /**
       * When set ripple effect is not rendered.
       */
      noink: { type: Boolean, reflect: true },
      /**
       * @deprecated Use `compatibility` instead
       */
      legacy: { type: Boolean },
      /**
       * Enables compatibility with Anypoint components.
       */
      compatibility: { type: Boolean, reflect: true },
    };
  }

  get legacy() {
    return this.compatibility;
  }

  set legacy(value) {
    this.compatibility = value;
  }

  get emphasis() {
    return this._emphasis;
  }

  set emphasis(value) {
    const old = this._emphasis;
    if (old === value) {
      return;
    }
    this._emphasis = value;
    this._calculateElevation();
    this.requestUpdate('emphasis', old);
  }

  get toggles() {
    return this._toggles;
  }

  set toggles(value) {
    const old = this._toggles;
    if (old === value) {
      return;
    }
    this._toggles = value;
    this._calculateElevation();
    this.requestUpdate('toggles', old);
  }

  get compatibility() {
    return this._compatibility;
  }

  set compatibility(value) {
    const old = this._compatibility;
    if (old === value) {
      return;
    }
    this._compatibility = value;
    this._calculateElevation();
    this.requestUpdate('compatibility', old);
  }

  constructor() {
    super();
    this.emphasis = 'low';
  }

  /**
   * Computes current elevation for the material design.
   * The `emphasis` property is set when the updates are committed.
   * @returns {Promise<void>}
   */
  async _calculateElevation() {
    let e = 0;
    if (this.emphasis === 'high' && !this.compatibility) {
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

  _controlStateChanged() {
    super._controlStateChanged();
    this._calculateElevation();
  }

  _buttonStateChanged() {
    this._calculateElevation();
  }

  /**
   * Redirects the `transitionend` from the `material-ripple` element.
   * This is the only way to perform an action when the animation ends instead of counting on `click`.
   * Note, when compatibility is enabled this event is not dispatched.
   * 
   * @param {TransitionEvent} e 
   */
  _transitionEndHandler(e) {
    const { propertyName } = e;
    if (propertyName !== undefined) {
      // the material-ripple dispatches `transitionend` as a custom event
      // which has no propertyName on it.
      return;
    }
    this.dispatchEvent(new Event('transitionend'));
  }
}
