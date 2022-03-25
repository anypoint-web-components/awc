import { html, TemplateResult } from 'lit';
import { DemoPage } from './lib/DemoPage.js';

import './range-element.js';

class ComponentPage extends DemoPage {
  constructor() {
    super();
    this.componentName = 'Range mixin';
  }

  contentTemplate(): TemplateResult {
    return html`
      <h2>Range mixin implementation</h2>
      <range-element min="0" max="200" value="120"></range-element>
    `;
  }
}

const instance = new ComponentPage();
instance.render();
