import { distance } from './Utility.js';
// eslint-disable-next-line import/no-cycle
import MaterialRippleElement from '../elements/MaterialRippleElement.js';

export class ElementMetrics {
  get boundingRect(): DOMRect {
    return this.element.getBoundingClientRect();
  }

  element: MaterialRippleElement;

  width: number;

  height: number;

  size: number;

  constructor(element: MaterialRippleElement) {
    this.element = element;
    this.width = this.boundingRect.width;
    this.height = this.boundingRect.height;

    this.size = Math.max(this.width, this.height);
  }

  furthestCornerDistanceFrom(x: number, y: number): number {
    const topLeft = distance(x, y, 0, 0);
    const topRight = distance(x, y, this.width, 0);
    const bottomLeft = distance(x, y, 0, this.height);
    const bottomRight = distance(x, y, this.width, this.height);

    return Math.max(topLeft, topRight, bottomLeft, bottomRight);
  }
}
