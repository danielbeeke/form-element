import {index} from "../Helpers.js";

export function select (fieldKey, field, parent) {
  let formItem = this.createFormItem(field, parent);
  this.createLabel(field, formItem);

  let element = document.createElement('select');
  for (let [key, value] of Object.entries(field)) {
    if (!['label', 'nodeType', 'children', 'options'].includes(key) && key in element) {
      element[key] = value;
    }
  }
  formItem.appendChild(element);

  let givenOptions = field.options;

  field.options = new Proxy(element.options, {
    get: function(obj, prop) {
      if (prop === 'length') {return obj.length }
    },
    set: function(obj, prop, value) {
      if (!isNaN(prop)) {
        return obj[prop] = value;
      }
    }
  });

  let currentValue = index(this.data, field.name);

  for (let [key, label] of Object.entries(givenOptions)) {
    let selected = currentValue === key || currentValue instanceof Array && currentValue.includes(key);
    field.options[field.options.length] = new Option(label, key, false, selected);
  }

  this.attachEventHandlers(field, element, ['change', 'keyup', 'blur']);

  return {
    formItem: formItem
  };
}