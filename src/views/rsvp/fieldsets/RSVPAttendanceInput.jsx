/*!
 * RSVP Attendance Confirmation Input fieldset component
 * File: RSVPConfirmationInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { Checkbox } from "primereact/checkbox";
import { Fieldset } from "primereact/fieldset";
import { Fragment, useEffect, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

export default function RSVPAttendanceInput({ setIsAttending }) {
  const { control } = useFormContext();

  return (
    <Fieldset className={"mb-3"} legend={<>Attendance Confirmation</>}>
      <div className="container">
        <div className="grid">
          <div className="col-12 form-field-container">
            <Controller
              name="attendance_confirmed"
              control={control}
              render={({ field, fieldState: { invalid, error } }) => {
                return (
                  <Fragment>
                    <div className="flex align-items-center">
                      <Checkbox
                        inputId={"attendance_declined"}
                        value={false}
                        onChange={(e) => {
                          field.onChange(false);
                          setIsAttending(false);
                        }}
                        checked={field.value === false}
                        className={"mr-1"}
                      />
                      <label className={"m-1"} htmlFor={"attendance_declined"}>
                        I will NOT be attending the ceremony
                      </label>
                    </div>
                    <div className="flex align-items-center">
                      <Checkbox
                        inputId={"attendance_accepted"}
                        value={true}
                        onChange={(e) => {
                          field.onChange(true);
                          setIsAttending(true);
                        }}
                        checked={field.value === true}
                        className={"mr-1"}
                      />
                      <label className={"m-1"} htmlFor={"attendance_accepted"}>
                        I WILL be attending the ceremony
                      </label>
                    </div>
                  </Fragment>
                );
              }}
            />
          </div>
        </div>
      </div>
    </Fieldset>
  );
}
