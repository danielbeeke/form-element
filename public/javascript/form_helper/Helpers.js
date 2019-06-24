export function index(obj, is, value) {
  if (typeof is == 'string')
    return index(obj, is.split('.'), value);
  else if (is.length === 1 && value !== undefined)
    return obj[is[0]] = value;
  else if (is.length === 0)
    return obj;
  else
    return index(obj[is[0]], is.slice(1), value);
}

export function each (iterable, callback) {
  let output = '';

  if (iterable instanceof Array) {
    iterable.forEach((item, index) => {
      output += callback(item, index);
    });

  }
  else if (iterable instanceof Object) {
    for (let [key, value] of Object.entries(iterable)) {
      output += callback(value, key);
    }
  }
  return output;
}

export function uniqueId () {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Generic debounce function.
 * We use it for constantly saving the project.
 *
 * @param func
 * @param wait
 * @param immediate
 * @returns {Function}
 */
export function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    let context = this, args = arguments;
    let later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

String.prototype.toKebabCase = function () {
  return this.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};