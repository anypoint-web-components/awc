/**
 * @param {EventTarget} element 
 * @param {string} code 
 */
export function keyDown(element, code) {
  const e = new KeyboardEvent('keydown', {
    bubbles: true,
    composed: true,
    code,
  });
  element.dispatchEvent(e);
}

/**
 * @param {EventTarget} element 
 * @param {string} code 
 */
export function keyUp(element, code) {
  const e = new KeyboardEvent('keyup', {
    bubbles: true,
    composed: true,
    code,
  });
  element.dispatchEvent(e);
}

/**
 * @param {EventTarget} element 
 * @param {string} code 
 */
export async function keyDownUp(element, code) {
  return new Promise((resolve) => {
    keyDown(element, code);
    setTimeout(() => {
      keyUp(element, code);
      resolve();
    });
  });
}
