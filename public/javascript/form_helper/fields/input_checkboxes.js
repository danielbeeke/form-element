export function input_checkboxes (fieldKey, field, parent) {
  let formItem = this.createFormItem(field, parent);
  this.createLabel(field, formItem);

  let options = field.options;
  delete field.options;
  field.children = [];

  for (let [value, label] of Object.entries(options)) {
    field.children.push({
      nodeType: 'input',
      type: 'checkbox',
      label: label,
      id: field.name + '-' + value,
      value: value,
      name: field.name
    });
  }

  return {
    formItem: formItem
  };
}