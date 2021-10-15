import { svg } from 'lit-element';
/* eslint-disable max-len */
const iconWrapper = (tpl) => svg`<svg viewBox="0 0 16 16" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;">${tpl}</svg>`;

export const arrowDown = iconWrapper(svg`<path xmlns="http://www.w3.org/2000/svg" d="M8.002 11.352L3.501 4.924l1.027-.276 3.473 4.96 3.471-4.959 1.027.275-4.497 6.428z"></path>`);
