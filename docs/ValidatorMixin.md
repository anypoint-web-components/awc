# ValidatorMixin

Use `ValidatorMixin` to implement a custom input/form validator. Element instances implementing this mixin will be registered for use in elements that implement `ValidatableMixin`.

## Usage

### Validator name

By default it takes lower case name of current HTML element. If this class
is used outside custom elements environment then it uses static `is` property
to get the name of the mixin.

```javascript
static get is() {
 return 'my-validator';
}
```

### Deregistering validator

When an instance of a validator is created it is being stored in a global validators cache
controlled by the `ValidatorStore` module.

After registering the validator in the global store it is not tied to component's life cycle methods (it can extend an Object instead of HTMLElement). Also, usually validator stays in the document for the entire life cycle of the web app. But if you need to un-register the validator then call `instance.unregister()` function
and detach this element from the DOM or remove references to the object so it can be GC'd.

You can also do this by calling `ValidatorStore.unregister(instance)`.


### In a LitElement

```javascript
import { LitElement } from 'lit-element';
import { ValidatorMixin } from '@anypoint-web-components/awc';

class CatsOnly extends ValidatorMixin(LitElement) {
  validateObject(obj) {
    return !Object.keys(obj).some((key) => obj[key].match(/^(c|ca|cat|cats)?$/) === null);
  }

  validateArray(value) {
    return !value.some((value) => value.match(/^(c|ca|cat|cats)?$/) === null);
  }

  validate(values) {
    if (Array.isArray(values)) {
      return this.validateArray(values);
    }
    if (typeof values === 'object') {
      return this.validateObject(values);
    }
    return values.match(/^(c|ca|cat|cats)?$/) !== null;
  }
}
window.customElements.define('cats-only', CatsOnly);
```
