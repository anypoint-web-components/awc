export function demoProperty() {
  return (protoOrDescriptor: any, name: PropertyKey): any => {
    Object.defineProperty(protoOrDescriptor, name, {
      get() {
        const key = `_${name.toString()}`;
        return this[key];
      },
      set(newValue) {
        const key = `_${name.toString()}`;
        if (this[key] === newValue) {
          return;
        }
        this[key] = newValue;
        this.render();
      },
      enumerable: true,
      configurable: true,
    });
  };
}
