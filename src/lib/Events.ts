/**
 * Retargets an event
 * @param event The original event
 * @param target The target to dispatch the retargetted event to.
 */
export function retarget(event: Event, target: EventTarget): void {
  const custom = event as CustomEvent;
  let e: Event;
  if (custom.detail) {
    e = new CustomEvent(event.type, {
      detail: custom.detail,
    });
  } else {
    e = new Event(event.type);
  }
  target.dispatchEvent(e);
}

export function retargetHandler(event: Event): void {
  // @ts-ignore
  retarget(event, this as HTMLElement);
}
