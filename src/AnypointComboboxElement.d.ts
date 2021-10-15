import { TemplateResult, CSSResult } from 'lit-element';
import AnypointInputElement from './AnypointInputElement';
import { Suggestion } from './types';

/**
 * `anypoint-combobox`
 */
 export default class AnypointComboboxElement extends AnypointInputElement {
  get styles(): CSSResult[];
  /**
   * List of suggestions to display.
   * If the array items are strings they will be used for display a suggestions and
   * to insert a value.
   * If the list is an object the each object must contain `value` and `display`
   * properties.
   * The `display` property will be used in the suggestions list and the
   * `value` property will be used to insert the value to the referenced text field.
   */
  source: Suggestion[] | string[];
  render(): TemplateResult;
  _onActivate(): void;
  firstUpdated(): void;
}
