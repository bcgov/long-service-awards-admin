/*!
 * RSVP Create fieldset component
 * File: RSVPCreate.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { useState } from "react";
import { useAPI } from "@/providers/api.provider.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { useStatus } from "@/providers/status.provider.jsx";
import { useUser } from "@/providers/user.provider.jsx";
import PageHeader from "@/components/common/PageHeader.jsx";
import FormContext from "@/components/common/FormContext";
import RSVPInviteeDetails from "@/views/rsvp/fieldsets/RSVPInviteeDetails";
import RSVPOptions from "@/views/rsvp/fieldsets/RSVPOptions";
import RSVPRetiring from "@/views/rsvp/fieldsets/RSVPRetiring";
import RSVPGuest from "@/views/rsvp/fieldsets/RSVPGuest";

//Fieldsets

/**
 * Inherited model component
 */

export default function RSVPCreate() {
  const status = useStatus();
  const api = useAPI();
  const user = useUser();
  const navigate = useNavigate();
  const { id } = useParams() || {};

  const [submitted, setSubmitted] = useState(false);

  // create new registration
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

  // save registration data
  const _handleSave = async (data) => {
    let sanitizedData = { ...data };
    //remove unchecked dietary options
    Object.keys(sanitizedData.dietary_requirements).forEach((key) =>
      sanitizedData.dietary_requirements[key] === undefined
        ? delete sanitizedData.dietary_requirements[key]
        : {}
    );
    console.log("Save:", sanitizedData);

    // try {
    //   status.setMessage("save");
    //   const [error, result] = await api.saveAttendee(data);
    //   console.log("Saved:", result);
    //   if (error) status.setMessage("saveError");
    //   else status.setMessage("saveSuccess");
    //   if (!error && result) {
    //     setSubmitted(true);
    //     return result;
    //   }
    // } catch (error) {
    //   status.setMessage("saveError");
    // }
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
    const result = (await api.getAttendee(id)) || {};
    Object.assign(result.recipient.contact, {
      full_name: `${result.recipient.contact.first_name} ${result.recipient.contact.last_name}`,
    });
    return result;
  };

  return (
    <>
      <PageHeader heading={"RSVP"} />
      <FormContext
        loader={_loader}
        save={_handleSave}
        remove={_handleDelete}
        cancel={_handleCancel}
        defaults={defaults}
        blocked={false}
        header="Confirm attendance"
        buttonText="RSVP: I WILL BE ATTENDING THE CEREMONY"
      >
        <RSVPInviteeDetails />
        <RSVPOptions />
        <RSVPRetiring />
        <RSVPGuest />
      </FormContext>
    </>
  );
}
