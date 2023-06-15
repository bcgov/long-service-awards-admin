/*!
 * RSVP Confirmation Input fieldset component
 * File: RSVPConfirmationInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Fieldset } from "primereact/fieldset";
import { Checkbox } from "primereact/checkbox";
import { Panel } from "primereact/panel";
import { Message } from "primereact/message";
import { useEffect, useState } from "react";

/**
 * Registration confirmation input component.
 * @returns {JSX.Element},
 */

export default function RSVPConfirmationInput({ validate }) {
  // set local states
  const { control, getValues } = useFormContext();
  const [complete, setComplete] = useState(false);
  const isAttending =
    useWatch({ control, name: "attendance_confirmed" }) || null;
  // auto-validate fieldset
  useEffect(() => {
    setComplete(validate(getValues()) || false);
  }, [useWatch({ control })]);

  return (
    <Fieldset
      className={"mb-3"}
      legend={<>Notice of Collection, Consent, and Authorization</>}
    >
      <div className="container">
        {!complete && (
          <Message
            className={"w-full mb-3 mt-3"}
            severity="warn"
            text="Confirmation is required."
          />
        )}
        {complete && (
          <Message
            className={"w-full mb-3 mt-3"}
            severity="info"
            text="Thank you for confirmation."
          />
        )}
        <div className="grid">
          <div className="col-12 form-field-container">
            <Controller
              name="confirmed"
              control={control}
              defaultValue={isAttending}
              render={({ field, fieldState: { invalid, error } }) => (
                <>
                  <div className="flex align-items-center">
                    <Checkbox
                      id={field.name}
                      inputId={"registration-confirmation"}
                      checked={field.value}
                      aria-describedby={`service-confirmation-help`}
                      value={field.value}
                      className={"mr-1"}
                      onChange={(e) => {
                        field.onChange(e.checked);
                      }}
                    />
                    <label
                      className={"m-1"}
                      htmlFor={`registration-confirmation`}
                    >
                      I consent
                    </label>
                  </div>
                  <small>
                    By registering for a Long Service Award, you consent to your
                    personal information (name, years of service, ministry,
                    city, etc.) being disclosed to BC Public Service employees
                    (e.g. @Work Corporate Intranet, @Work Newsletter, reports,
                    Long Service Awards website, etc.). By attending the Long
                    Service Award ceremony, you may appear on camera. Personal
                    information including photos, videos and/or voice, and any
                    other information may be collected and used by the BC Public
                    Service Agency to support communications and engagement
                    within and on behalf of the BC Public Service. This personal
                    information will be accessed by BC Public Service employees
                    and may also be accessed by the public. This information is
                    being collected under the authority of section 26(c) of the
                    Freedom of Information and Protection of Privacy Act
                    (FOIPPA). Should you have any questions about the collection
                    or disclosure of this information, please contact Program
                    Manager, LongServiceAwards@gov.bc.ca, 1st floor - 563
                    Superior Street, Victoria BC, V8V 0C5, or by calling
                    1.877.277.0772.
                  </small>
                </>
              )}
            />
          </div>
        </div>
      </div>
    </Fieldset>
  );
}
