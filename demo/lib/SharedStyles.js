/* eslint-disable no-lone-blocks */
/* eslint-disable max-len */
import { css } from 'lit-element';

const style = css`
html {
  font-size: 16px;
  line-height: 20px;
}

body {
  font-family: 'Roboto', 'Noto', sans-serif;
  font-size: 16px;
  margin: 0;
  padding: 24px;
  background-color: #fafafa;
  color: #5f6368;
}

body.styled {
  margin: 0;
  padding: 0;
  background-color: #fff;
  height: 100vh;
  --primary-color: #000000;
  --accent-color: rgb(33, 150, 243);
  --dark-divider-opacity: 0.12;
}

.horizontal-section-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
}

.vertical-section-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.centered {
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.card {
  box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14),
              0 1px 10px 0 rgba(0, 0, 0, 0.12),
              0 2px 4px -1px rgba(0, 0, 0, 0.4);
  padding: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 20px;
  box-sizing: border-box;
  background-color: #fff;
}

header {
  padding: 12px 24px;
  background-color: #2196F3;
  color: #000;
  display: flex;
  align-items: center;
}

header h1 {
  font-size: 24px;
  font-weight: 400;
  letter-spacing: -.012em;
  line-height: 32px;
}

body.styled.dark {
  background-color: #424242;
  height: 100vh;
  color: #fff;
  --primary-color: #2196f3;
  --primary-text-color: #fff;
  --paper-toggle-button-label-color: #fff;
  --primary-background-color: #424242;
  --secondary-text-color: #616161;
  --arc-interactive-demo-options-color: #F5F5F5;
  --error-color: #FF5722;
}

body.styled.dark arc-demo-helper {
  --arc-demo-helper-code-container-background-color: #263238;
  --code-background-color: #263238;
  --code-type-boolean-value-color: #F07178;
  --code-type-number-value-color: #F78C6A;
  --code-type-text-value-color: #C3E88D;
  --code-property-value-color: #F07178;
  --code-operator-value-background-color: transparent;
  --arc-demo-helper-demo-background-color: #263238;
}

body.styled.dark .card {
  background-color: #424242;
}

body.styled.dark header {
  background-color: #212121;
  color: #fff;
}

.demo-container {
  flex: 1;
}

h2 {
  font-size: 60px;
  color: #202124;
  font-weight: 400;
  line-height: 1.2;
}

h3 {
  font-size: 24px;
  color: #202124;
  font-weight: 400;
  line-height: 1.2;
}

h4 {
  font-size: 20px;
  font-weight: 400;
  line-height: 1.2;
  margin: 0 0 8px;
}

body.styled.dark h2,
body.styled.dark h3,
body.styled.dark h4 {
  color: #F5F5F5;
}

.documentation-section {
  max-width: 1400px;
  padding: 60px 20px;
  max-width: 1400px;
  width: 100%;
  border-bottom: 1px #e5e5e5 solid;
  margin: 0 auto;
  box-sizing: border-box;
}

ul {
  padding-left: 20px;
}

p {
  margin: 1.40em 0;
}

.icon {
  display: block;
  width: 24px;
  height: 24px;
  fill: currentColor;
}
`;
try {
  // @ts-ignore
  document.adoptedStyleSheets = document.adoptedStyleSheets.concat(style.styleSheet);
} catch (_) {
  /* istanbul ignore next */
  {
    const s = document.createElement('style');
    s.innerHTML = style.cssText;
    document.getElementsByTagName('head')[0].appendChild(s);
  }
}
