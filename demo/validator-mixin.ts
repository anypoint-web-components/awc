/* eslint-disable import/named */
/* eslint-disable import/extensions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ValidatorStore } from '../index.js';
import './cats-only.js';

/* eslint-disable no-plusplus */

const validator = ValidatorStore.get('cats-only');

const Demo = {
  init: () => {
    document.getElementById('input1')!.addEventListener('input', Demo._onInput);
    document.getElementById('input2')!.addEventListener('input', Demo._onInputMulti);
    document.getElementById('form')!.addEventListener('submit', Demo._onSubmit);
  },

  _onInput: (e: any) => {
    // @ts-ignore
    const valid = validator.validate(e.target.value);
    Demo._singleResult(valid);
    // @ts-ignore
    e.target.setCustomValidity(validator.message);
  },

  _singleResult: (valid: any) => {
    Demo._setResult('singleinput', valid);
  },

  _onInputMulti: (e: any) => {
    const values = [];
    const nodes = e.target.parentNode.querySelectorAll('input');
    let i;
    let len;
    for (i = 0, len = nodes.length; i < len; i++) {
      values.push(nodes[i].value);
    }
    // @ts-ignore
    const valid = validator.validate(values);
    Demo._multipleResult(valid);
    for (i = 0, len = nodes.length; i < len; i++) {
      // @ts-ignore
      nodes[i].setCustomValidity(valid ? '' : validator.message);
    }
  },

  _multipleResult: (valid: any) => {
    Demo._setResult('multipleinput', valid);
  },

  _onSubmit: (e: any) => {
    e.preventDefault();
    const data = {};
    for (let el, i = 0, len = e.target.elements.length; i < len; i++) {
      el = e.target.elements[i];
      if (el.name) {
        // @ts-ignore
        data[el.name] = el.value;
      }
    }
    // @ts-ignore
    const valid = validator.validate(data);
    Demo._formResult(valid);
  },

  _formResult: (valid: any) => {
    Demo._setResult('forminput', valid);
  },

  _setResult: (id: any, valid: any) => {
    const ve = document.querySelector(`#${id} .valid`) as HTMLElement;
    const ie = document.querySelector(`#${id} .invalid`) as HTMLElement;
    if (valid) {
      ie.setAttribute('hidden', '');
      ve.removeAttribute('hidden');
    } else {
      ve.setAttribute('hidden', '');
      ie.removeAttribute('hidden');
    }
  }
};

Demo.init();
