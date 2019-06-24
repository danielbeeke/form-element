import {index} from "../Helpers.js";

export function input_checkbox (fieldKey, field, parent) {
  let formItem = this.createFormItem(field, parent);
  let input = this.createInput(field, formItem);
  let currentValue = index(this.data, field.name);
  if (typeof currentValue === 'boolean') {
    input.checked = currentValue;
  }
  else {
    input.checked = currentValue === input.value;
  }

  this.createLabel(field, formItem, 'checkbox-label');
  this.attachEventHandlers(field, input, ['change', 'keyup', 'blur'], () => {
    if (typeof index(this.data, field.name) === 'boolean') {
      index(this.data, field.name, input.checked);
    }
    else {
      index(this.data, field.name, input.value);
    }

    this.debouncedUpdate();
    this.dispatchEvent(new CustomEvent('change'));
  });

  return {
    field: input,
    formItem: formItem
  };
}