/*!
 * Input data validation services/utilities (React)
 * File: validation.services.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

/**
 * Regular expression patterns for validation checks
 * **/

export const matchers = {
  employeeNumber: /^\d{6}$/i,
  govEmail: /^[A-Z0-9._%+-]+@(?:[A-Z0-9-]+\.)+[A-Z]{2,4}$/i,
  email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  phone: /^(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/,
  postal_code: /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i,
  guid: /^[0-9a-fA-F]{8}[0-9a-fA-F]{4}[0-9a-fA-F]{4}[0-9a-fA-F]{4}[0-9a-fA-F]{12}$/,
  alphanumeric: /^[a-z0-9]+$/i,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,}$/
}


export const validators = {

  /**
   * Validate required data
   * **/

  required: (data) => {
    return !!data && !!String(data);
  },

  /**
   * Validate employee number
   * **/

  employeeNumber: (data) => {
    return !data || !!String(data)
        .match(matchers.employeeNumber);
  },

  /**
   * Validate email address
   * Reference: https://stackoverflow.com/a/46181 (Retrieved Jan 18, 2022)
   * **/

  email: (data) => {
    return !data || !!String(data)
        .toLowerCase()
        .match(matchers.email);
  },

  /**
   * Validate phone number
   * Reference: https://stackoverflow.com/a/29767609 (Retrieved Jan 25, 2022)
   * Valid formats:
   (123) 456-7890
   (123)456-7890
   123-456-7890
   123.456.7890
   1234567890
   +31636363634
   075-63546725
   * **/

  phone: (data) => {
    return !data || !!String(data)
        .toLowerCase()
        .match(matchers.phone)
  },

  /**
   * Validates Canadian postal code
   * Reference: https://stackoverflow.com/a/46761018
   * ### ###
   * **/

  postal_code: (data) => {
    return !data || !!String(data)
        .toLowerCase()
        .match(matchers.postal_code);
  },

  /**
   * Validates password
   * Minimum ten characters, at least one uppercase letter, one lowercase letter, one number and one special character
   * **/

  password: (password) => {
    return password.match(matchers.password);
  }

}

/**
 * validate input data against schema
 * **/

const validate = function validate(fields, data) {
  return data && (fields || [])
      .filter(field => field.hasOwnProperty('validators'))
      .every(field => field.validators.every(validator => {
            // apply all associated field validators (defined in schema) to each field value
            const value = data && data.hasOwnProperty(field.key) ? data[field.key] : null;
            return validator(value);
          })
      );
}

/**
 * Utility to remove null property values from objects
 * - ignores filtered fields in input
 * - note recursion
 * **/

export const removeNull = (obj, ignore=[]) => {
  // ignore non-objects and arrays
  if (Array.isArray(obj) || typeof obj !== 'object') return obj;
  // remove null values from nested objects
  return Object.keys(obj || {})
      .reduce((o, key) => {
        // console.log(key, obj[key], obj[key] === {})
        if (obj[key] !== null && obj[key] !== undefined && obj[key] !== {})
          o[key] = removeNull(obj[key]);
        return o;
      }, {});
};

/**
 * convert timestamp to JS standard Date class
 *
 * @param date
 * @return {Object} [error, response]
 */

export const convertDate = (date) => {
  if (date instanceof Date) return date;
  // parse single date stored in UTC needed on frontend
  return date ? new Date(date.replace(' ', 'T')) : null;
}

export default validate;


