# scroll-threshold

This is a port of [iron-scroll-threshold](https://github.com/PolymerElements/iron-scroll-threshold) that works with LitElement and plain WC.

`scroll-threshold` is a utility element that listens for `scroll` events from a scrollable region and dispatches events to indicate when the scroller has reached a pre-defined limit, specified in pixels from the upper and lower bounds of the scrollable region.
This element may wrap a scrollable region and will listen for `scroll` events bubbling through it from its children. In this case, care should be taken that only one scrollable region with the same orientation as this element is contained within. Alternatively, the `scrollTarget` property can be set/bound to a non-child scrollable region, from which it will listen for events.

Once a threshold has been reached, a `lowerthreshold` or `upperthreshold` event are fired, at which point the user may perform actions such as lazily-loading more data to be displayed. After any work is done, the user must then clear the threshold by calling the `clearTriggers` method on this element, after which it will begin listening again for the scroll position to reach the threshold again assuming the content in the scrollable region has grown. If the user no longer wishes to receive events (e.g. all data has been exhausted), the threshold property in question (e.g. `lowerThreshold`) may be set to a falsy value to disable events and clear the associated triggered property.

## Example

### In a LitElement template

```javascript
import { LitElement, html } from 'lit-element';
import '@anypoint-web-components/awc/scroll-threshold.js';

class SampleElement extends LitElement {
  render() {
    const { items } = this;
    return html`
    <scroll-threshold @lowerthreshold="${this.loadMoreData}">
    ${items.map((item) => html`...`)}
    </scroll-threshold>`;
  }

  async loadMoreData() {
    // loadData() loads some API data from somewhere
    const data = await this.loadData();
    // Assuming `items` contains list of rendered items
    this.items = [...this.items, ...data];
  }
}
customElements.define('sample-element', SampleElement);
```

### Imperative use

```html
<script type="module" src="@anypoint-web-components/awc/scroll-threshold.js"></script>
<scroll-threshold></scroll-threshold>
<section id="list"></section>
<script>
{
  async function loadMore() {
    const data = await loadData();
    const fragment = document.createDocumentFragment();
    data.forEach((item) => {
      fragment.appendChild(createListItemElement(item))
    })
    document.getElementById('#list').appendChild(fragment)
  }
  document.querySelector('scroll-threshold').onlowerthreshold = () => {
    loadMore();
  };
}
</script>
```
