import _ from 'lodash';

export const getTimezone = () => {
  let timezone_offset_min = new Date().getTimezoneOffset(),
    offset_hrs = parseInt(Math.abs(timezone_offset_min/60)),
    offset_min = Math.abs(timezone_offset_min%60),
    timezone_standard;

  if(offset_hrs < 10)
    offset_hrs = '0' + offset_hrs;

  if(offset_min < 10)
    offset_min = '0' + offset_min;

  // Add an opposite sign to the offset
  // If offset is 0, it means timezone is UTC
  if(timezone_offset_min < 0)
    timezone_standard = 'GMT +' + offset_hrs + ':' + offset_min;
  else if(timezone_offset_min > 0)
    timezone_standard = 'GMT -' + offset_hrs + ':' + offset_min;
  else if(timezone_offset_min == 0)
    timezone_standard = 'GMT';

  // Timezone difference in hours and minutes
  // String such as +5:30 GMT or -6:00 GMT or GMT
  return timezone_standard;
}

// number formatter
export const formatNumber = (amount, decimalCount = 2, decimal = ".", thousands = ",") => {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    let j = (i.length > 3) ? i.length % 3 : 0;

    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
  } catch (e) {
    console.log(e)
  }
};

export const difference = (object, base) => {
	function changes(object, base) {
		return _.transform(object, function(result, value, key) {
			if (!_.isEqual(value, base[key])) {
				result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
			}
		});
	}
	return changes(object, base);
}