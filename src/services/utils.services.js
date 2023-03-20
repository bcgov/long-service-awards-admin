/*!
 * Data services/utilities
 * File: utils.services.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */


  /**
   * Format string as phone number
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

export const convertPhone = (value) => {
    // return nothing if no value
    if (!value) return value;
    // only allows 0-9 inputs
    const currentValue = value.replace(/[^\d]/g, '');
    // returns: "(xxx) xxx-", (xxx) xxx-x", "(xxx) xxx-xx", "(xxx) xxx-xxx", "(xxx) xxx-xxxx"
    return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`;
  };

/**
 * Format dates for display
 * **/

export const formatDate = (value) => {
    const date = new Date(value)
    return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
