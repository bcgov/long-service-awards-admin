/*!
 * Create Reminder Emails
 * File: InvitationReminder.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

/*
    LSA-510. New popup which allows for the sending of reminder emails
*/

import FormContext from "@/components/common/FormContext";
import PageHeader from "@/components/common/PageHeader.jsx";
import { useAPI } from "@/providers/api.provider.jsx";
import { useStatus } from "@/providers/status.provider.jsx";
import { format } from "date-fns";

//Fieldsets
import InvitationInput from "@/views/invitations/fieldsets/InvitationInput";

export default function InvitationReminder({
  selected,
  setShowRemindersDialog,
  callback,
}) {
  const status = useStatus();
  const api = useAPI();

  // save registration data
  const _handleSave = async (data) => {
    const updatedStatusData = data.recipients.map((rec) => {
      const recipient = { ...rec };
      
      Object.assign(recipient.ceremony, {
        ...recipient.ceremony,
        datetime_formatted: `${format(
          new Date(recipient.ceremony.datetime),
          `EEEE, MMMM dd, yyyy`
        )}`,
        ceremony_time: `${format(new Date(recipient.ceremony.datetime), `p`)}`,
      });
      return recipient;
    });

    try {
      updatedStatusData.forEach(async (a) => {
        
        const sendResult = await api.sendReminder(a);
        if (!sendResult || sendResult.message !== "success")
          status.setMessage("mailError");
        if ( sendResult) {
          setShowRemindersDialog(false);
          status.setMessage("mailSuccess");
          callback([]);
          return sendResult;
        }
        
      });
    } catch (error) {
      status.setMessage("saveError");
    }
  };

  // cancel edits
  const _handleCancel = async () => {
   
    setShowRemindersDialog(false);
  };

  // set default attendee form values
  const defaults = {
    recipients: selected,
  };

  // loader for Attendees record data
  const _loader = async () => {};

  return (
    <>
      <PageHeader heading={"Send Reminder Emails"} />
      <FormContext
        loader={_loader}
        save={_handleSave}
        remove={false}
        cancel={_handleCancel}
        defaults={defaults}
        blocked={false}
        buttonText={"Send"}
        header={"Send Reminder Emails"}
      >
        <InvitationInput selected={selected} header={"Send Reminders to selected Attendees :"} />
      </FormContext>
    </>
  );
}