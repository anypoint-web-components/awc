import Element from '../elements/StarRatingElement.js';

window.customElements.define('star-rating', Element);

declare global {
  interface HTMLElementTagNameMap {
    "star-rating": Element;
  }
}
