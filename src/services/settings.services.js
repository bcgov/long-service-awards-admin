/*!
 * Settings services/utilities (React)
 * File: settings.services.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import validate, {validators} from "@/services/validation.services.js";

const schemaData = {
  milestones: [
    { value: 5, text: "5 years" },
    { value: 10, text: "10 years" },
    { value: 15, text: "15 years" },
    { value: 20, text: "20 years" },
    { value: 25, text: "25 years" },
    { value: 30, text: "30 years" },
    { value: 35, text: "35 years" },
    { value: 40, text: "40 years" },
    { value: 45, text: "45 years" },
    { value: 50, text: "50 years" },
  ],
  delegatedFormFields: [
    { key: "employee", label: "Employee" },
    { key: "first_name", label: "First Name", validators: [validators.required] },
    { key: "last_name", label: "Last Name", validators: [validators.required] },
    { key: "office_email", label: "Government Email", validators: [validators.required, validators.email] },
    { key: "employee_number", label: "Employee Number", validators: [validators.required] },
    { key: "organization", label: "Ministry / Organization", validators: [validators.required]},
    { key: "service_years", label: "Current Years of Service", validators: [validators.required] },
    { key: "milestone", label: "Current Milestone", validators: [validators.required] },
    { key: "qualifying_year", label: "Milestone Qualifying Year", validators: [validators.required] },
    { key: "prior_milestones", label: "Prior Unclaimed Milestones" },
  ],
  messages: [
    {
      value: "register",
      text: {
        severity: "success",
        summary: "Registration Successful!",
        detail: "Thank you! Your registration have been submitted and you will be notified once it has been approved.",
        sticky: true,
        closable: true,
      },
    },
    {
      value: "save",
      text: {
        severity: "info",
        summary: "Submitting...",
        detail: "Submitting form data. Please Wait.",
        sticky: true,
        closable: true,
        life: 5000
      },
    },
    {
      value: "create",
      text: {
        severity: "info",
        summary: "Creating...",
        detail: "Creating a new record. Please Wait.",
        sticky: true,
        closable: false,
        life: 5000
      },
    },
    {
      value: "delete",
      text: {
        severity: "success",
        summary: "Record Deleted",
        detail: "The requested record was removed.",
        life: 3000
      },
    },
    {
      value: "registerError",
      text: {
        severity: "warn",
        summary: "Registration Failed",
        detail: "Your registration details may be invalid.",
        sticky: true,
        closable: true
      },
    },
    {
      value: "deleteError",
      text: {
        severity: "danger",
        summary: "Record Deletion Error",
        detail: "The requested record could not be removed.",
        closable: true,
        sticky: true,
      },
    },
    {
      value: "createSuccess",
      text: {
        severity: "success",
        summary: "Success!",
        detail: "Record is now ready to for updates.",
        closable: true,
        life: 1000,
      },
    },
    {
      value: "createError",
      text: {
        severity: "error",
        summary: "Record could not be created.",
        detail:
            "There was an error in processing your request. If issues persist, please contact support",
        closable: true,
        sticky: true,
      },
    },
    {
      value: "loginError",
      text: {
        severity: "error",
        summary: "User authentication failed",
        detail:
            "Authentication failed. Please check your login credentials.",
        closable: true,
        sticky: true,
      },
    },
    {
      value: "saveError",
      text: {
        severity: "error",
        summary: "Error! Save Failed",
        detail:
            "There was an error in processing your request. If issues persist, please contact support",
        sticky: true,
      },
    },

    {
      value: "saveSuccess",
      text: {
        severity: "success",
        summary: "Success!",
        detail: "Record Updated!",
        life: 1000,
      }
    },
    {
      value: "confirmAward",
      text: {
        severity: "success",
        summary: "Award Selected!",
        detail: "Award options confirmed.",
        life: 3000
      },
    },
  ]
};

export default {

  /**
   * get enumerated data by key
   * **/

  get: function get(key) {
    return schemaData[key] !== "undefined" ? schemaData[key] : null;
  },

  /**
   * get a copy of the schema data
   * **/

  copy: function copy(key, value, idKey='key') {
    if (typeof schemaData[key] === "undefined") return null;
    const found = schemaData[key].find((item) => item[idKey] === value);
    return found ? Object.assign({}, found) : null;
  },

  /**
   * get enumerated data by key
   * **/

  lookup: function lookup(key, value) {
    if (schemaData[key] === "undefined") return null;
    const found = schemaData[key].filter((item) => item.value === value);
    return found.length > 0 ? found[0].text : null;
  },

  /**
   * Sort array of objects alphanumerically
   */

  sort: function sort(arr, field) {
      return arr.sort((a, b) => {
        if (a.hasOwnProperty(field) && b.hasOwnProperty(field)) {
          return a[field] < b[field] ? -1 : 1;
        }
        return 0;
      })
    }
};
