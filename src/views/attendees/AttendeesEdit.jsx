// /*!
//  * Edit Ceremony Record
//  * File: CeremonyEdit.js
//  * Copyright(c) 2023 BC Gov
//  * MIT Licensed
//  */

// import { useState } from "react";
// import { useAPI } from "@/providers/api.provider.jsx";
// import { useNavigate, useParams } from "react-router-dom";

// import { useStatus } from "@/providers/status.provider.jsx";
// import { useUser } from "@/providers/user.provider.jsx";

// import validate, { validators } from "@/services/validation.services.js";

// import PageHeader from "@/components/common/PageHeader.jsx";
// import FormContext from "@/components/common/FormContext";

// //Fieldsets
// import CeremonyDetailsInput from "@/views/ceremonies/fieldsets/CeremonyDetailsInput.jsx";
// import AddressInput from "@/views/recipients/fieldsets/AddressInput.jsx";

// /**
//  * Inherited model component
//  */

// export default function AttendeesEdit({ selectedRecipients }) {
//   const status = useStatus();
//   const api = useAPI();
//   const user = useUser();
//   const { role } = user || {};
//   const navigate = useNavigate();
//   const { id } = useParams() || {};

//   const [submitted, setSubmitted] = useState(false);

//   // create new registration
//   const _handleDelete = async (id) => {
//     try {
//       const [error, result] = await api.removeCeremony(id);
//       if (error)
//         status.setMessage({
//           message: "Error: Could Not Delete Ceremony Record",
//           severity: "danger",
//         });
//       else
//         status.setMessage({
//           message: "Ceremony Record Deleted!",
//           severity: "success",
//         });
//       if (!error && result) return result;
//     } catch (error) {
//       status.clear();
//       status.setMessage({
//         message: "Error: Could Not Create New Ceremony Record",
//         severity: "danger",
//       });
//     }
//   };

//   // save registration data
//   const _handleSave = async (data) => {
//     console.log("Save:", data);
//     try {
//       status.setMessage("save");
//       const [error, result] = await api.saveAttendee(data);
//       if (error) status.setMessage("saveError");
//       else status.setMessage("saveSuccess");
//       if (!error && result) {
//         setSubmitted(true);
//         return result;
//       }
//     } catch (error) {
//       status.setMessage("saveError");
//     }
//   };

//   // cancel edits
//   const _handleCancel = async () => {
//     navigate("/attendees");
//   };

//   // set default ceremony form values
//   // const defaults = {
//   //   ceremony_address: {
//   //     pobox: "",
//   //     street1: "",
//   //     street2: "",
//   //     postal_code: "",
//   //     community: "",
//   //     province: "British Columbia",
//   //     country: "Canada",
//   //   },
//   // };

//   // define recipient fieldset validation checks
//   // const fieldsetValidators = {
//   //   ceremonyAddress: (data) => {
//   //     const { contact } = data || {};
//   //     const { personal_address } = contact || {};
//   //     return (
//   //       validate(
//   //         [{ key: "personal_phone", validators: [validators.phone] }],
//   //         contact
//   //       ) &&
//   //       validate(
//   //         [
//   //           { key: "street1", validators: [validators.required] },
//   //           { key: "community", validators: [validators.required] },
//   //           { key: "province", validators: [validators.required] },
//   //           {
//   //             key: "postal_code",
//   //             validators: [validators.required, validators.postal_code],
//   //           },
//   //         ],
//   //         personal_address
//   //       )
//   //     );
//   //   },
//   //   confirmation: (data) => {
//   //     return true;
//   //   },
//   // };

//   // loader for ceremony record data
//   const _loader = async () => {
//     const { result } = (await api.getAttendee(id)) || {};
//     return result;
//   };

//   return (
//     <>
//       <PageHeader heading="Create Attendee" />
//       <FormContext
//         // defaults={defaults}
//         loader={_loader}
//         save={_handleSave}
//         remove={_handleDelete}
//         cancel={_handleCancel}
//         blocked={false}
//         // validate={fieldsetValidators.confirmation}
//       >
//         <AttendeeDetailsInput selectedRecipients={selectedRecipients} />
//       </FormContext>
//     </>
//   );
// }

// /*!
//  * Attendees Edit fieldset component
//  * File: AwardEdit.js
//  * Copyright(c) 2023 BC Gov
//  * MIT Licensed
//  */

import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Panel } from "primereact/panel";
import classNames from "classnames";
import { Dropdown } from "primereact/dropdown";
import { useAPI } from "@/providers/api.provider.jsx";
import { format } from "date-fns";
import { MultiSelect } from "primereact/multiselect";
/**
 * Model data edit component
 * @returns {JSX.Element}
 */

export default function AttendeesEdit({
  selectedRecipients,
  selectedCeremony,
}) {
  selectedRecipients = selectedRecipients.map((r) => {
    Object.assign(r.contact, {
      full_name: `${r.contact.first_name} ${r.contact.last_name}`,
    });
    return r;
  });

  const api = useAPI();
  const { control } = useFormContext();
  const [ceremonies, setCeremonies] = useState([]);

  const [selectedRecipientsToBeAssigned, setSelectedRecipientsToBeAssigned] =
    useState(selectedRecipients);

  useEffect(() => {
    api
      .getCeremonies()
      .then((results) => {
        const { ceremonies } = results || {};
        ceremonies.forEach(
          (c) =>
            (c.datetime = format(new Date(c.datetime), "EEEE, MMMM dd, yyyy"))
        );
        setCeremonies(ceremonies);
      })
      .catch(console.error);
  }, []);

  return (
    <Panel className={"mb-3"} header={<>Ceremony</>}>
      <div className="container">
        <div className="grid">
          <div className={"col-12 form-field-container"}>
            <label htmlFor={"recipients"}>
              Selected Recipients Will be Assigned to Ceremony :
            </label>
            <Controller
              name={`recipients`}
              control={control}
              rules={{
                required: "Recipient is required.",
              }}
              defaultValue={selectedRecipientsToBeAssigned}
              render={({ field, fieldState: { invalid, error } }) => (
                <>
                  <MultiSelect
                    id={field.name}
                    key={field.name}
                    display="chip"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.value);
                    }}
                    options={selectedRecipients}
                    optionLabel="contact.full_name"
                    placeholder="Select a Recipient"
                  />
                  {invalid && <p className="error">{error.message}</p>}
                </>
              )}
            />
          </div>
          <div className={"col-12 form-field-container"}>
            <label htmlFor={"ceremony"}>Select Ceremony</label>
            <Controller
              name={`ceremony`}
              control={control}
              defaultValue={selectedCeremony ? selectedCeremony.id : ""}
              rules={{
                required: "Ceremony is required.",
              }}
              render={({ field, fieldState: { invalid, error } }) => (
                <>
                  <Dropdown
                    className={classNames({ "p-invalid": error })}
                    id={field.name}
                    optionLabel="datetime"
                    value={field.value || ""}
                    options={ceremonies}
                    optionValue="id"
                    onChange={(e) => {
                      field.onChange(e.value);
                    }}
                    aria-describedby={`ceremony-date-help`}
                    placeholder={"Select ceremony"}
                  />
                  {invalid && <p className="error">{error.message}</p>}
                </>
              )}
            />
          </div>
        </div>
      </div>
    </Panel>
  );
}
