import { css } from 'lit-element';

export default css`
:host {
  display: inline-block;
  outline: none;
  cursor: default;
  margin: 4px;
  box-sizing: border-box;
}

.container {
  border-radius: 16px;
  background-color: var(--anypoint-chip-background-color, rgba(35, 47, 52, 0.12));
  border: var(--anypoint-chip-border, none);
  height: inherit;
  min-height: 32px;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);

  display: flex;
  -ms-flex-direction: row;
  flex-direction: row;
  -ms-flex-align: center;
  align-items: center;
}

:host([compatibility]) .container {
  border-radius: 0;
}

:host([focused]:not([compatibility])) .container {
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
              0 1px 5px 0 rgba(0, 0, 0, 0.12),
              0 3px 1px -2px rgba(0, 0, 0, 0.2);
  background-color: var(--anypoint-chip-focused-background-color, #D6D6D6);
}

:host([focused][compatibility]) .container {
  background-color: var(--anypoint-chip-focused-background-color, #D6D6D6);
}

:host([active]) .container {
  background-color: var(--anypoint-chip-active-background-color, #cdcdcd);
}

:host([toggles]) {
  cursor: pointer;
}

:host([disabled]) {
  opacity: 0.54;
  pointer-events: none;
}

.icon ::slotted([slot=icon]) {
  border-radius: 50%;
  margin: 4px 0 4px 6px;
  color: var(--anypoint-chip-icon-color, #666666);
}

.label {
  display: inline-block;
  padding: 0px 8px;
  margin-left: 12px;
  margin-right: 12px;
  font-size: var(--arc-font-body2-font-size);
  font-weight: var(--arc-font-body2-font-weight);
  line-height: var(--arc-font-body2-line-height);
  color: var(--anypoint-chip-label-color, #232F34);
}

.label ::slotted([slot]) {
  font-size: var(--arc-font-body2-font-size);
  font-weight: var(--arc-font-body2-font-weight);
  line-height: var(--arc-font-body2-line-height);
  color: var(--anypoint-chip-label-color, #232F34);
}

:host([focused]) ::slotted([slot]),
:host([focused]) .label {
  color: var(--anypoint-chip-label-focused-color);
}

:host([active]) ::slotted([slot]),
:host([active]) .label {
  color: var(--anypoint-chip-label-active-color);
}

.with-icon .label {
  margin-left: 0;
}

.with-remove .label {
  margin-right: 0;
}

.close {
  width: 16px;
  height: 16px;
  background-color: var(--anypoint-chip-icon-close-background-color, #666666);
  color: var(--anypoint-chip-icon-close-color, #dfdfdf);
  border-radius: 50%;
  margin-right: 6px;
  cursor: pointer;
  fill: currentColor;
  display: inline-block;
}
`;