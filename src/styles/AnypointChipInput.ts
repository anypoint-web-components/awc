import { css } from 'lit';

export default css`
:host {
  width: auto;
  height: auto;
  min-height: var(--anypoint-input-height, 56px);
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

.icon {
  fill: currentColor;
  display: inline-block;
  width: 20px;
  height: 20px;
  margin: 0 0 0 8px;
  vertical-align: middle;
}
`;
