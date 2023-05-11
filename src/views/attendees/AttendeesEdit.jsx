/*!
 * Attendees Create parent component
 * File: AwardEdit.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */
/*!
 * Edit Attendees Record
 * File: AttendeesEdit.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */
import { useState } from "react";
import { useAPI } from "@/providers/api.provider.jsx";
import { useNavigate, useParams } from "react-router-dom";

import { useStatus } from "@/providers/status.provider.jsx";
import { useUser } from "@/providers/user.provider.jsx";

import validate, { validators } from "@/services/validation.services.js";

import PageHeader from "@/components/common/PageHeader.jsx";
import FormContext from "@/components/common/FormContext";

//Fieldsets
import AttendeesEditInput from "./AttendeesEditInput";

/**
 * Inherited model component
 */

export default function AttendeesEdit() {
  const status = useStatus();
  const api = useAPI();
  const user = useUser();
  const { role } = user || {};
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
    console.log("Save:", data);
    try {
      status.setMessage("save");
      const [error, result] = await api.saveAttendee(data);
      if (error) status.setMessage("saveError");
      else status.setMessage("saveSuccess");
      if (!error && result) {
        setSubmitted(true);
        return result;
      }
    } catch (error) {
      status.setMessage("saveError");
    }
  };

  // cancel edits
  const _handleCancel = async () => {
    navigate("/ceremonies");
  };

  // set default Attendees form values
  // const defaults = {
  //   venue: "",
  //   datetime: "",
  //   active: false,
  //   address: {
  //     pobox: "",
  //     street1: "",
  //     street2: "",
  //     postal_code: "",
  //     community: "",
  //     province: "British Columbia",
  //     country: "Canada",
  //   },
  // };

  // define recipient fieldset validation checks
  // const fieldsetValidators = {
  //   AttendeesAddress: (data) => {
  //     const { address } = data || {};
  //     return validate(
  //       [
  //         { key: "street1", validators: [validators.required] },
  //         { key: "community", validators: [validators.required] },
  //         { key: "province", validators: [validators.required] },
  //         {
  //           key: "postal_code",
  //           validators: [validators.required, validators.postal_code],
  //         },
  //       ],
  //       address
  //     );
  //   },
  // };

  // loader for Attendees record data
  const _loader = async () => {
    const result = (await api.getAttendee(id)) || {};
    return result;
  };

  return (
    <>
      <PageHeader heading="Create Attendees" />
      <FormContext
        loader={_loader}
        save={_handleSave}
        remove={_handleDelete}
        cancel={_handleCancel}
        // defaults={defaults}
        blocked={false}
        // validate={fieldsetValidators.AttendeesAddress}
      >
        <AttendeesEditInput />
      </FormContext>
    </>
  );
}
