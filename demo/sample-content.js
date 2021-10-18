/* eslint-disable no-param-reassign */
import { html, css, LitElement } from 'lit-element';

const loremIpsumStrings = [
  'Lorem ipsum dolor sit amet, per in nusquam nominavi periculis, sit elit oportere ea.',
  'Ut labores minimum atomorum pro. Laudem tibique ut has.',
  'Fugit adolescens vis et, ei graeci forensibus sed.',
  'Convenire definiebas scriptorem eu cum. Sit dolor dicunt consectetuer no.',
  'Ea duis bonorum nec, falli paulo aliquid ei eum.',
  'Usu eu novum principes, vel quodsi aliquip ea.',
  'Has at minim mucius aliquam, est id tempor laoreet.',
  'Pro saepe pertinax ei, ad pri animal labores suscipiantur.',
  'Detracto suavitate repudiandae no eum. Id adhuc minim soluta nam.',
  'Iisque perfecto dissentiet cum et, sit ut quot mandamus, ut vim tibique splendide instructior.',
  'Id nam odio natum malorum, tibique copiosae expetenda mel ea.',
  'Cu mei vide viris gloriatur, at populo eripuit sit.',
  'Modus commodo minimum eum te, vero utinam assueverit per eu.',
  'No nam ipsum lorem aliquip, accumsan quaerendum ei usu.'
];

class SampleContent extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
      }`;
  }

  static get properties() {
    return {
      size: { type: Number },
      label: { type: String },
      padding: { type: String },
      margin: { type: String },
      boxShadow: { type: String }
    };
  }

  constructor() {
    super();
    this.size = 0;
    this.label = '';
    this.padding = '16px';
    this.margin = '24px';
    this.boxShadow =
      '0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2)';
  }

  _randomString(size) {
    const ls = loremIpsumStrings;
    let s = '';
    do {
      s += ls[Math.floor(Math.random() * ls.length)];
      size--;
    } while (size > 0);
    return s;
  }

  _randomLetter() {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26));
  }

  render() {
    const { size, label, padding, margin, boxShadow } = this;
    const arr = new Array(size);
    arr.fill(0);
    const itemStyle = `box-shadow: ${  boxShadow  }; padding: ${  padding 
      }; margin: ${  margin  }; border-radius: 5px; background-color: #fff; color: #757575;`;
    const innerStyle = 'display: inline-block; height: 64px; width: 64px; ' +
      'border-radius: 50%; background: #ddd; line-height: 64px; font-size: 30px; color: #555; text-align: center;';
    return html`
      ${arr.map(() => html`
        <div style="${itemStyle}">
          <div style="${innerStyle}">
            ${this._randomLetter()}
          </div>
          <div style="font-size: 22px; margin: 16px 0; color: #212121;">
            ${label} ${this._randomString()}
          </div>
          <p style="font-size: 16px;">${this._randomString()}</p>
          <p style="font-size: 14px;">${this._randomString(3)}</p>
        </div>
      `)}
    `;
  }
}
window.customElements.define('sample-content', SampleContent);
