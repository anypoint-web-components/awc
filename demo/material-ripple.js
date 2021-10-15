import { html } from 'lit-html';
import { DemoPage } from './lib/DemoPage.js';
import '@advanced-rest-client/arc-icons/arc-icon.js';
import '../material-ripple.js';
import './lib/demo-helper.js'

class ComponentDemo extends DemoPage {
  constructor() {
    super();
    this.componentName = 'material-ripple';
  }

  contentTemplate() {
    return html`
      <h2>Material ripple</h2>
      <demo-helper class="centered-demo">
        <template>
          <div class="button raised">
            <div class="center" tabindex="0">SUBMIT</div>
            <material-ripple></material-ripple>
          </div>

          <div class="button raised">
            <div class="center" tabindex="0">NO INK</div>
            <material-ripple noink></material-ripple>
          </div>

          <div class="button raised grey">
            <div class="center" tabindex="0">CANCEL</div>
            <material-ripple></material-ripple>
          </div>

          <div class="button raised blue">
            <div class="center" tabindex="0">COMPOSE</div>
            <material-ripple></material-ripple>
          </div>

          <div class="button raised green">
            <div class="center" tabindex="0">OK</div>
            <material-ripple></material-ripple>
          </div>
        </template>
      </demo-helper>

      <demo-helper class="centered-demo">
        <template>
          <div class="button raised grey narrow">
            <div class="center" tabindex="0">Like</div>
            <material-ripple></material-ripple>
          </div>

          <div class="button raised grey narrow label-blue">
            <div class="center" tabindex="0">Like</div>
            <material-ripple></material-ripple>
          </div>

          <div class="button raised grey narrow label-red">
            <div class="center" tabindex="0">Like</div>
            <material-ripple></material-ripple>
          </div>
        </template>
      </demo-helper>

      <demo-helper class="centered-demo">
        <template>
          <div class="icon-button">
            <arc-icon icon="menu" tabindex="0"></arc-icon>
            <material-ripple class="circle" recenters></material-ripple>
          </div>

          <div class="icon-button">
            <arc-icon icon="moreVert" tabindex="0"></arc-icon>
            <material-ripple class="circle" recenters></material-ripple>
          </div>

          <div class="icon-button red">
            <arc-icon icon="remove" tabindex="0"></arc-icon>
            <material-ripple class="circle" recenters></material-ripple>
          </div>

          <div class="icon-button blue">
            <arc-icon icon="archive" tabindex="0"></arc-icon>
            <material-ripple class="circle" recenters></material-ripple>
          </div>
        </template>
      </demo-helper>

      <demo-helper class="centered-demo">
        <template>
          <div class="fab red">
            <arc-icon icon="add" tabindex="0"></arc-icon>
            <material-ripple class="circle" recenters></material-ripple>
          </div>

          <div class="fab blue">
            <arc-icon icon="remove" tabindex="0"></arc-icon>
            <material-ripple class="circle" recenters></material-ripple>
          </div>

          <div class="fab green">
            <arc-icon icon="clearAll" tabindex="0"></arc-icon>
            <material-ripple class="circle" recenters></material-ripple>
          </div>
        </template>
      </demo-helper>

      <demo-helper class="centered-demo">
        <template>
          <div class="menu">
            <div class="item">
              <div class="label" tabindex="0">Mark as unread</div>
              <material-ripple></material-ripple>
            </div>
            <div class="item">
              <div class="label" tabindex="0">Mark as important</div>
              <material-ripple></material-ripple>
            </div>
            <div class="item">
              <div class="label" tabindex="0">Add to Tasks</div>
              <material-ripple></material-ripple>
            </div>
            <div class="item">
              <div class="label" tabindex="0">Create event</div>
              <material-ripple></material-ripple>
            </div>
          </div>

          <div class="menu blue">
            <div class="item">
              <div class="label" tabindex="0">Import</div>
              <material-ripple></material-ripple>
            </div>
            <div class="item">
              <div class="label" tabindex="0">Export</div>
              <material-ripple></material-ripple>
            </div>
            <div class="item">
              <div class="label" tabindex="0">Print</div>
              <material-ripple></material-ripple>
            </div>
            <div class="item">
              <div class="label" tabindex="0">Restore contacts</div>
              <material-ripple></material-ripple>
            </div>
          </div>
        </template>
      </demo-helper>
      
      <demo-helper class="centered-demo">
        <template>
          <div class="dialog">
            <div class="content">
              <div class="title">Permission</div>
              <br>
              <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</div>
            </div>

            <div class="button label-blue">
              <div class="center" tabindex="0">ACCEPT</div>
              <material-ripple></material-ripple>
            </div>

            <div class="button">
              <div class="center" tabindex="0">DECLINE</div>
              <material-ripple></material-ripple>
            </div>
          </div>

          <div class="card" tabindex="0">
            <material-ripple recenters></material-ripple>
          </div>

          <div class="card image" tabindex="0">
            <material-ripple recenters></material-ripple>
          </div>
        </template>
      </demo-helper>
    `;
  }
}
const instance = new ComponentDemo();
instance.render();
