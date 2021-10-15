import { TemplateResult } from 'lit-element';
import { MaterialRippleElement } from '../';
import { AnypointButtonBase } from './AnypointButtonBase.js';

/**
 * Material design and Anypoint styled button.
 * @fires transitionend Above the standard HTML behavior, it is dispatched when ripple finish animation.
 */
export default class AnypointButtonElement extends AnypointButtonBase {
  /**
   * A reference to the MaterialRippleElement in the local DOM.
   */
  get _ripple(): MaterialRippleElement;
  constructor();
  render(): TemplateResult;
  connectedCallback(): void;
  _spaceKeyDownHandler(e: KeyboardEvent): void;
  _spaceKeyUpHandler(e: KeyboardEvent): void;
}
