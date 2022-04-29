/**
 * Tests whether user input from the keyboard is a printable character.
 * 
 * @param event The original KeyboardEvent.
 * @returns True when the key is printable.
 */
export function isPrintable(event: KeyboardEvent): boolean {
  const ignoredCodes = [
    'Backspace',
    'Tab',
    'Enter',
    'Space',
    'Escape',
    'NumpadEnter',
    'CapsLock',
    'Insert',
    'Delete',
    'NumLock',
    'ContextMenu',
    'ScrollLock',
    'ArrowUp',
    'ArrowDown',
    'ArrowRight',
    'ArrowLeft',
    'PageUp',
    'PageDown',
    'Home',
    'End',
    'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F8', 'F10', 'F11', 'F12',
    'Pause',
    'Break',
    'ControlRight',
    'ControlLeft',
  ];
  return !ignoredCodes.includes(event.code);
}
