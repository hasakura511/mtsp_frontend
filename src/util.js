export const toQueryString = obj => {
  let arr = [];
  for (let key in obj) {
    arr.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
  }
  return arr.join("&");
};

export const parseQueryString = str => {
  str = str.replace(/^\?/, "");
  let obj = {};
  if (str.indexOf("=") !== -1) {
    str.split("&").forEach(query => {
      if (isNaN(query.split("=")[1])) {
        obj[query.split("=")[0]] = query.split("=")[1];
      } else {
        obj[query.split("=")[0]] = Number(query.split("=")[1]);
      }
    });
  } else {
    return {};
  }
  return obj;
};

//sexify bitch function \_^-^_/

export const prettyPrint = obj => {
  if (typeof obj !== "object") {
    return obj;
  }
  const arr = [];
  for (let key in obj) {
    arr.push(
      "\n" + key[0].toUpperCase() + key.slice(1) + ": " + prettyPrint(obj[key])
    );
  }
  return arr.join(" ") + "\n";
};

export const clone = obj => {
  const o = {};
  for (let key in obj) {
    if (typeof obj[key] === "object") {
      if (Array.isArray(obj[key])) {
        o[key] = [];
        obj[key].forEach(value => o[key].push(clone(value)));
      } else if (obj[key] instanceof RegExp) {
        o[key] = new RegExp(obj[key]);
      } else {
        o[key] = clone(obj[key]);
      }
    } else {
      o[key] = obj[key];
    }
  }
  return o;
};

export const toCamel = str =>
  str.replace(/(_|\-)[a-z]/g, $1 => $1.toUpperCase().replace(/_|\-/, ""));

export const toUnderScore = str =>
  str
    .replace(/[a-z][A-Z]/g, $1 => $1[0] + "_" + $1[1].toLowerCase())
    .replace("fx", "FX");

export const andify = arr => {
  let str = arr.slice(0, -1).join(", ");
  if (arr.length > 1) {
    str += " and " + arr[arr.length - 1];
  } else {
    str += arr[0];
  }
  return str;
};

export const keysToCamel = obj => {
  const o = {};
  Object.keys(obj).forEach(key => {
    o[toCamel(key)] = obj[key];
  });
  return o;
};

export const checkValidity = (value, rules) => {
  let isValid = true;

  if (rules.required) {
    isValid = value.trim() !== "" && isValid;
  }

  if (rules.minLength) {
    isValid = value.trim().length >= rules.minLength && isValid;
  }

  if (rules.maxLength) {
    isValid = value.trim().length <= rules.maxLength && isValid;
  }

  if (rules.pattern) {
    isValid = rules.pattern.test(value.trim()) && isValid;
  }

  return isValid;
};
