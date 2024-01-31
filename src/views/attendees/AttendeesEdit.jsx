/*!
 * Edit / Create Attendees Record
 * File: AttendeesEdit.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import FormContext from "@/components/common/FormContext";
import PageHeader from "@/components/common/PageHeader.jsx";
import { useAPI } from "@/providers/api.provider.jsx";
import { useStatus } from "@/providers/status.provider.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { Fragment, useState } from "react";

//Fieldsets
import AttendeesEditInput from "@/views/attendees/fieldsets/AttendeesEditInput";

export default function AttendeesEdit({ isEditing, selectedRecipients }) {
  const status = useStatus();
  const api = useAPI();
  const navigate = useNavigate();
  const { id } = useParams() || {};
  const [selectedRecipient, setSelectedRecipient] = useState({});

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
    let { accommodations, ...updatedStatusData } = data;
    //check if accommodations contains a value of false or undefined and remove it
    accommodations = Object.keys(accommodations).reduce((acc, cur) => {
      if (accommodations[cur]) acc[cur] = true;
      return acc;
    }, {});

    updatedStatusData = {
      ...updatedStatusData,
      status: data.status.toLowerCase(),
      accommodation_selections: [accommodations],
    };
    console.log("Save:", updatedStatusData);
    try {
      status.setMessage("save");
      const [error, result] = await api.saveAttendee(updatedStatusData);
      console.log("Saved:", result);
      if (error) status.setMessage("saveError");
      else status.setMessage("saveSuccess");
      if (!error && result) {
        return result;
      }
    } catch (error) {
      status.setMessage("saveError");
      console.log(error);
    }
  };

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
    result.accommodations = result.accommodations
      .map((a) => a.accommodation)
      .reduce((acc, cur) => {
        acc[cur] = true;
        return acc;
      }, {});
    setSelectedRecipient(result);
    return result;
  };

  return (
    <Fragment>
      <PageHeader
        heading={
          isEditing
            ? `Editing ${selectedRecipient.guest === 1 ? "Guest" : "Attendee"}`
            : "Create Attendees"
        }
      />
      <FormContext
        loader={_loader}
        save={_handleSave}
        remove={_handleDelete}
        cancel={_handleCancel}
        defaults={defaults}
        blocked={false}
        header={isEditing ? "Save Attendee" : "Create Attendee"}
      >
        <AttendeesEditInput
          isEditing={isEditing}
          selectedRecipients={selectedRecipients}
        />
      </FormContext>
    </Fragment>
  );
}
