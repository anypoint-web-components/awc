import { html, css, CSSResult, TemplateResult, PropertyValueMap } from 'lit';
import { property } from 'lit/decorators.js';
import AnypointInputElement from './input/AnypointInputElement.js';
import '../define/anypoint-autocomplete.js';
import { Suggestion } from '../types';

/**
 * `anypoint-combobox`
 */
export default class AnypointComboboxElement extends AnypointInputElement {
  static get styles(): CSSResult[] {
    return [
      ...AnypointInputElement.styles,
      css`
      .ac-wrapper {
        position: relative;
        height: inherit;
      }
      `
    ];
  }

  /**
   * List of suggestions to render.
   * If the array items are strings they will be used for display a suggestions and
   * to insert a value.
   * If the list is an object the each object must contain `value` and `display`
   * properties.
   * The `display` property will be used in the suggestions list and the
   * `value` property will be used to insert the value to the referenced text field.
   */
  @property({ type: Array }) source?: Suggestion[] | string[];

  protected firstUpdated(cp: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    setTimeout(() => {
      // this is required for autocomplete to set up the
      // target as `inputElement` is computed getter.
      this.requestUpdate();
    }, 0);
    super.firstUpdated(cp);
  }

  render(): TemplateResult {
    return html`
    <div class="ac-wrapper">
      ${super.render()}
      <anypoint-autocomplete
        .target="${this.inputElement as HTMLInputElement}"
        .source="${this.source}"
        .anypoint="${this.anypoint}"
        noTargetControls
        openOnFocus
        noOverlap
      ></anypoint-autocomplete>
    </div>
    `;
  }
}
