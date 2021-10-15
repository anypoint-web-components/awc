/**
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number}
 */
export function distance(x1, y1, x2, y2) {
  const xDelta = (x1 - x2);
  const yDelta = (y1 - y2);
  return Math.sqrt(xDelta * xDelta + yDelta * yDelta);
}

/** 
 * @type {() => number}
 */
export const now = window.performance && window.performance.now ? window.performance.now.bind(window.performance) : Date.now;

/**
 * Tests if given node is a radio button.
 * @param {Node} node A node to test
 * @return {boolean} True if the node has "radio" role or is a button with
 * "radio" type.
 */
export function isRadioButton(node) {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }
  const typedElement = /** @type HTMLElement */ (node);
  if (typedElement.getAttribute('role') === 'radio') {
    return true;
  }
  const typedInput = /** @type HTMLInputElement */ (typedElement);
  if (typedInput.localName === 'input' && typedInput.type === 'radio') {
    return true;
  }
  return false;
}
