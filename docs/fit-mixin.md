# FitMixin

This mixin is a port of [iron-fit-behavior](https://github.com/PolymerElements/iron-fit-behavior) that works with LitElement.

`FitMixin` fits an element in another element using `max-height` and `max-width`, and optionally centers it in the window or another element. The element will only be sized and/or positioned if it has not already been sized and/or positioned by CSS.

|CSS properties|Action|
|----------------------|---------------------------------------------------|
|`position` set|Element is not centered horizontally or vertically|
|`top` or `bottom` set|Element is not vertically centered|
|`left` or `right` set|Element is not horizontally centered|
|`max-height` set|Element respects `max-height`|
|`max-width` set|Element respects `max-width`|

`FitMixin` can position an element into another element using `verticalAlign` and `horizontalAlign`. This will override the element's css position.

```html
<div class="container">
  <arc-fit-impl verticalalign="top" horizontalalign="auto">
    Positioned into the container
  </arc-fit-impl>
</div>
```

Use `noOverlap` to position the element around another element without overlapping it.

```html
<div class="container">
  <arc-fit-impl nooverlap verticalalign="auto" horizontalalign="auto">
    Positioned around the container
  </arc-fit-impl>
</div>
```

Use `horizontalOffset, verticalOffset` to offset the element from its
`positionTarget`; `FitMixin` will collapse these in order to
keep the element within `fitInto` boundaries, while preserving the element's
CSS margin values.

```html
<div class="container">
  <arc-fit-impl verticalalign="top" verticaloffset="20">
    With vertical offset
  </arc-fit-impl>
</div>
```

## Deprecation notice

The following attributes are supported for compatibility with older and Polymer elements but eventually will be removed and replaced wit  the corresponding new attribute.

- `sizing-target` > `sizingtarget`
- `fit-into` > `fitinto`
- `no-overlap` > `nooverlap`
- `position-target` > `positiontarget`
- `horizontal-align` > `horizontalalign`
- `vertical-align` > `verticalalign`
- `dynamic-align` > `dynamicalign`
- `horizontal-offset` > `horizontaloffset`
- `vertical-offset` > `verticaloffset`
- `auto-fit-on-attach` > `autofitonattach`

## Usage

```javascript
import { LitElement } from 'lit-element';
import { FitMixin } from '@advanced-rest-client/awc';

class ArcFitImpl extends FitMixin(LitElement) {
  static get properties() {
    return {
      myProp: { type: Object, attribute: 'my-prop' },
    };
  }
}
```
