/**
 * A web component written in plain JavaScript to render a 5 star rating.
 *
 * By default it is an interactive element where the user can change the selection.
 * Add `readonly` attribute/JS property to disable this behavior.
 *
 * ## Example
 *
 * ```html
 * <star-rating value="3"></star-rating>
 * ```
 * ### Styling
 *
 * `<exchange-search-list-item>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--star-rating-width` | Icon width | `24px`
 * `--star-rating-height` | Icon width | `24px`
 * `--star-rating-unselected-color` | Icon color when not selected | `#eeeeee`
 * `--star-rating-selected-color` | Icon color when selected | `#fdd835`
 * `--star-rating-active-color` | Icon color when active (focus, hover) | `#e0be25`
 * 
 * @fires change When the value is set by the user.
 */
export default class StarRatingElement extends HTMLElement {
  /**
   * @attribute
   */
  value: number|string;
  /**
   * @attribute
   */
  readOnly?: boolean;
  __data__: any;
  __rendering?: boolean;
  onchange: EventListener;
  connectedCallback(): void;
  disconnectedCallback(): void;
  attributeChangedCallback(name: any, oldValue: any, newValue: any): void;
  _render(): void;
  _doRender(): void;
  _ensureStars(): void;
  _createStar(): any;
  _clickHandler(e: any): void;
  _keydownHandler(e: any): void;
  _selectionFromEvent(e: any): void;
  _svgFromEvent(e: any): any;
  _notifyValueChanged(value: any): void;
}
