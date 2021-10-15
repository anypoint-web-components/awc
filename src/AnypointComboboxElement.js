import { html, css } from 'lit-element';
import AnypointInputElement from './AnypointInputElement.js';
import '../anypoint-autocomplete.js';

/**
 * `anypoint-combobox`
 */
export default class AnypointComboboxElement extends AnypointInputElement {
  // @ts-ignore
  get styles() {
    return [
      super.styles,
      css`
      .ac-wrapper {
        position: relative;
        height: inherit;
      }
      `
    ];
  }

  static get properties() {
    return {
      /**
       * List of suggestions to render.
       * If the array items are strings they will be used for display a suggestions and
       * to insert a value.
       * If the list is an object the each object must contain `value` and `display`
       * properties.
       * The `display` property will be used in the suggestions list and the
       * `value` property will be used to insert the value to the referenced text field.
       */
      source: { type: Array }
    };
  }

  constructor() {
    super();
    this.source = undefined;
  }

  firstUpdated(arg) {
    super.firstUpdated(arg);
    // this is required for autocomplete to set up the
    // target as `inputElement` is computed getter.
    this.requestUpdate();
  }

  render() {
    return html`
    <style>${this.styles}</style>
    <div class="ac-wrapper">
      ${super.render()}
      <anypoint-autocomplete
        .target="${this}"
        .source="${this.source}"
        .compatibility="${this.compatibility}"
        noTargetControls
        openOnFocus
      ></anypoint-autocomplete>
    </div>
    `;
  }
}
