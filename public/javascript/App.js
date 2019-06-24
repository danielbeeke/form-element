import {FormHelper} from './form_helper/FormHelper.js';

class App {
  constructor () {
    this.data = {
      name: 'Henk',
      surname: 'Jansen',
      isSuperman: true,
      awesomeness: 32,
      skills: ['car', 'hero'],
      mail: 'super@men.com'
    };

    this.element = document.querySelector('.app');

    this.element.appendChild(FormHelper.create({
      'name': {
        nodeType: 'div',
        classList: ['form-row'],
        children: {
          'name': {
            label: 'Voornaam',
            type: 'text',
          },
          'surname': {
            label: 'Achternaam',
            type: 'text',
          }
        }
      },
      'mail': {
        label: 'Mail',
        type: 'email'
      },
      'isSuperman': {
        label: 'Is superman',
        type: 'checkbox',
      },
      'awesomeness': {
        label: 'Awesomeness',
        type: 'number',
        max: 35,
        visible: () => this.data.isSuperman
      },
      'skills': {
        label: 'Skills',
        nodeType: 'select',
        multiple: true,
        options: {
          car: 'Driving',
          music: 'Music',
          hero: 'Saving the world'
        },
        visible: () => this.data.isSuperman
      }
    }, this.data));
  }
}

new App();