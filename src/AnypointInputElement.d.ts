import { TemplateResult, LitElement } from 'lit-element';
import { AnypointInputMixin } from './AnypointInputMixin';

/**
 * @fires search When the type is `search` and the search term change.
 */
export default class AnypointInputElement extends AnypointInputMixin(LitElement) {
  get _prefixed(): HTMLSlotElement | null;
  get _labelClass(): string;
  get _infoAddonClass(): string;
  get _errorAddonClass(): string;
  get _inputType(): string;
  get bindValue(): string;
  /**
   * Re-targets an event that does not bubble
   *
   * @param e The event to retarget
   */
  _retargetEvent(e: Event): void;
  render(): TemplateResult;
  _suffixTemplate(): TemplateResult;
  _prefixTemplate(): TemplateResult;
  _assistiveTemplate(): TemplateResult;
  _labelTemplate(): TemplateResult;
  _inputTemplate(): TemplateResult;
}
