/*!
 * Attendees Edit fieldset component
 * File: AwardEdit.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { useAPI } from "@/providers/api.provider.jsx";
import { format } from "date-fns";
import { Chip } from "primereact/chip";
import { Panel } from "primereact/panel";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

/**
 * Model data edit component
 * @returns {JSX.Element}
 */

export default function InvitationInput({ selected }) {
  selected.map((a) =>
    Object.assign(a.recipient.contact, {
      full_name: `${a.recipient.contact.first_name} ${a.recipient.contact.last_name}`,
    })
  );
  console.log(selected);

  const { control } = useFormContext();
  const api = useAPI();
  const [ceremonies, setCeremonies] = useState([]);

  // useEffect(() => {
  //   api
  //     .getCeremonies()
  //     .then((results) => {
  //       const { ceremonies } = results || {};
  //       ceremonies.forEach(
  //         (c) =>
  //           (c.datetime = format(new Date(c.datetime), "EEEE, MMMM dd, yyyy"))
  //       );
  //       setCeremonies(ceremonies);
  //     })
  //     .catch(console.error);
  // }, []);

  return (
    <Panel className={"mb-3"} header={<> Send RSVP to selected Attendees :</>}>
      <div className="container">
        <div className="grid">
          <div className={"col-12 form-field-container"}>
            <Controller
              name={`recipients`}
              control={control}
              rules={{
                required: "Recipient is required.",
              }}
              render={({ field, fieldState: { invalid, error } }) => (
                <>
                  <div className="flex">
                    {selected.map((a) => (
                      <Chip
                        label={a.recipient.contact.full_name}
                        style={{ width: "max-content", margin: "2px" }}
                        key={a.recipient.contact.full_name}
                      />
                    ))}
                  </div>
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
