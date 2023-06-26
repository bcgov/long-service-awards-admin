/*!
 * LSA.Admin.Providers.Authenticate
 * File: auth.providers.js
 * Copyright(c) 2023 Government of British Columbia
 * Version 2.0
 * MIT Licensed
 */

import { useContext, useState, createContext, useEffect } from "react";
import api from "../services/api.services.js";
import { useStatus } from "@/providers/status.provider.jsx";

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
  const { setLoading } = useStatus();
  const status = useStatus();

  /**
   * Check user auth status on mount
   *
   * @public
   *
   */

  useEffect(() => {
    console.log(window.location.href);
    api
      .get("/auth/user")
      .then(([error, res]) => {
        const { result } = res || {};
        if (error && !window.location.href.includes("/rsvp"))
          status.setMessage("authenticate");
        setData(result);
      })
      .finally(() => {});
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
    setLoading(true);
    return await api
      .post("/login", credentials)
      .then(([error, response]) => {
        const { message, result } = response || {};
        if (error) status.setMessage("loginError");
        else status.setMessage(message);
        setData(result);
        return !!result;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * User logout request
   *
   * @public
   */

  const logout = async () => {
    setLoading(true);
    return await api
      .post("/logout", {})
      .then(([error, response]) => {
        const { message, result } = response || {};
        if (error) status.setMessage(error);
        else status.setMessage(message);
        setData(result);
        return !!result;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * User registration request
   */

  const register = async (data) => {
    setLoading(true);
    return await api
      .post("/users/register", data)
      .then(([error, response]) => {
        const { result } = response || {};
        if (error) status.setMessage("registerError");
        else status.setMessage("register");
        return !!result;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   * Request password reset link
   */

  const requestPasswordReset = async (data) => {
    const [_, res] = await api.post("request-reset-password", data);
    const { result } = res || {};
    return result;
  };

  /**
   * Reset password
   */

  const resetPassword = async (id, token, data) => {
    const [_, res] = await api.post(`reset-password/${id}/${token}`, data);
    const { result } = res || {};
    return result;
  };

  /**
   * Validate user token
   */

  const validateToken = async (id, token) => {
    const [_, res] = await api.get(`validate/${id}/${token}`, data);
    const { error, result } = res || {};
    return !error && !!result;
  };

  /**
   * Get user permissions list data
   *
   * @param {String} id
   */

  const getPermissions = async (id = null) => {
    return id
      ? await api.get(`permissions/${id}`)
      : await api.get(`permissions`);
  };

  /**
   * Update user permissions for requested role
   */

  const updatePermissions = async (id, permissions) => {
    return api.post(`permissions/update/${id}`, { permissions: permissions });
  };

  /**
   * Get global settings as list
   *
   */

  const getSettings = async () => {
    const [_, res] = await api.get(`settings/global/list`);
    const { result } = res || {};
    return result;
  };

  /**
   * Get global setting
   *
   */

  const getSetting = async (id) => {
    const [_, res] = await api.get(`settings/global/${id}`);
    const { result } = res || {};
    return result;
  };

  /**
   * Create new global setting
   */

  const createSetting = async (data) => {
    return await api.post(`settings/global/create`, data);
  };

  /**
   * Update global setting
   */

  const updateSetting = async (data) => {
    const { name } = data || {};
    return await api.post(`settings/global/update/${name}`, data);
  };

  /**
   * Delete global setting
   */

  const deleteSetting = async (id) => {
    const [_, res] = api.get(`settings/delete/${id}`);
    const { result } = res || {};
    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        data,
        authorize,
        login,
        logout,
        register,
        requestPasswordReset,
        resetPassword,
        validateToken,
        getPermissions,
        createSetting,
        updateSetting,
        getSettings,
        getSetting,
        deleteSetting,
        updatePermissions,
      }}
      {...props}
    />
  );
}

const useAuth = () => useContext(AuthContext);
export { useAuth, AuthProvider };
