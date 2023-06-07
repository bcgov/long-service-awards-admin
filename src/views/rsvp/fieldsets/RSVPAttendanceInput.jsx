/*!
 * RSVP Attendance Confirmation Input fieldset component
 * File: RSVPConfirmationInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { Checkbox } from "primereact/checkbox";
import { Fieldset } from "primereact/fieldset";
import { Message } from "primereact/message";
import { useEffect, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

export default function RSVPAttendanceInput({ validate, setIsAttending }) {
  // set local states
  const { control, getValues } = useFormContext();
  const [complete, setComplete] = useState(false);
  //   const attending = useWatch({ control, name: "attendance-confirmed" });

  // auto-validate fieldset
  useEffect(() => {
    setComplete(validate(getValues()) || false);
  }, [useWatch({ control })]);

  return (
    <Fieldset className={"mb-3"} legend={<>Attendance Confirmation</>}>
      <div className="container">
        <div className="grid">
          <div className="col-12 form-field-container">
            <Controller
              name="attendance_confirmed"
              control={control}
              render={({ field, fieldState: { invalid, error } }) => {
                console.log(field.value);
                return (
                  <>
                    <div className="flex align-items-center">
                      <Checkbox
                        id={field.name}
                        inputId={"attendance-confirmation"}
                        checked={field.value || false}
                        aria-describedby={`attendance-confirmation-help`}
                        value={field.value || false}
                        className={"mr-1"}
                        onChange={(e) => {
                          field.onChange(e.checked);
                          setIsAttending(field.value);
                        }}
                      />
                      <label
                        className={"m-1"}
                        htmlFor={`attendance-confirmation`}
                      >
                        I will be attending the ceremony
                      </label>
                    </div>
                  </>
                );
              }}
            />
          </div>
        </div>
      </div>
    </Fieldset>
  );
}
