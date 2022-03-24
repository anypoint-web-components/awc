export function distance(x1: number, y1: number, x2: number, y2: number): number {
  const xDelta = (x1 - x2);
  const yDelta = (y1 - y2);
  return Math.sqrt(xDelta * xDelta + yDelta * yDelta);
}

export const now: () => number = window.performance && window.performance.now ? window.performance.now.bind(window.performance) : Date.now;

/**
 * Tests if given node is a radio button.
 * @param node A node to test
 * @returns True if the node has "radio" role or is a button with "radio" type.
 */
export function isRadioButton(node: Node): boolean {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }
  const typedElement = node as HTMLElement;
  if (typedElement.getAttribute('role') === 'radio') {
    return true;
  }
  const typedInput = typedElement as HTMLInputElement;
  if (typedInput.localName === 'input' && typedInput.type === 'radio') {
    return true;
  }
  return false;
}
