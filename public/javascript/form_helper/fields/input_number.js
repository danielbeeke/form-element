export function input_number (fieldKey, field, parent) {
  let formItem = this.createFormItem(field, parent);
  this.createLabel(field, formItem);
  let input = this.createInput(field, formItem);
  this.attachEventHandlers(field, input, ['change', 'keyup', 'blur']);

  return {
    field: input,
    formItem: formItem
  };
}