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
  const { id, token } = useParams() || {};
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAttending, setIsAttending] = useState(
    JSON.parse(searchParams.get("accept"))
  );

  // define fieldset validation checks
  const fieldsetValidators = {
    confirmation: (data) => {
      const { confirmed } = data || {};
      console.log(data);
      return !!confirmed;
    },
  };

  const _handleSave = async (data) => {
    let sanitizedData = { ...data };
    let updatedStatusData = {};
    //if user confirmed attendance
    if (sanitizedData.attendance_confirmed) {
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
      updatedStatusData = {
        ...sanitizedData,
        status: "Attending",
      };
    } else {
      updatedStatusData = {
        ...sanitizedData,
        status: "Declined",
      };
    }

    console.log("Save:", updatedStatusData);

    try {
      status.setMessage("save");

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
        validate={fieldsetValidators.confirmation}
        defaults={defaults}
        blocked={false}
      >
        <RSVPAttendanceInput setIsAttending={setIsAttending} />
        {isAttending && <RSVPInviteeDetails />}
        {isAttending && <RSVPOptions />}
        {isAttending && <RSVPGuest />}
        {isAttending && (
          <RSVPConfirmationInput validate={fieldsetValidators.confirmation} />
        )}
      </RSVPForm>
    </>
  );
}
