import { css } from 'lit-element';

export default css`:host {
  display: inline-block;
  position: relative;
  width: 40px;
  height: 40px;
  outline: none;
}

material-ripple {
  opacity: 0.6;
  color: currentColor;
}

:host ::slotted(*) {
  margin: 0;
  padding: 0;
  color: var(--anypoint-icon-button-color, var(--anypoint-color-primary));
}

.icon {
  cursor: pointer;
  border-radius: 50%;
  border-width: 1px;
  border-style: solid;
  border-color: transparent;

  position: relative;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
}

:host([disabled]) {
  pointer-events: none;
  cursor: auto;
}

:host([disabled]) ::slotted(*) {
  color: var(--anypoint-icon-button-disabled-color, #a8a8a8) !important;
}

/* Low emhasis styles */
:host([emphasis="low"]:not(:disabled)) .icon {
  background-color: none;
  border-color: none;
  box-shadow: none !important;
}

:host([emphasis="low"]:not(:disabled)) ::slotted(*) {
  color: var(--anypoint-icon-button-emphasis-low-color, var(--anypoint-color-primary));
}

:host([emphasis="low"]:hover) .icon {
  background-color: var(--anypoint-icon-button-emphasis-low-hover-background-color, rgba(0, 162, 223, .08));
}

:host([emphasis="low"][focused]) .icon {
  background-color: var(--anypoint-icon-button-emphasis-low-focus-background-color, rgba(0, 162, 223, .12));
}

:host([emphasis="low"][active]) .icon {
  background-color: var(--anypoint-icon-button-emphasis-low-active-background-color, rgba(0, 162, 223, .16));
}

:host([emphasis="low"][active]) ::slotted(*) {
  color: var(--anypoint-icon-button-emphasis-low-focus-color, var(--anypoint-color-coreBlue4));
}

/* Medium emphasis styles */
:host([emphasis="medium"]) .icon {
  border-color: var(--anypoint-icon-button-emphasis-medium-focus-border-color, var(--anypoint-color-robustBlue1));
  box-shadow: none !important;
}

:host([emphasis="medium"][disabled]) .icon {
  border-color: var(--anypoint-icon-button-disabled-color, var(--anypoint-color-aluminum4));
}

:host([emphasis="medium"][disabled]) ::slotted(*) {
  color: var(--anypoint-icon-button-disabled-color, #a8a8a8);
}

:host([emphasis="medium"]:hover) .icon {
  background-color: var(--anypoint-icon-button-emphasis-medium-hover-background-color, rgba(0, 162, 223, .06));
}

:host([emphasis="medium"][focused]) .icon {
  background-color: var(--anypoint-icon-button-emphasis-medium-focus-background-color, rgba(0, 162, 223, .08));
  border-color: var(--anypoint-icon-button-emphasis-medium-focus-border-color, var(--anypoint-color-robustBlue2));
}

:host([emphasis="medium"][focused]) ::slotted(*) {
  color: var(--anypoint-icon-button-emphasis-low-focus-color, var(--anypoint-color-coreBlue4));
}

:host([emphasis="medium"][active]) .icon {
  background-color: var(--anypoint-icon-button-emphasis-low-active-background-color, rgba(94, 102, 249, 0.16));
}
/* High emphasis styles */

:host([emphasis="high"]) .icon {
  transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: box-shadow;
  background-color: var(--anypoint-icon-button-emphasis-high-background-color, var(--anypoint-color-primary));
}

:host([emphasis="high"]) ::slotted(*) {
  color: var(--anypoint-icon-button-emphasis-high-color, var(--anypoint-color-tertiary));
}

:host([emphasis="high"][disabled]) .icon {
  background: var(--anypoint-icon-button-disabled-background-color, #eaeaea);
  box-shadow: none;
}

:host([emphasis="high"][disabled]) ::slotted(*) {
  color: var(--anypoint-icon-button-disabled-color, #a8a8a8);
}

:host([emphasis="high"]:hover) .icon {
  background-color: var(--anypoint-icon-button-emphasis-high-hover-background-color, rgba(0, 162, 223, 0.87));
}

:host(:not([pressed])[emphasis="high"][active]) .icon {
  background-color:
    var(--anypoint-icon-button-emphasis-high-active-background-color, var(--anypoint-color-indigo3));
}

:host([elevation="1"]) .icon {
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
              0 1px 5px 0 rgba(0, 0, 0, 0.12),
              0 3px 1px -2px rgba(0, 0, 0, 0.2);
}

:host([elevation="2"]) .icon,
:host([elevation][emphasis="high"][focused]) > .icon {
  box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14),
              0 1px 10px 0 rgba(0, 0, 0, 0.12),
              0 2px 4px -1px rgba(0, 0, 0, 0.4);
}

:host([elevation="3"]) .icon {
  box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14),
              0 1px 18px 0 rgba(0, 0, 0, 0.12),
              0 3px 5px -1px rgba(0, 0, 0, 0.4);
}`;
