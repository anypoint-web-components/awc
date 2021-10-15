import { css } from 'lit-element';

export default css`
:host {
  position: relative;
}

.trigger-icon {
  transform: rotate(0);
  transition: transform 0.12s ease-in-out;
  will-change: transform;
  color: var(--anypoint-dropdown-menu-label-color, #616161);
  fill: currentColor;
  display: inline-block;
  width: 24px;
  height: 24px;
  margin: 0 4px;
  cursor: pointer;
}

.trigger-icon.opened {
  transform: rotate(-180deg);
}

:host([opened]) .trigger-icon,
:host([focused]) .trigger-icon,
:host(:focus) .trigger-icon {
  color: var(--anypoint-dropdown-menu-trigger-icon-active-color, var(--primary-color));
}

.dropdown-content {
  box-shadow: var(--anypoint-dropdown-shadow);
}
`;
