/*!
 * Create Invitation Record
 * File: InvitationCreate.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import FormContext from "@/components/common/FormContext";
import PageHeader from "@/components/common/PageHeader.jsx";
import { useAPI } from "@/providers/api.provider.jsx";
import { useStatus } from "@/providers/status.provider.jsx";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

//Fieldsets
import InvitationInput from "@/views/invitations/fieldsets/InvitationInput";

export default function InvitationCreate({ selected, setShowRSVPDialog }) {
  const status = useStatus();
  const api = useAPI();
  const navigate = useNavigate();

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
    const updatedStatusData = data.recipients.map((rec) => {
      const recipient = { ...rec, status: "invited" };
      Object.assign(recipient.ceremony, {
        ...recipient.ceremony,
        datetime_formatted: `${format(
          new Date(recipient.ceremony.datetime),
          `p 'on' EEEE, MMMM dd, yyyy`
        )}`,
      });

      return recipient;
    });

    try {
      updatedStatusData.forEach(async (a) => {
        status.setMessage("save");
        const [error, result] = await api.saveAttendee(a);
        const sendResult = await api.sendRSVP(a);
        if (error) status.setMessage("saveError");
        else if (!sendResult || sendResult.message !== "success")
          status.setMessage("mailError");
        if (!error && result && sendResult) {
          setShowRSVPDialog(false);
          status.setMessage("mailSuccess");
          return result;
        }
      });
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
    recipients: selected,
  };

  // loader for Attendees record data
  const _loader = async () => {};

  return (
    <>
      <PageHeader heading={"Send RSVP"} />
      <FormContext
        loader={_loader}
        save={_handleSave}
        remove={_handleDelete}
        cancel={_handleCancel}
        defaults={defaults}
        blocked={false}
        buttonText={"Send"}
        header={"Send Invitation"}
      >
        <InvitationInput selected={selected} />
      </FormContext>
    </>
  );
}
