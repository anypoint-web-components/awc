
# ResizableMixin

This mixin is a port of [iron-resizable-behavior](https://github.com/PolymerElements/iron-resizable-behavior) that works with any JavaScript class.

`ResizableMixin` is a mixin that can be used in web components to coordinate the flow of resize events between "resizers" (elements that control the size or hidden state of their children) and "resizables" (elements that need to be notified when they are resized or un-hidden by their parents in order to take action on their new measurements).

Elements that perform measurement should add the `ResizableMixin` mixin to their element definition and listen for the `resize` event on themselves. This event will be fired when they become showing after having been hidden, when they are resized explicitly by another resizable, or when the window has been resized.

Note, the `resize` event is non-bubbling.

## Usage

```javascript
import { LitElement } from 'lit-element';
import { ResizableMixin } from '@advanced-rest-client/awc';

class ResizableImpl extends ResizableMixin(LitElement) {

}
```
