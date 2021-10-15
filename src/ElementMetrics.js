import { distance } from './Utility.js';

/** @typedef {import('./MaterialRippleElement').default} MaterialRippleElement */

export class ElementMetrics {
  get boundingRect() {
    return this.element.getBoundingClientRect();
  }

  /**
   * @param {MaterialRippleElement} element
   */
  constructor(element) {
    this.element = element;
    this.width = this.boundingRect.width;
    this.height = this.boundingRect.height;

    this.size = Math.max(this.width, this.height);
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {number} 
   */
  furthestCornerDistanceFrom(x, y) {
    const topLeft = distance(x, y, 0, 0);
    const topRight = distance(x, y, this.width, 0);
    const bottomLeft = distance(x, y, 0, this.height);
    const bottomRight = distance(x, y, this.width, this.height);

    return Math.max(topLeft, topRight, bottomLeft, bottomRight);
  }
}
