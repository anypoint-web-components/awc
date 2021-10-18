# ScrollTargetMixin

This mixin is a port of [iron-overlay-behavior](https://github.com/PolymerElements/iron-overlay-behavior)
that works with LitElement.

`ScrollTargetMixin` allows an element to respond to scroll events from a designated scroll target.

Elements that consume this mixin can override the `_scrollHandler`
method to add logic on the scroll event.

## Usage

```javascript
import { LitElement } from 'lit-element';
import { ScrollTargetMixin } from '@anypoint-web-components/awc';

class ArcScrollTargetImpl extends ScrollTargetMixin(LitElement) {
  static get properties() {
    const top = super.properties || {};
    const props = {
      myProp: { type: String }
    }
    return Object.assign({}, top, props);
  }

  _scrollHandler(e) {
    ...
  }
}
```

Note, You need to include properties from the mixin manually as simple class
extension overrides `properties`.
