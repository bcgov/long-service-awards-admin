/*!
 * Error services/utilities
 * File: error.services.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

const errors = {
    invalidToken: { text: 'User token could not be verified.', type: 'danger' },
    invalidData: { text: 'Your form data is invalid or incomplete.', type: 'danger' },
    serverError: { text: 'Server Error: Your request could not be completed.', type: 'danger' },
    notAuthorized: { text: 'You are not authorized to access this screen.', type: 'danger' },
    notAuthenticated: { text: 'User is not authenticated.', type: 'danger' },
    loginError: { text: 'Login Error: Your user credentials are not valid.', type: 'danger' },
};

export default {

    /**
     * get enumerated error message by key
     * **/

    get: function get(key) {
        return errors[key] !== 'undefined' ? errors[key] : null;
    }

}
