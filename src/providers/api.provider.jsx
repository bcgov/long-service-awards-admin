/*!
 * LSA.Admin.Providers.API
 * File: api.providers.js
 * Copyright(c) 2023 Government of British Columbia
 * Version 2.0
 * MIT Licensed
 */

import { useContext, createContext, useMemo } from "react";
import api from "../services/api.services.js";

/**
 * Global authentication context.
 *
 * @public
 */

const APIContext = createContext({});

/**
 * Provider component to allow consuming components to subscribe to
 * authentication context changes.
 *
 * @public
 * @param {Object} props
 */

function APIProvider(props) {


    /**
     * Format query object as query string
     * - note: recursion
     *
     * @param {Object} params
     * @return {String} query string
     * */

    const formatQueryParams = (params) => {
        return Object.keys(params || {})
            .filter(key => params[key] != null)
            .map(key => key + '=' + params[key]).join('&');
    }

    /**
     * Services component to allow consuming components to subscribe to
     * API request handlers.
     *
     * @public
     * @param {Object} props
     */

    /**
     *  Gets current user info.
     *
     * */

    const getUser = async (id) => {
        const [_, result] = await api.get(`/users/view/${id}`);
        return result;
    }

    /**
     *  Get all users.
     *
     * */

    const getUsers = async () => {
        const [_, res] = await api.get(`/users/list/`);
        const {result} = res || {};
        return result;
    }

    /**
     * Update user record
     *
     * */

    const saveUser = async (data) => {
        const {id} = data || {};
        return await api.post(`/users/update/${id}`, data);
    }

    /**
     * Delete user record
     *
     * */

    const removeUser = async (id) => {
        return await api.get(`/users/delete/${id}`);
    }

    /**
     * Get user roles
     *
     * */

    const getUserRoles = async () => {
        const [_, res] = await api.get(`/users/roles/list`);
        const {result} = res || {};
        return result;
    }

    /**
     *  Get recipient record
     *
     * */

    const getRecipient = async (id) => {
        const [_, result] = await api.get(`/recipients/admin/view/${id}`);
        return result;
    }

    /**
     *  Register recipient (creates registration stub)
     *
     * */

    const createRecipient = async () => {
        return await api.post(`/recipients/admin/create`, {});
    }

    /**
     * Update registration for current user
     *
     * */

    const saveRecipient = async (data) => {
        const {id} = data || {};
        return await api.post(`/recipients/admin/update/${id}`, data);
    }

    /**
     * Get list of recipients
     *
     * */

    const getRecipients = async (params) => {
        const [_, res] = await api.get(`/recipients/admin/list?${formatQueryParams(params)}`);
        const {result} = res || {};
        return result;
    }

    /**
     * Get recipient stats
     *
     * */

    const getRecipientStats = async () => {
        const [_, res] = await api.get(`/recipients/admin/stats`);
        const {result} = res || {};
        return result;
    }

    /**
     * Delete recipient record
     * @param {String} id
     * */

    const removeRecipient = async (id) => {
        const [_, result] = await api.get(`/recipients/admin/delete/${id}`);
        return result;
    }

    /**
     *  Get awards
     *
     * */

    const getAwards = async () => {
        const [_, res] = await api.get(`/awards/list`)
        const {result} = res || {};
        return result;
    }

    /**
     *  Get award by ID
     *
     * */

    const getAward = async (id) => {
        const [_, res] = await api.get(`/awards/view/${id}`)
        const {result} = res || {};
        return result;
    }

    /**
     * Update award record
     *
     * */

    const saveAward = async (data) => {
        const {id} = data || {};
        return await api.post(`/awards/update/${id}`, data);
    }

    /**
     * Delete award record
     *
     * */

    const removeAward = async (data) => {
        const {id} = data || {};
        return await api.get(`/awards/delete/${id}`, data);
    }

    /**
     *  Get milestones
     *
     * */

    const getMilestones = async () => {
        const [_, res] = await api.get(`/settings/milestones/list`);
        const {result} = res || {};
        return result;
    }

    /**
     *  Get qualifying years
     *
     * */

    const getQualifyingYears = async () => {
        const [_, res] = await api.get(`/settings/qualifying_years/list`);
        const {result} = res || {};
        return result;
    }

    /**
     * Get list of participating ministries and agencies (filtered by user settings)
     *
     * */

    const getOrganizations = async () => {
        const [_, res] = await api.get(`settings/organizations/list/user`);
        const {result} = res || {};
        return result;
    }

    /**
     * Get list of BC communities
     *
     * */

    const getCommunities = async () => {
        const [_, res] = await api.get(`settings/communities/list`);
        const {result} = res || {};
        return result;
    }

    /**
     * Get list of provinces
     *
     * */

    const getProvinces = async () => {
        const [_, res] = await api.get(`settings/provinces/list`);
        const {result} = res || {};
        return result;
    }

    /**
     * Get list of PECSF charities
     *
     * */

    const getPecsfCharities = async () => {
        const [_, res] = await api.get(`settings/pecsf-charities/list`);
        const {result} = res || {};
        return result;
    }

    /**
     * Get list of PECSF regions
     *
     * */

    const getPecsfRegions = async () => {
        const [_, res] = await api.get(`settings/pecsf-regions/list`);
        const {result} = res || {};
        return result;
    }

    /**
     * Get model schema
     *
     * */

    const getSchema = async (model) => {
        const [_, res] = await api.get(`settings/${model}/schema`);
        const {result} = res || {};
        return result;
    }

    return (
        <APIContext.Provider value={
            useMemo(() => ({
                getUser,
                getUsers,
                saveUser,
                removeUser,
                getUserRoles,
                getRecipients,
                getRecipient,
                getRecipientStats,
                createRecipient,
                saveRecipient,
                removeRecipient,
                getMilestones,
                getQualifyingYears,
                getOrganizations,
                getProvinces,
                getCommunities,
                getAwards,
                getAward,
                saveAward,
                removeAward,
                getPecsfCharities,
                getPecsfRegions,
                getSchema
            }), [])} {...props} />
    )

}

const useAPI = () => useContext(APIContext);
export {useAPI, APIProvider};