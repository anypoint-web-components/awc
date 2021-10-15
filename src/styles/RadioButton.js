import { css } from 'lit-element';

export default css`
:host {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  line-height: 0;
  white-space: nowrap;
  cursor: pointer;
  vertical-align: middle;
}

:host(:focus) {
  outline: none;
}

:host([disabled]) {
  cursor: auto;
  pointer-events: none;
  color: var(--anypoint-radio-button-disabled-color, #a8a8a8);
}

.radio-container {
  display: inline-block;
  position: relative;
  vertical-align: middle;
  position: relative;
  vertical-align: middle;
  width: 16px;
  height: 16px;
  padding: 8px;
}

.radio-container:before {
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  opacity: 0.04;
  background-color: var(--anypoint-radio-button-checked-color, var(--anypoint-color-primary));
  pointer-events: none;
  content: "";
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  transition: transform ease 0.18s;
  will-change: transform;
}

.radio-container:hover:before,
:host(:focus) .radio-container:before {
  transform: scale(1);
}

:host(:focus) .radio-container:before {
  opacity: 0.08;
}

.state-container {
  width: 16px;
  height: 16px;
  position: relative;
}

#offRadio, #onRadio {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: block;
  border-width: 1px;
  border-color: transparent;
  border-style: solid;
  position: absolute;
}

#offRadio {
  border-color: var(--anypoint-radio-button-unchecked-color, var(--anypoint-color-aluminum5));
  background-color: var(--anypoint-radio-button-unchecked-background-color, transparent);
  transition: background-color 0.28s, border-color 0.28s;
}

:host(:hover) #offRadio {
  border-color: var(--anypoint-radio-button-hover-unchecked-color, var(--anypoint-color-coreBlue2));
}

:host(:active) #offRadio,
:host(:focus) #offRadio {
  border-color: var(--anypoint-radio-button-active-unchecked-color, var(--anypoint-color-coreBlue3));
}

:host([checked]) #offRadio {
  border-color: var(--anypoint-radio-button-checked-color, var(--anypoint-color-coreBlue3));
  background-color: var(--anypoint-radio-button-checked-color, var(--anypoint-color-coreBlue3));
}

:host([disabled]) #offRadio {
  border-color: var(--anypoint-radio-button-unchecked-color, var(--anypoint-color-steel1));
  opacity: 0.65;
}

:host([disabled][checked]) #offRadio {
  background-color: var(--anypoint-radio-button-checked-color, var(--anypoint-color-steel1));
}

#onRadio {
  background-color: var(--anypoint-radio-button-checked-inner-background-color, #fff);
  -webkit-transform: scale(0);
  transform: scale(0);
  transition: -webkit-transform ease 0.28s;
  transition: transform ease 0.28s;
  will-change: transform;
}

:host([checked]) #onRadio {
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
}

.radioLabel {
  line-height: normal;
  position: relative;
  display: inline-block;
  vertical-align: middle;
  white-space: normal;
  color: var(--anypoint-radio-button-label-color, var(--primary-text-color));
}

:host-context([dir="rtl"]) .radioLabel {
  margin-left: 8px;
}

:host([disabled]) .radioLabel {
  pointer-events: none;
  color: var(--anypoint-radio-button-disabled-color, #a8a8a8);
}
`;
