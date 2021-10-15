import { HoverableMixin } from '../index.js';

class HoverableTestNative extends HoverableMixin(HTMLElement) {
  constructor() {
    super();
    const shadow = this.attachShadow({mode: 'open'});
    const title = document.createElement('h1');
    title.innerText = 'Hoverable mixin';
    const style = document.createElement('style');
    style.textContent = `:host {
      display: block;
      height: 100px;
      width: 100px;
      background-color: red;
    }`;
    shadow.appendChild(style);
    shadow.appendChild(title);
  }
}
window.customElements.define('hoverable-test-native', HoverableTestNative);
