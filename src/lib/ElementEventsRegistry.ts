type EventRecords = Record<string, EventListener>;
// eslint-disable-next-line no-undef
const eventsMap = new WeakMap<EventTarget, EventRecords>();

export function addListener(eventType: string, value: EventListener | null, target: EventTarget): void {
  let events = eventsMap.get(target);
  if (!events) {
    events = {};
    eventsMap.set(target, events);
  }
  if (events[eventType]) {
    target.removeEventListener(eventType, events[eventType]);
    delete events[eventType];
  }
  if (typeof value !== 'function') {
    return;
  }
  events[eventType] = value;
  target.addEventListener(eventType, value);
}

export function getListener(eventType: string, target: EventTarget): EventListener | null {
  const events = eventsMap.get(target);
  if (!events) {
    return null;
  }
  return events[eventType];
}
