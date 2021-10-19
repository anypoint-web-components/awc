# events-target-mixin

A Mixin that support event targets retargeting so the element listens on a set node instead of the default `window` object.

## Usage

### In a web component

```javascript
import { EventsTargetMixin } '@anypoint-web-components/awc';

class SampleElement extends EventsTargetMixin(HTMLElement) {
  _attachListeners(node) {
    node.addEventListener('my-event', this._testEventHandler);
  }

  _detachListeners(node) {
    node.removeEventListener('my-event', this._testEventHandler);
  }

  _testEventHandler() {

  }
}
customElements.define('sample-element', SampleElement);
```

```html
<sample-element id="example"></sample-element>
<div id="target"></div>
<script>
example.eventsTarget = target;
</script>
```

The element listens for events that bubbles through #target element.

### In a class that does not extend HTMLElement interface

When constructing the object call the `_eventsTargetChanged()` method with
an object that is the default events target. If argument is not set then `window`
is used instead.

```javascript
import { EventsTargetMixin } '@anypoint-web-components/awc';

class EventableObject extends EventsTargetMixin(Object) {
  constructor() {
    super();
    this._eventsTargetChanged();
  }
}
```

Because such class has no lifecycle methods, you should call `detachedCallback()`
manually when the instance should no longer listen on the target object. Skipping
this part may cause the GC to not clean the instance from memory.
