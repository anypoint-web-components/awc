import { TemplateResult } from 'lit-element';
import {default as MaterialRippleElement} from './MaterialRippleElement';
import {AnypointButtonBase} from './AnypointButtonBase.js';

/**
 * Material design and Anypoint styled icon button
 * @fires transitionend Above the standard HTML behavior, it is dispatched when ripple finish animation.
 */
export default class AnypointIconButtonElement extends AnypointButtonBase {
  /**
   * A reference to the MaterialRippleElement in the local DOM.
   */
  get _ripple(): MaterialRippleElement;
  constructor();
  render(): TemplateResult;
  connectedCallback(): void;
  _spaceKeyDownHandler(e: KeyboardEvent): void;
  _spaceKeyUpHandler(e: KeyboardEvent): void;
  _buttonStateChanged(): void;
  _keyDownHandler(e: KeyboardEvent): void;
  _keyUpHandler(e: KeyboardEvent): void;
  _enterDownHandler(): void;
  _enterUpHandler(): void;
}
