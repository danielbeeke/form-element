import {uniqueId, index, debounce} from './Helpers.js';
import {div} from './fields/div.js';
import {generic} from './fields/generic.js';
import {input_checkbox} from './fields/input_checkbox.js';
import {input_checkboxes} from './fields/input_checkboxes.js';
import {input_number} from './fields/input_number.js';
import {input_radio} from './fields/input_radio.js';
import {input_radios} from './fields/input_radios.js';
import {input_text} from './fields/input_text.js';
import {select} from './fields/select.js';

export class FormHelper extends HTMLFormElement {

  constructor() {
    super();
    this.prepareMethods = {
      div: div,
      generic: generic,
      input_checkbox: input_checkbox,
      input_checkboxes: input_checkboxes,
      input_number: input_number,
      input_radio: input_radio,
      input_radios: input_radios,
      input_text: input_text,
      select: select
    };
    this.visibilityCallbacks = [];
    this.debouncedUpdate = debounce(() => {
      this.update();
    }, 100);
  }

  static create (schema, data, options = {}) {
    let formElement = document.createElement('form', { is: 'form-helper'});
    formElement.schema = schema;
    formElement.data = data;
    formElement.prepareMethods = Object.assign(formElement.prepareMethods, options.prepareMethods);
    return formElement;
  }

  connectedCallback () {
    for (let [fieldKey, field] of Object.entries(this.schema)) {
      this.createField(fieldKey, field, this);
    }
    this.addEventListener('submit', (event) => {
      event.preventDefault();
    });
    this.update();
  }

  createField (fieldKey, field, parent) {
    if (!field.name) { field.name = fieldKey }
    if (!field.id) field.id = field.name ? field.name : uniqueId();
    if (field.type && !field.nodeType) { field.nodeType = 'input'}
    let fieldType = field.nodeType ? field.nodeType : 'div';
    if (field.nodeType === 'input') {
      fieldType = 'input';
      if (field.type) {
        fieldType += '_' + field.type;
      }
    }

    let fieldData = false;
    if (!this.prepareMethods[fieldType]) {
      console.warn(`Missing prepare method for ${fieldType}, falling back on generic`);
      fieldType = 'generic';
    }

    if (this.prepareMethods[fieldType]) {
      fieldData = this.prepareMethods[fieldType].call(this, fieldKey, field, parent);
    }

    if (field.children && fieldData && fieldData.formItem) {
      for (let [subKey, subField] of Object.entries(field.children)) {
        this.createField(subKey, subField, fieldData.formItem);
      }
    }

    if (typeof field.visible === 'function') {
      this.visibilityCallbacks.push({
        field: fieldData.formItem,
        callback: field.visible
      });
    }
  }

  update () {
    this.visibilityCallbacks.forEach(item => {
      let addOrRemove = item.callback() ? 'remove' : 'add';
      item.field.classList[addOrRemove]('hidden');
    })
  };

  /**
   * Helpers used inside the prepare methods.
   */

  createFormItem (field, parent) {
    let fieldType = field.nodeType && field.nodeType !== 'input' ? field.nodeType : (field.type ? field.type : '');
    let formItem = document.createElement('div');
    if (fieldType) formItem.classList.add('form-item-' + fieldType);
    formItem.classList.add('form-item-' + field.id.toKebabCase());
    formItem.classList.add('form-item');
    parent.appendChild(formItem);
    return formItem;
  }

  createLabel (field, formItem, className = 'field-label') {
    if (!field.label) { return }
    let label = document.createElement('label');
    label.innerText = field.label;
    label.classList.add(className);
    label.setAttribute('for', field.id);
    formItem.appendChild(label);
  }

  attachEventHandlers (field, element, handlers = [], callback = false) {
    if (!callback) {
      callback = () => {
        index(this.data, field.name, element.value);
        this.debouncedUpdate();
        this.dispatchEvent(new CustomEvent('change'));
      };
    }

    handlers.forEach(handler => {
      element.addEventListener(handler, callback);
    });
  }

  createInput (field, parent) {
    let input = document.createElement('input');
    for (let [key, value] of Object.entries(field)) {
      if (!['label', 'nodeType', 'children', 'options'].includes(key) && key in input) {
        input[key] = value;
      }
    }

    parent.appendChild(input);
    input.value = index(this.data, field.name);
    return input;
  }
}

customElements.define('form-helper', FormHelper,{extends: 'form'});
