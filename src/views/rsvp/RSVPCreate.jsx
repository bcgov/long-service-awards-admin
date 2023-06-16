/*!
 * RSVP Create fieldset component
 * File: RSVPCreate.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import PageHeader from "@/components/common/PageHeader.jsx";
import { useAPI } from "@/providers/api.provider.jsx";
import { useStatus } from "@/providers/status.provider.jsx";
import RSVPConfirmationInput from "@/views/rsvp/fieldsets/RSVPConfirmationInput";
import RSVPGuest from "@/views/rsvp/fieldsets/RSVPGuest";
import RSVPInviteeDetails from "@/views/rsvp/fieldsets/RSVPInviteeDetails";
import RSVPOptions from "@/views/rsvp/fieldsets/RSVPOptions";
import { format } from "date-fns";
import { Fragment, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import RSVPAttendanceInput from "./fieldsets/RSVPAttendanceInput";
import RSVPForm from "./form/RSVPForm";
import { Dialog } from "primereact/dialog";

export default function RSVPCreate() {
  const status = useStatus();
  const api = useAPI();
  const { id, token } = useParams() || {};
  const [isBlocked, setIsBlocked] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [attendanceConfirmed, setAttendanceConfirmed] = useState(false);
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
        status: "attending",
      };
    } else {
      updatedStatusData = {
        ...sanitizedData,
        status: "declined",
      };
    }

    console.log("Save:", updatedStatusData);

    try {
      status.setMessage("save");

      const [error, result] = await api.saveRSVP(updatedStatusData, id, token);

      if (error) status.setMessage("saveError");
      else status.setMessage("saveSuccess");

      if (!error && result) {
        setIsBlocked(true);
        if (result.result.status === "declined") {
          setAttendanceConfirmed(false);
        } else {
          setAttendanceConfirmed(true);
        }
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
    const [error, result] = (await api.getRSVP(id, token)) || {};
    if (error) {
      setIsExpired(true);
    } else {
      Object.assign(result.recipient.contact, {
        full_name: `${result.recipient.contact.first_name} ${result.recipient.contact.last_name}`,
      });
      result.attendance_confirmed = isAttending;
      return result;
    }
  };

  return (
    <>
      <PageHeader heading={"RSVP"} />
      <Dialog
        visible={isBlocked}
        onHide={() => {}}
        showHeader={false}
        position="center"
        modal
        breakpoints={{ "960px": "80vw" }}
        style={{ width: "50vw" }}
      >
        <div>
          <div
            className="flex align-items-center justify-content-center"
            style={{ margin: "2rem 0" }}
          >
            <i
              className="pi pi-check"
              style={{
                color: "#9fdaa8",
                fontSize: "1.5rem",
                marginRight: "1rem",
              }}
            ></i>
            <h2>
              {attendanceConfirmed
                ? "Thank you for confirming your attendance!"
                : "Thank you for confirming you will not attend the Long Service Awards"}
            </h2>
          </div>
        </div>
      </Dialog>
      <Dialog
        visible={isExpired}
        onHide={() => {}}
        showHeader={false}
        position="center"
        modal
        breakpoints={{ "960px": "80vw" }}
        style={{ width: "50vw" }}
      >
        <div>
          <div
            className="flex align-items-center justify-content-center"
            style={{ margin: "2rem 0" }}
          >
            <i
              className="pi pi-exclamation-triangle"
              style={{
                color: "#e97984",
                fontSize: "1.5rem",
                marginRight: "1rem",
              }}
            ></i>
            <h2>Your invitation has expired. Please contact the support.</h2>
          </div>
        </div>
      </Dialog>
      <RSVPForm
        loader={_loader}
        save={_handleSave}
        validate={fieldsetValidators.confirmation}
        defaults={defaults}
        // blocked={}
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
