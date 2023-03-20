/*!
 * LSA.Admin.Providers.Authenticate
 * File: auth.providers.js
 * Copyright(c) 2023 Government of British Columbia
 * Version 2.0
 * MIT Licensed
 */

import {useContext, useState, createContext, useEffect} from "react";
import api from "../services/api.services.js";
import {useStatus} from "@/providers/status.provider.jsx";

/**
 * Global authentication context.
 *
 * @public
 */

const AuthContext = createContext({});

/**
 * Provider component to allow consuming components to subscribe to
 * authentication context changes.
 *
 * @public
 * @param {Object} props
 */

function AuthProvider(props) {

    let [data, setData] = useState(null);
    const {setLoading} = useStatus();
    const status = useStatus();

    /**
     * Check user auth status on mount
     *
     * @public
     *
     */

    useEffect(() => {
        api.get('/auth/user')
            .then(([error, res]) => {
                const {result} = res || {};
                if (error) status.setMessage('authenticate')
                setData(result);
            }).finally(() => {})
    }, []);

    /**
     * Authorize user by role.
     * @param {Array} authorizedRoles
     * @return {boolean} authorization
     * @src public
     */

    const authorize = (authorizedRoles) => {
        const { role } = data || {};
        return authorizedRoles.includes(role.name);
    };

    /**
     * User login request.
     *
     * @public
     *
     */

    const login = async (credentials) => {
        setLoading(true)
        return await api.post('/login', credentials)
            .then(([error, response]) => {
                const { message, result } = response || {};
                if (error) status.setMessage('loginError');
                else status.setMessage(message);
                setData(result);
                return !!result;
            }).finally(() => {
                setLoading(false);
            });
    }

    /**
     * User logout request
     *
     * @public
     */

    const logout = async () => {
        setLoading(true)
        return await api.post('/logout', {})
            .then(([error, response]) => {
                const { message, result } = response || {};
                if (error) status.setMessage(error)
                else status.setMessage(message);
                setData(result);
                return !!result;
            }).finally(() => {
                setLoading(false);
            });
    }

    /**
     * User registration request
     */

    const register = async (data) => {
        setLoading(true)
        return await api.post('/users/register', data)
            .then(([error, response]) => {
                const { result } = response || {};
                if (error) status.setMessage('registerError')
                else status.setMessage('register');
                //setData(result);
                return !!result;
            }).finally(() => {
                setLoading(false);
            });
    }

    /**
     * Request password reset link
     */

    const requestPasswordReset = async (route, data) => {
        return api.post(route, data);
    }

    /**
     * Reset password
     */

    const resetPassword = async (data) => {
        return api.post(`reset-password`, data);
    }

    /**
     * Get user permissions list data
     *
     * @param {String} id
     */

    const getPermissions = async (id=null) => {
        return id ? await api.get(`permissions/${id}`) : await api.get(`permissions`);
    }

    /**
     * Update user permissions for requested role
     */

    const updatePermissions = async (id, permissions) => {
        return api.put(`permissions/update/${id}`, { permissions: permissions });
    }

    /**
     * Get global settings list data
     *
     */

    const getSettings = async () => {
        return await api.get(`options`);
    }

    /**
     * Create new global setting for requested role
     */

    const createSetting = async (data) => {
        return await api.put(`options/create`, data);
    }

    /**
     * Update global settings for requested role
     */

    const updateSetting = async (key, value) => {
        return await api.put(`options/update/${key}`, value);
    }

    /**
     * Update global settings for requested role
     */

    const deleteSetting = async (id) => {
        return api.get(`options/delete/${id}`)
    }


    return (
        <AuthContext.Provider value={{
            data,
            authorize,
            login,
            logout,
            register,
            requestPasswordReset,
            resetPassword,
            getPermissions,
            createSetting,
            updateSetting,
            getSettings,
            deleteSetting,
            updatePermissions
        }} {...props} />
    )

}

const useAuth = () => useContext(AuthContext);
export {useAuth, AuthProvider};