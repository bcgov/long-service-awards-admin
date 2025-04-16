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
      .filter((key) => params[key] != null)
      .map((key) => key + "=" + params[key])
      .join("&");
  };

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
  };

  /**
   *  Get all users.
   *
   * */

  const getUsers = async () => {
    const [_, res] = await api.get(`/users/list/`);
    const { result } = res || {};
    return result;
  };

  /**
   * Update user record
   *
   * */

  const saveUser = async (data) => {
    const { id } = data || {};
    return await api.post(`/users/update/${id}`, data);
  };

  /**
   * Delete user record
   *
   * */

  const removeUser = async (id) => {
    return await api.get(`/users/delete/${id}`);
  };

  /**
   * Get user roles
   *
   * */

  const getUserRoles = async () => {
    const [_, res] = await api.get(`/users/roles/list`);
    const { result } = res || {};
    return result;
  };

  /**
   *  Get recipient record
   *
   * */

  const getRecipient = async (id) => {
    const [_, result] = await api.get(`/recipients/admin/view/${id}`);
    return result;
  };

  /**
   *  Register recipient (creates registration stub)
   *
   * */

  const createRecipient = async () => {
    return await api.post(`/recipients/admin/create`, {});
  };

  /**
   * Update registration for current user
   *
   * */

  const saveRecipient = async (data) => {
    const { id } = data || {};
    return await api.post(`/recipients/admin/update/${id}`, data);
  };

  /**
   * Get list of recipients
   *
   * */

  const getRecipients = async (params) => {
    const [_, res] = await api.get(
      `/recipients/admin/list?${formatQueryParams(params)}`
    );
    const { result } = res || {};
    return result;
  };

  /**
   * Get recipient stats
   *
   * */

  const getRecipientStats = async () => {
    const [_, res] = await api.get(`/recipients/admin/stats`);
    const { result } = res || {};
    return result;
  };

  /**
   * Delete recipient record
   * @param {String} id
   * */

  const removeRecipient = async (id) => {
    return await api.get(`/recipients/admin/delete/${id}`);
  };

  /**
   * Get attendees
   *
   */

  const getAttendees = async (params) => {
    const [_, res] = await api.get(
      `/attendees/list?${formatQueryParams(params)}`
    );
    const result = res || [];
    return result;
  };

  /**
   * Create attendee record
   *
   */

  const createAttendee = async (data) => {
    return await api.post(`/attendees/create`, data);
  };

  /**
   * Create guest record
   *
   */

  const createGuest = async (data) => {
    const { id } = data || {};
    return await api.post(`/attendees/addguest/${id}`, data);
  };

  /**
   * Get single attendee record
   *
   */

  const getAttendee = async (id) => {
    const [_, result] = await api.get(`/attendees/view/${id}`);
    return result;
  };

  /**
   * Save single attendee record
   *
   */

  const saveAttendee = async (data) => {
    const { id } = data || {};
    return await api.post(`/attendees/update/${id}`, data);
  };

  /**
   * Remove single attendee record
   *
   */

  const removeAttendee = async (id) => {
    const [_, result] = await api.get(`/attendees/delete/${id}`);
    return result;
  };

  /**
   * Send RSVP
   */
  const sendRSVP = async (recipients) => {
    const [_, result] = await api.post("/attendees/send", recipients);
    return result;
  };

  /**
   * Send Reminder
   */
  const sendReminder = async (recipient) => {
    const [_, result] = await api.post("/attendees/reminder", recipient);
    return result;
  };

  /**
   * Get RSVP
   */
  const getRSVP = async (id, token) => {
    return await api.get(`/rsvp/${id}/${token}`);
  };

  const saveRSVP = async (data, id, token) => {
    return await api.post(`/rsvp/${id}/${token}`, data);
  };

  /**
   * Get accommodations
   *
   */

  const getRSVPAccommodations = async () => {
    const [_, res] = await api.get(`/rsvp/accommodations/list`);
    const result = res || {};
    return result;
  };

  /**
   * Get accommodations (Admin)
   *
   */

  const getAccommodations = async () => {
    const [_, res] = await api.get(`/accommodations/list`);
    const result = res || {};
    return result;
  };

  /**
   * Get ceremonies
   *
   */

  const getCeremonies = async () => {
    const [_, res] = await api.get(`/ceremonies/list`);
    const { result } = res || {};
    return result.ceremonies;
  };

  /**
   * Create ceremony record
   *
   */

  const createCeremony = async (data) => {
    return await api.post(`/ceremonies/create`, data);
  };

  /**
   * Get single ceremony record
   *
   */

  const getCeremony = async (id) => {
    const [_, result] = await api.get(`/ceremonies/view/${id}`);
    return result;
  };

  /**
   * Remove single ceremony record
   *
   */

  const removeCeremony = async (id) => {
    const [_, result] = await api.get(`/ceremonies/delete/${id}`);
    return result;
  };

  /**
   * Save single ceremony record
   *
   */

  const saveCeremony = async (data) => {
    const { id } = data || {};
    return await api.post(`/ceremonies/update/${id}`, data);
  };

  /**
   *  Get awards
   *
   * */

  const getAwards = async () => {
    const [_, res] = await api.get(`/awards/list`);
    const { result } = res || {};
    return result;
  };

  /**
   *  Get active awards
   *
   * */

  const getActiveAwards = async () => {
    const [_, res] = await api.get(`/awards/filter/active/true`);
    const { result } = res || {};
    return result;
  };

  /**
   *  Get award by ID
   *
   * */

  const getAward = async (id) => {
    const [_, res] = await api.get(`/awards/view/${id}`);
    const { result } = res || {};
    return result;
  };

  /**
   *  Create new award
   *
   * */

  const createAward = async (data) => {
    return await api.post(`/awards/create`, data);
  };

  /**
   * Update award record
   *
   * */

  const saveAward = async (data) => {
    const { id } = data || {};
    return await api.post(`/awards/update/${id}`, data);
  };

  /**
   * Delete award record
   *
   * */

  const removeAward = async (id) => {
    return await api.get(`/awards/delete/${id}`);
  };

  /**
   *  Get milestones
   *
   * */

  const getMilestones = async () => {
    const [_, res] = await api.get(`/settings/milestones/list`);
    const { result } = res || {};
    return result;
  };

  /**
   *  Get qualifying years
   *
   * */

  const getQualifyingYears = async () => {
    const [_, res] = await api.get(`/settings/qualifying_years/list`);
    const { result } = res || {};
    return result;
  };

  /**
   * Get list of participating ministries and agencies (includes inactive organizations)
   * - not filtered
   *
   * */

  const getOrganizations = async () => {
    const [_, res] = await api.get(`settings/organizations/list`);
    const { result } = res || {};
    return result;
  };

  /**
   * Get list of participating ministries and agencies (includes inactive organizations)
   * - list is filtered for ministry contacts
   *
   * */

  const getOrganizationsUser = async () => {
    const [_, res] = await api.get(`settings/organizations/list/user`);
    const { result } = res || {};
    return result;
  };

  /**
   * Get list of active participating ministries and agencies (filtered by active)
   *
   * */

  const getActiveOrganizations = async () => {
    const [_, res] = await api.get(`settings/organizations/filter/active/true`);
    const { result } = res || {};
    return result;
  };

  /**
   *  Get org by ID
   *
   * */

  const getOrganization = async (id) => {
    const [_, res] = await api.get(`settings/organizations/view/${id}`);
    const { result } = res || {};
    return result;
  };

  /**
   *  Create new org
   *
   * */

  const createOrganization = async (data) => {
    return await api.post(`/settings/organizations/create`, data);
  };

  /**
   * Update org record
   *
   * */

  const saveOrganization = async (data) => {
    const { id } = data || {};
    return await api.post(`/settings/organizations/update/${id}`, data);
  };

  /**
   * Delete org record
   *
   * */

  const removeOrganization = async (id) => {
    return await api.get(`/settings/organizations/delete/${id}`);
  };

  /**
   * Get list of BC communities
   *
   * */

  const getCommunities = async () => {
    const [_, res] = await api.get(`settings/communities/list`);
    const { result } = res || {};
    return result;
  };

  /**
   * Get list of provinces
   *
   * */

  const getProvinces = async () => {
    const [_, res] = await api.get(`settings/provinces/list`);
    const { result } = res || {};
    return result;
  };

  /**
   * Get list of PECSF charities
   *
   * */

  const getPecsfCharities = async () => {
    const [_, res] = await api.get(`settings/pecsf-charities/list`);
    const { result } = res || {};
    return result;
  };

  /**
   * Get list of active PECSF charities
   *
   * */

  const getActivePECSFCharities = async () => {
    const [_, res] = await api.get(
      `settings/pecsf-charities/filter/active/true`
    );
    const { result } = res || {};
    return result;
  };

  /**
   * Get list of pooled PECSF charities
   *
   * */

  const getPooledPecsfCharities = async () => {
    const [_, res] = await api.get(
      `settings/pecsf-charities/filter/pooled/true`
    );
    const { result } = res || {};
    return result;
  };

  /**
   * Get PECSF charity by ID
   *
   * */

  const getPecsfCharity = async (id) => {
    const [_, res] = await api.get(`settings/pecsf-charities/view/${id}`);
    const { result } = res || {};
    return result;
  };

  /**
   * Get list of PECSF regions
   *
   * */

  const getPecsfRegions = async () => {
    const [_, res] = await api.get(`settings/pecsf-regions/list`);
    const { result } = res || {};
    return result;
  };

  /**
   * Send templated mail message
   * @param {String} templateID
   * @param {Object} data
   * */

  const sendMail = async (templateID, data) => {
    return await api.post(`mail/send/${templateID}`, data);
  };

  /**
   * Get report data as file download
   *
   * */

  const getReport = async (id, filename, year) => {
    const [_, res] = await api.download(`reports/${id}`, filename, year);
    const { result } = res || {};
    return result;
  };

  /**
   *  Checks if editing is active for non-admin user roles
   *
   * */

  const getEditingActive = async () => {
    const [error, result] = await api.get(
      `/settings/global/nonadmin-editing-active`
    );
    if (error) {
      console.log("Editing setting error. May not exist.");
      return false;
    }
    const { value } = result.result || {};
    return value === "true";
  };

  /**
   *
   * LSA-517 Easier way of retrieving the current cycle year
   *
   */

  const getCurrentCycle = async () => {
    const [error, result] = await api.get(`/settings/global/cycle`);
    if (error) {
      console.log("Cycle setting error. May not exist.");
      return new Date().getFullYear();
    }
    const { value } = result.result || {};

    return value;
  };

  const migrateRecipients = async (from, to) => {
    const [error, result] = await api.get(
      `/recipients/admin/migrate/${from}/${to}`
    );
    if (error) {
      console.log("Migrate error: ", error);
    }

    return [error, result];
  };

  return (
    <APIContext.Provider
      value={useMemo(
        () => ({
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
          getCeremonies,
          getCeremony,
          createCeremony,
          saveCeremony,
          removeCeremony,
          getAttendees,
          getAttendee,
          createAttendee,
          createGuest,
          saveAttendee,
          removeAttendee,
          sendRSVP,
          sendReminder,
          getRSVP,
          saveRSVP,
          getMilestones,
          getQualifyingYears,
          getOrganizations,
          getOrganizationsUser,
          getActiveOrganizations,
          getOrganization,
          createOrganization,
          saveOrganization,
          removeOrganization,
          getProvinces,
          getCommunities,
          getAwards,
          getActiveAwards,
          getAward,
          createAward,
          saveAward,
          removeAward,
          getAccommodations,
          getRSVPAccommodations,
          getPecsfCharities,
          getActivePECSFCharities,
          getPooledPecsfCharities,
          getPecsfCharity,
          getPecsfRegions,
          sendMail,
          getReport,
          getEditingActive,
          getCurrentCycle,
          migrateRecipients,
        }),
        []
      )}
      {...props}
    />
  );
}

const useAPI = () => useContext(APIContext);
export { useAPI, APIProvider };
