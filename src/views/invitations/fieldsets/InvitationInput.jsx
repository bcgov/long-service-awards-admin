/*!
 * Attendees Edit fieldset component
 * File: AwardEdit.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { Chip } from "primereact/chip";
import { Panel } from "primereact/panel";
import { Controller, useFormContext } from "react-hook-form";

/**
 * Model data edit component
 * @returns {JSX.Element}
 */

export default function InvitationInput({ selected, header }) {
  selected.map((a) =>
    Object.assign(a.recipient.contact, {
      full_name: `${a.recipient.contact.first_name} ${a.recipient.contact.last_name}`,
    })
  );
  const { control } = useFormContext();

  /* LSA-510 Popup is used by both RSVP and Reminders. Default header is for RSVP */ 
  const heading = header || "Send RSVP to selected Attendees :";

  return (
    <Panel className={"mb-3"} header={<> {heading} </>}>
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
                  <div className="flex flex-wrap">
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
