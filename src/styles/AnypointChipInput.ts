import { css } from 'lit';

export default css`
:host {
  position: relative;
  width: auto;
  min-width: 170px;
  min-height: 56px;
  height: auto;
}

.chips {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
}

.prefixes {
  max-width: 60%;
}

.input-container {
  min-height: inherit;
}

:host([anypoint]) {
  min-height: 40px;
  height: 40px;
}

.icon {
  fill: currentColor;
  display: inline-block;
  width: 20px;
  height: 20px;
  margin: 0 0 0 8px;
  vertical-align: middle;
}
`;
