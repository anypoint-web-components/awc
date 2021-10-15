import { css } from 'lit-element';

export default css`
:host {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  height: 48px;
  margin: 0 12px;
}

:host([disabled]) {
  pointer-events: none;
  opacity: 0.54;
}

:host(:focus) {
  outline:none;
}

.toggle-container {
  position: relative;
}

.track {
  background-color: var(--anypoint-switch-color, #000);
  border: 1px var(--anypoint-switch-color, #000) solid;
  opacity: .38;

  box-sizing: border-box;
  width: 32px;
  height: 14px;
  border-radius: 7px;
  transition: opacity 90ms cubic-bezier(.4,0,.2,1),
    background-color 90ms cubic-bezier(.4,0,.2,1),
    border-color 90ms cubic-bezier(.4,0,.2,1);
}

.button {
  background-color: var(--anypoint-switch-button-color, #fff);
  border: 10px var(--anypoint-switch-button-color, #fff) solid;
  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2),
    0 2px 2px 0 rgba(0,0,0,.14),
    0 1px 5px 0 rgba(0,0,0,.12);
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 2;

  transition: background-color 90ms cubic-bezier(.4,0,.2,1),
    border-color 90ms cubic-bezier(.4,0,.2,1);
}

.button:before {
  position: absolute;
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
  content: "";
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: opacity 15ms linear, background-color 15ms linear;
  z-index: 0;
  background-color: var(--anypoint-switch-color, #000);
}

.toggle-container {
  position: absolute;
  left: -18px;
  right: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  transform: translateX(0);
  cursor: pointer;
  transition: transform 90ms cubic-bezier(.4,0,.2,1);
}

.label {
  margin-left: 10px;
  cursor: default;
}

.toggle-container:hover .button:before {
  opacity: .04;
}

:host(:focus) .button:before {
  opacity: .12;
}

:host([checked]) .button:before {
  background-color: var(--anypoint-switch-active-color, var(--primary-color));
}

:host([checked]) .track {
  opacity: .54;
  background-color: var(--anypoint-switch-active-color, var(--primary-color));
  border: 1px var(--anypoint-switch-active-color, var(--primary-color)) solid;
}

:host([checked]) .button {
  background-color: var(--anypoint-switch-active-color, var(--primary-color));
  border: 10px var(--anypoint-switch-active-color, var(--primary-color)) solid;
}

:host([checked]) .toggle-container {
  transform: translateX(20px);
}

:host([compatibility]) {
  height: 36px;
}

.anypoint.container {
  width: 64px;
  height: 36px;
  overflow: hidden;
  border-radius: 28px;
}

.anypoint .tracker {
  background: var(--anypoint-switch-background-color, var(--anypoint-color-aluminum2));
  height: 100%;
  width: inherit;
  position: relative;
}

:host(:focus) .tracker {
  background: var(--anypoint-switch-focus-background-color, var(--anypoint-color-aluminum3));
}

.anypoint .tracker:before {
  position: absolute;
  content: "";
  background-color: var(--anypoint-switch-tracker-background-color, var(--anypoint-color-steel2));
  height: 2px;
  top: calc(50% - 2px);
  left: 15%;
  right: 15%;
}

.anypoint .toggle {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  top: 10%;
  left: 5%;
  width: 28px;
  height: 28px;
  background: var(--anypoint-switch-toggle-background-color, var(--anypoint-color-aluminum3));
  border-radius: 100%;
  cursor: pointer;
  transition: background-color .15s, transform .15s ease-out;
}

:host(:focus) .anypoint .toggle {
  background: var(--anypoint-switch-toggle-focus-background-color, var(--anypoint-color-aluminum4));
}

.anypoint .icon {
  display: block;
  height: 16px;
  width: 16px;
  fill: var(--anypoint-switch-toggle-icon-color, currentColor);
}

:host([checked]) .anypoint .toggle {
  background-color: var(--anypoint-switch-toggle-checked-background-color, var(--anypoint-color-robustBlue2));
  color: #fff;
  transform: translateX(28px);
}`;
