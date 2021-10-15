import { css } from 'lit-element';

export default css`
:host {
  display: block;
  margin: 24px 40px;
  background: var(--anypoint-dialog-background-color, var(--primary-background-color));
  color: var(--anypoint-dialog-color, var(--primary-text-color));
  font-size: 1rem;
  border-radius: 4px;
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2),
              0px 24px 38px 3px rgba(0, 0, 0, 0.14),
              0px 9px 46px 8px rgba(0,0,0,.12);
}

:host > * {
  margin-top: 20px;
  padding: 0 24px;
  color: var(--anypoint-dialog-content-color, rgba(0,0,0,.6));
}

:host > *:first-child {
  margin-top: 24px;
}

:host > *:last-child {
  margin-bottom: 24px;
}

:host > h2,
:host > .title {
  position: relative;
  margin: 0;
  margin-top: 24px;
  margin-bottom: 24px;
  font-size: 1.25rem;
  line-height: 2rem;
  font-weight: 500;
  color: var(--anypoint-dialog-title-color, rgba(0,0,0,1));
}

:host > .dialog-buttons,
:host > .buttons {
  position: relative;
  padding: 8px;
  margin: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

:host([compatibility]) > h2,
:host([compatibility]) > .title {
  font-size: 2rem;
  padding: 20px 40px;
  margin: 0;
  background-color: #f9fafb;
  border-bottom: 1px solid #e8e9ea;
  font-family: "DIN Pro", "Open Sans", sans-serif;
}


:host([compatibility]) > * {
  padding: 20px 40px;
  color: var(--anypoint-dialog-content-color, rgba(0,0,0,1));
}
`;
