/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/

/* eslint-disable class-methods-use-this */
/* eslint-disable no-plusplus */
/* eslint-disable no-continue */

const p = Element.prototype;
// @ts-ignore
const matches = p.matches || p.matchesSelector || p.mozMatchesSelector ||
  // @ts-ignore
  p.msMatchesSelector || p.oMatchesSelector || p.webkitMatchesSelector;

export class FocusableHelper {
  /**
   * Returns a sorted array of tabbable nodes, including the root node.
   * It searches the tabbable nodes in the light and shadow dom of the children,
   * sorting the result by tabindex
   */
  getTabbableNodes(node: Node): Array<HTMLElement> {
    const result: HTMLElement[] = [];
    // If there is at least one element with tabindex > 0, we need to sort
    // the final array by tabindex.
    const needsSortByTabIndex = this._collectTabbableNodes(node, result);
    if (needsSortByTabIndex) {
      return this._sortByTabIndex(result);
    }
    return result;
  }

  /**
   * Returns if a element is focusable.
   */
  isFocusable(element: HTMLElement): boolean {
    // From http://stackoverflow.com/a/1600194/4228703:
    // There isn't a definite list, it's up to the browser. The only
    // standard we have is DOM Level 2 HTML
    // https://www.w3.org/TR/DOM-Level-2-HTML/html.html, according to which the
    // only elements that have a focus() method are HTMLInputElement,
    // HTMLSelectElement, HTMLTextAreaElement and HTMLAnchorElement. This
    // notably omits HTMLButtonElement and HTMLAreaElement. Referring to these
    // tests with tabbables in different browsers
    // http://allyjs.io/data-tables/focusable.html

    // Elements that cannot be focused if they have [disabled] attribute.
    if (matches.call(element, 'input, select, textarea, button, object')) {
      return matches.call(element, ':not([disabled])');
    }
    // Elements that can be focused even if they have [disabled] attribute.
    return matches.call(
        element, 'a[href], area[href], iframe, [tabindex], [contentEditable]');
  }

  /**
   * Returns if a element is tabbable. To be tabbable, a element must be
   * focusable, visible, and with a tabindex !== -1.
   */
  isTabbable(element: HTMLElement): boolean {
    return this.isFocusable(element) && matches.call(element, ':not([tabindex="-1"])') && this._isVisible(element);
  }

  /**
   * Returns the normalized element tabindex. If not focusable, returns -1.
   * It checks for the attribute "tabindex" instead of the element property
   * `tabIndex` since browsers assign different values to it.
   * e.g. in Firefox `<div contenteditable>` has `tabIndex = -1`
   */
  private _normalizedTabIndex(element: HTMLElement): number {
    if (this.isFocusable(element)) {
      const tabIndex = element.getAttribute('tabindex') || 0;
      return Number(tabIndex);
    }
    return -1;
  }

  /**
   * Searches for nodes that are tabbable and adds them to the `result` array.
   * Returns if the `result` array needs to be sorted by tabindex.
   * @param node The starting point for the search; added to `result`
   * if tabbable.
   */
  private _collectTabbableNodes(node: Node, result: HTMLElement[]): boolean {
    // If not an element or not visible, no need to explore children.
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return false;
    }
    const element = node as HTMLElement;
    if (result.indexOf(element) !== -1) {
      return false;
    }
    if (!this._isVisible(element)) {
      return false;
    }
    const tabIndex = this._normalizedTabIndex(element);
    let needsSort = tabIndex > 0;
    if (tabIndex >= 0) {
      result.push(element);
    }
    // In ShadowDOM v1, tab order is affected by the order of distribution.
    // E.g. getTabbableNodes(#root) in ShadowDOM v1 should return [#A, #B];
    // in ShadowDOM v0 tab order is not affected by the distribution order,
    // in fact getTabbableNodes(#root) returns [#B, #A].
    //  <div id="root">
    //   <!-- shadow -->
    //     <slot name="a">
    //     <slot name="b">
    //   <!-- /shadow -->
    //   <input id="A" slot="a">
    //   <input id="B" slot="b" tabindex="1">
    //  </div>
    let children;
    if (element.localName === 'slot') {
      children = (element as HTMLSlotElement).assignedNodes().filter((n) => n.nodeType === Node.ELEMENT_NODE);
      // Use shadow root if possible, will check for distributed nodes.
    } else if (element.shadowRoot && element.shadowRoot.querySelectorAll) {
        children = element.shadowRoot.querySelectorAll('*');
    } else {
      children = element.children;
    }
    for (let i = 0; i < children.length; i++) {
      // Ensure method is always invoked to collect tabbable children.
      needsSort = this._collectTabbableNodes(children[i], result) || needsSort;
    }
    return needsSort;
  }

  /**
   * Returns false if the element has `visibility: hidden` or `display: none`
   */
  private _isVisible(element: HTMLElement): boolean {
    // Check inline style first to save a re-flow. If looks good, check also
    // computed style.
    let {style} = element;
    if (style.visibility !== 'hidden' && style.display !== 'none') {
      style = window.getComputedStyle(element);
      return (style.visibility !== 'hidden' && style.display !== 'none');
    }
    return false;
  }

  /**
   * Sorts an array of tabbable elements by tabindex. Returns a new array.
   */
  private _sortByTabIndex(tabbables: HTMLElement[]): HTMLElement[] {
    // Implement a merge sort as Array.prototype.sort does a non-stable sort
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    const len = tabbables.length;
    if (len < 2) {
      return tabbables;
    }
    const pivot = Math.ceil(len / 2);
    const left = this._sortByTabIndex(tabbables.slice(0, pivot));
    const right = this._sortByTabIndex(tabbables.slice(pivot));
    return this._mergeSortByTabIndex(left, right);
  }

  /**
   * Merge sort iterator, merges the two arrays into one, sorted by tab index.
   */
  private _mergeSortByTabIndex(left: HTMLElement[], right: HTMLElement[]): HTMLElement[] {
    const result: HTMLElement[] = [];
    while ((left.length > 0) && (right.length > 0)) {
      if (this._hasLowerTabOrder(left[0], right[0])) {
        result.push(right.shift() as HTMLElement);
      } else {
        result.push(left.shift() as HTMLElement);
      }
    }

    return result.concat(left, right);
  }

  /**
   * Returns if element `a` has lower tab order compared to element `b`
   * (both elements are assumed to be focusable and tabbable).
   * Elements with tabindex = 0 have lower tab order compared to elements
   * with tabindex > 0.
   * If both have same tabindex, it returns false.
   */
  private _hasLowerTabOrder(a: HTMLElement, b: HTMLElement): boolean {
    // Normalize tabIndexes
    // e.g. in Firefox `<div contenteditable>` has `tabIndex = -1`
    const ati = Math.max(a.tabIndex, 0);
    const bti = Math.max(b.tabIndex, 0);
    return (ati === 0 || bti === 0) ? bti > ati : ati > bti;
  }
}
