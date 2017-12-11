export const toQueryString = (obj) => {
  let arr = []
  for (let key in obj) {
    arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
  }
  return arr.join('&');
}

export const parseQueryString = (str) => {
  str = str.replace(/^\?/, '');
  let obj = {};
  if (str.indexOf('=') !== -1) {
    str
      .split('&')
      .forEach((query) => {
        if (isNaN(query.split('=')[1])) {
          obj[query.split('=')[0]] = query.split('=')[1];
        } else {
          obj[query.split('=')[0]] = Number(query.split('=')[1]);
        }
      });
  } else {
    return {};
  }
  return obj;
}

//sexify bitch function \_^-^_/

export const prettyPrint = (obj) => {
  if (typeof obj !== 'object') {
    return obj
  }
  const arr = [];
  for (let key in obj) {
    arr.push("\n" + key[0].toUpperCase() + key.slice(1) + ": " + prettyPrint(obj[key]));
  }
  return arr.join(' ') + "\n";
}

export const clone = (obj) => {
  const o = {};
  for (let key in obj) {
    if (typeof obj[key] === 'object') {
      if (Array.isArray(obj[key])) {
        o[key] = [];
        obj[key].forEach((value) => o[key].push(clone(value)));
      } else {
        o[key] = clone(obj[key]);
      }
    } else {
      o[key] = obj[key];
    }
  }
  return o;
}