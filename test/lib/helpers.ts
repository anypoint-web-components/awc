export function keyDown(element: EventTarget, code: string): void {
  const e = new KeyboardEvent('keydown', {
    bubbles: true,
    composed: true,
    code,
  });
  element.dispatchEvent(e);
}

export function keyUp(element: EventTarget, code: string): void {
  const e = new KeyboardEvent('keyup', {
    bubbles: true,
    composed: true,
    code,
  });
  element.dispatchEvent(e);
}

export async function keyDownUp(element: EventTarget, code: string): Promise<void> {
  return new Promise((resolve) => {
    keyDown(element, code);
    setTimeout(() => {
      keyUp(element, code);
      resolve();
    });
  });
}
