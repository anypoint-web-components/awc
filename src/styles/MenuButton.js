import { css } from 'lit-element';

export default css`
:host {
  display: inline-block;
  position: relative;
  padding: 8px;
  outline: none;
}

:host([disabled]) {
  cursor: auto;
  color: var(--disabled-text-color);
}

.dropdown-content {
  box-shadow: var(--anypoint-menu-button-context-shadow, var(--anypoint-dropdown-shadow));
  position: relative;
  border-radius: var(--anypoint-menu-button-border-radius, 2px);
  background-color: var(--anypoint-menu-button-dropdown-background, var(--primary-background-color));
}

:host([verticalalign="top"]) .dropdown-content {
  margin-bottom: 20px;
  margin-top: -10px;
  top: 10px;
}

:host([verticalalign="bottom"]) .dropdown-content {
  bottom: 10px;
  margin-bottom: -10px;
  margin-top: 20px;
}

#trigger {
  cursor: pointer;
}

:host([compatibility]) .dropdown-content {
  box-shadow: none;
  border-top-width: 2px;
  border-bottom-width: 2px;
  border-top-color: var(--anypoint-menu-button-border-top-color, var(--anypoint-color-aluminum4));
  border-bottom-color: var(--anypoint-menu-button-border-bottom-color, var(--anypoint-color-aluminum4));
  border-top-style: solid;
  border-bottom-style: solid;
}
`;
