import {assert} from '@open-wc/testing';

import './x-resizable.js';
import './x-resizer-parent.js';

const resizer = document.createElement('x-resizer-parent');
const resizable = document.createElement('x-resizable');
resizer.appendChild(resizable);
document.body.appendChild(resizer);

describe('imports order', () => {
  it('resizable children and parent updated', () => {
    const parent = document.querySelector('x-resizer-parent');
    const child = parent.firstElementChild;
    assert.deepEqual(
        parent._interestedResizables, [child], 'resizable children ok');
    assert.equal(child._parentResizable, parent, 'resizable parent ok');
  });
});
