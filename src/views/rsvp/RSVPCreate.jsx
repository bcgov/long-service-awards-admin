/*!
 * RSVP Create fieldset component
 * File: RSVPCreate.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import FormContext from "@/components/common/FormContext";
import PageHeader from "@/components/common/PageHeader.jsx";
import { useAPI } from "@/providers/api.provider.jsx";
import { useStatus } from "@/providers/status.provider.jsx";
import RSVPConfirmationInput from "@/views/rsvp/fieldsets/RSVPConfirmationInput";
import RSVPGuest from "@/views/rsvp/fieldsets/RSVPGuest";
import RSVPInviteeDetails from "@/views/rsvp/fieldsets/RSVPInviteeDetails";
import RSVPOptions from "@/views/rsvp/fieldsets/RSVPOptions";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import RSVPAttendanceInput from "./fieldsets/RSVPAttendanceInput";
import RSVPForm from "./form/RSVPForm";

export default function RSVPCreate() {
  const status = useStatus();
  const api = useAPI();
  const navigate = useNavigate();
  const { id, token } = useParams() || {};
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAttending, setIsAttending] = useState(
    JSON.parse(searchParams.get("accept"))
  );

  // define fieldset validation checks
  const fieldsetValidators = {
    confirmation: (data) => {
      const { confirmed } = data || {};
      return !!confirmed;
    },
  };

  const _handleDelete = async (id) => {
    try {
      const [error, result] = await api.removeAttendee(id);
      if (error)
        status.setMessage({
          message: "Error: Could Not Delete Attendees Record",
          severity: "danger",
        });
      else
        status.setMessage({
          message: "Attendees Record Deleted!",
          severity: "success",
        });
      if (!error && result) return result;
    } catch (error) {
      status.clear();
      status.setMessage({
        message: "Error: Could Not Create New Attendees Record",
        severity: "danger",
      });
    }
  };

  const _handleSave = async (data) => {
    let sanitizedData = { ...data };
    //remove unchecked dietary options for recipient
    Object.keys(sanitizedData.accommodations).forEach((key) =>
      sanitizedData.accommodations[key] === undefined
        ? delete sanitizedData.accommodations[key]
        : {}
    );
    if (sanitizedData.guest_count) {
      //remove unchecked dietary options for guest
      Object.keys(sanitizedData.guest_accommodations).forEach((key) =>
        sanitizedData.guest_accommodations[key] === undefined
          ? delete sanitizedData.guest_accommodations[key]
          : {}
      );
    }
    const updatedStatusData = { ...sanitizedData, status: "Attending" };

    console.log("Save:", updatedStatusData);

    try {
      status.setMessage("save");
      if (updatedStatusData.accommodations) {
        for (const acc in updatedStatusData.accommodations) {
          if (updatedStatusData.accommodations[acc] === true) {
            await api.createSelection(
              {
                attendee: updatedStatusData.id,
                accommodation: acc,
              },
              id,
              token
            );
          }
        }
      }

      const [error, result] = await api.saveRSVP(updatedStatusData, id, token);

      if (error) status.setMessage("saveError");
      else status.setMessage("saveSuccess");

      if (!error && result) {
        return result;
      }
    } catch (error) {
      status.setMessage("saveError");
    }
  };

  // cancel edits
  const _handleCancel = async () => {
    navigate("/attendees");
  };

  // set default attendee form values
  const defaults = {
    recipients: [],
    ceremony: "",
  };

  // loader for Attendees record data
  const _loader = async () => {
    const result = (await api.getRSVP(id, token)) || {};
    Object.assign(result.recipient.contact, {
      full_name: `${result.recipient.contact.first_name} ${result.recipient.contact.last_name}`,
    });
    result.attendance_confirmed = isAttending;
    return result;
  };

  return (
    <>
      <PageHeader heading={"RSVP"} />
      <RSVPForm
        loader={_loader}
        save={_handleSave}
        remove={_handleDelete}
        cancel={_handleCancel}
        validate={fieldsetValidators.confirmation}
        defaults={defaults}
        blocked={false}
      >
        <RSVPAttendanceInput
          validate={fieldsetValidators.confirmation}
          setIsAttending={setIsAttending}
        />
        <RSVPInviteeDetails />
        <RSVPOptions />
        <RSVPGuest />
        <RSVPConfirmationInput validate={fieldsetValidators.confirmation} />
      </RSVPForm>
    </>
  );
}
