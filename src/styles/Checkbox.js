import { css } from 'lit-element';

export default css`
:host {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  cursor: pointer;
  line-height: 0;
  -webkit-tap-highlight-color: transparent;
}

:host([hidden]) {
  display: none !important;
}

:host([disabled]),
:host([formdisabled]) {
  cursor: auto;
  pointer-events: none;
  user-select: none;
}

:host(:focus) {
  outline: none;
}

.hidden {
  display: none !important;
}

.checkboxContainer {
  display: inline-block;
  position: relative;
  vertical-align: middle;
  padding: 12px;
}

.checkboxContainer:hover:before,
  :host([focused]) .checkboxContainer:before {
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  opacity: .04;
  background-color: var(--anypoint-checkbox-checked-color, var(--anypoint-color-primary));
  pointer-events: none;
  content: "";
  border-radius: 50%;
  position: absolute;
}

:host([disabled]) .checkboxContainer:before,
:host([formdisabled]) .checkboxContainer:before {
  display: none;
}

:host([focused]) .checkboxContainer:before {
  opacity: .12;
}

.checkbox {
  position: relative;
  box-sizing: border-box;
  pointer-events: none;
  border-width: 1px;
  border-style: solid;
  border-color: var(--anypoint-checkbox-input-border-color, var(--anypoint-color-aluminum4));
  border-radius: 2px;
  -webkit-transition: box-shadow .3s linear;
  transition: box-shadow .3s linear;
  display: inline-block;
  vertical-align: text-top;
  width: 20px;
  height: 20px;
  -webkit-transition: background-color .17s ease-out;
  transition: background-color .17s ease-out;
}

.checkmark {
  transition: top .15s ease-in-out, height .2s ease-in-out, width .3s ease-in-out;
  will-change: top, width, height;
  position: absolute;
  display: block;
  left: 4px;
}

:host([checked]) .checkmark {
  border-color: var(--anypoint-checkbox-checkmark-color, var(--anypoint-color-tertiary));
  border-style: none none solid solid;
  border-width: 3px;
  height: 5px;
  top: 3px;
  transform: rotate(-45deg);
  width: 8px;
  background: transparent;
}

.checkboxLabel {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  white-space: normal;
  line-height: normal;
  color: var(--anypoint-checkbox-label-color, var(--anypoint-color-steel1));
}

:host-context([dir="rtl"]) .checkboxLabel {
  padding-right: var(--anypoint-checkbox-label-spacing, 5px);
  padding-left: 0;
}

:host([checked]) .checkbox,
:host(:not([checked])[indeterminate]) .checkbox {
  background-color: var(--anypoint-checkbox-checked-color, var(--anypoint-color-primary));
  border-color: var(--anypoint-checkbox-checked-input-border-color, var(--anypoint-color-primary));
}

:host(:not([checked])[indeterminate]) .checkmark {
  background-color: var(--anypoint-checkbox-checkmark-color, var(--anypoint-color-tertiary));
  height: 3px;
  width: 10px;
  top: calc(50% - 1px);
  border: none;
}


:host([checked]) .checkboxLabel {
  color: var(--anypoint-checkbox-label-checked-color,
    var(--anypoint-checkbox-label-color, var(--anypoint-color-steel1)));
}

.checkboxLabel[hidden] {
  display: none;
}

:host([disabled]) .checkbox,
:host([formdisabled]) .checkbox {
  opacity: 0.5;
  border-color: var(--anypoint-checkbox-unchecked-color,
    var(--anypoint-checkbox-label-color, var(--anypoint-color-steel1)));
}

:host([disabled][checked]) .checkbox,
:host([formdisabled][checked]) .checkbox {
  background-color: var(--anypoint-checkbox-unchecked-color,
    var(--anypoint-checkbox-label-color, var(--anypoint-color-steel1)));
  opacity: 0.5;
}

:host([disabled]) .checkboxLabel,
:host([formdisabled]) .checkboxLabel {
  opacity: 0.65;
}

/* invalid state */
.checkbox.invalid:not(.checked),
:host(:invalid) .checkbox {
  border-color: var(--anypoint-checkbox-error-color, var(--anypoint-color-danger));
}
`;
