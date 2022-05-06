import Element from '../elements/range/StarRatingElement.js';

window.customElements.define('star-rating', Element);

declare global {
  interface HTMLElementTagNameMap {
    "star-rating": Element;
  }
}
