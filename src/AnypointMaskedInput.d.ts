import { TemplateResult, SVGTemplateResult } from 'lit-element';
import AnypointInputElement from './AnypointInputElement';

export default class AnypointMaskedInputElement extends AnypointInputElement {
  get _inputType(): string;
  get _visibilityToggleIcon(): SVGTemplateResult;
  get _visibilityToggleTitle(): string;
  get _visibilityToggleLabel(): string;

  /**
   * When set the input renders the value visible and restores
   * original input type.
   * @attribute
   */
  visible: boolean;

  _suffixTemplate(): TemplateResult;

  /**
   * Toggles `visible` property value.
   */
  toggleVisibility(): void;
}
