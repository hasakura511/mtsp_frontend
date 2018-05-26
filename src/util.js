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
  if (obj === null) {
    return null;
  }
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

export const clean = obj => {
  const o = {};
  Object.keys(obj).forEach(key => {
    if (obj[key]) {
      o[key] = obj[key];
    }
  });
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

/**
 * @function toIntegerDate
 * @param {string} str of format yyyy/mm/dd
 * @returns integer with digits as yyyymmdd
 * @description toIntegerDate converts / saperated string date to integral value
 */
export const toIntegerDate = str => {
  return Number(str.replace(/\//g, "")) || 20180101;
};

export const BUG_MESSAGE = `Erroroneous code, please report this bug to us.`;

export const toWordedDate = integerDate => {
  const strDate = integerDate.toString();
  const localeDateString =
    strDate.slice(4, 6) + "/" + strDate.slice(6, 8) + "/" + strDate.slice(0, 4);
  return new Date(localeDateString).toDateString();
};

export const toStringDate = integerDate => {
  const strDate = integerDate.toString();
  return [
    "'" + strDate.slice(2, 4),
    strDate.slice(4, 6),
    strDate.slice(6, 8)
  ].join(".");
};

export const toSlashDate = integerDate => {
  if (!integerDate) {
    return undefined;
  }
  const strDate = integerDate.toString();
  return [strDate.slice(0, 4), strDate.slice(4, 6), strDate.slice(6, 8)].join(
    "/"
  );
};

export const toSlashTime = integerDate => {
  if (!integerDate) {
    return undefined;
  }
  const strDate = integerDate.toString();
  //alert(strDate)
  return [strDate.slice(0, 4), strDate.slice(4, 6), strDate.slice(6, 8)].join(
    "/"
  );
};

export const getAbbrevation = name => {
  // console.log(name);
  switch (name) {
    case "antiHighEq":
      return "AHE";
    default:
      return name;
  }
};
export const promiseSerial = factoryFunctions =>
  factoryFunctions.reduce(
    (acc, func) =>
      acc.then(all => func().then(result => [].concat(all, result))),
    Promise.resolve([])
  );

export const promiseSer = async factoryFunctions => {
  const results = [];
  await factoryFunctions.forEach(async func => {
    await func().then(res => results.push(res));
  });
  return results;
};

export const uniq = arr => {
  const o = {};
  for (let elem in arr) {
    o[arr[elem]] = true;
  }
  return Object.keys(o);
};


export const businessDaysFromDate = (date,businessDays) => {
  var counter = 0, tmp = new Date(date);
  while( businessDays>=0 ) {
    tmp.setTime( date.getTime() + counter * 86400000 );
    if(isBusinessDay (tmp)) {
      --businessDays;
    }
    ++counter;
  }
  return tmp;
}

export const isBusinessDay = (date) => {
  var dayOfWeek = date.getDay();
  if(dayOfWeek === 0 || dayOfWeek === 6) {
    // Weekend
    return false;
  }

  var holidays = [
    '12/31+5', // New Year's Day on a saturday celebrated on previous friday
    '1/1',     // New Year's Day
    '1/2+1',   // New Year's Day on a sunday celebrated on next monday
    '1-3/1',   // Birthday of Martin Luther King, third Monday in January
    '2-3/1',   // Washington's Birthday, third Monday in February
    '5~1/1',   // Memorial Day, last Monday in May
    '7/3+5',   // Independence Day
    '7/4',     // Independence Day
    '7/5+1',   // Independence Day
    '9-1/1',   // Labor Day, first Monday in September
    '10-2/1',  // Columbus Day, second Monday in October
    '11/10+5', // Veterans Day
    '11/11',   // Veterans Day
    '11/12+1', // Veterans Day
    '11-4/4',  // Thanksgiving Day, fourth Thursday in November
    '12/24+5', // Christmas Day
    '12/25',   // Christmas Day
    '12/26+1',  // Christmas Day
  ];

  var dayOfMonth = date.getDate(),
  month = date.getMonth() + 1,
  monthDay = month + '/' + dayOfMonth;

  if(holidays.indexOf(monthDay)>-1){
    return false;
  }

  var monthDayDay = monthDay + '+' + dayOfWeek;
  if(holidays.indexOf(monthDayDay)>-1){
    return false;
  }

  var weekOfMonth = Math.floor((dayOfMonth - 1) / 7) + 1,
      monthWeekDay = month + '-' + weekOfMonth + '/' + dayOfWeek;
  if(holidays.indexOf(monthWeekDay)>-1){
    return false;
  }

  var lastDayOfMonth = new Date(date);
  lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
  lastDayOfMonth.setDate(0);
  var negWeekOfMonth = Math.floor((lastDayOfMonth.getDate() - dayOfMonth - 1) / 7) + 1,
      monthNegWeekDay = month + '~' + negWeekOfMonth + '/' + dayOfWeek;
  if(holidays.indexOf(monthNegWeekDay)>-1){
    return false;
  }

  return true;
}
export const getNextBusinessDate = d => {
  d.setDate(d.getDate()+1); // tomorrow
  if (d.getDay()==0) d.setDate(d.getDate()+1);
  else if (d.getDay()==6) d.setDate(d.getDate()+2);
  return d;
}

export const getOffsetDate = (offset) => {
  //var date=new Date();
  var date=new Date(2018, 1, 1, 17, 0, 0, 0);

  date=businessDaysFromDate(date, offset);

  var day = date.getDate().toString();
  if (day.length == 1)
    day = "0" + day;
  var monthIndex = date.getMonth() + 1;
  monthIndex=monthIndex.toString();
  if (monthIndex.length == 1)
    monthIndex="0" + monthIndex;
  var year = date.getFullYear();
  var datestr=year.toString()+monthIndex.toString()+day.toString();
  return datestr;
}

export const getOffsetSlashDate = (offset) => {
  return toSlashDate(getOffsetDate(offset));
}

export const getDemoPnL = (offset) => {
  var obj={
    position: "off"
  };
  var x=offset;
  if ( x > 6)
    x=6;
  for (var i=0; i < x; i++) {
    obj[getOffsetDate(i)] = { change:0 };
  }
  return obj;

}

export const getDemoProfitObj = (offset, performance, position) => {
  console.log(offset);
  console.log(performance);
  console.log(position);
  
  var obj={

    position: position
  };
  var x=offset;
  if ( x > 6)
    x=6;
  for (var i=0; i < x; i++) {
    console.log(getOffsetDate(i))
    obj[getOffsetDate(i)] = {
      change: Number(
        performance.pnlData.find(pnlObj => pnlObj.date === getOffsetDate(i))[
          "change"
        ]
      )
    }   
  }
  console.log('pnl received:');
  console.log(obj);
  return obj;
}