/*!
 * RSVP Invitee Details fieldset component
 * File: RSVPInviteeDetails.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { format } from "date-fns";
import { Chip } from "primereact/chip";
import { Fieldset } from "primereact/fieldset";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Fragment } from "react";

export default function RSVPInviteeDetails() {
  const { control } = useFormContext();

  return (
    <Fieldset
      toggleable={false}
      className={"mb-3"}
      legend={<>Invitee Details</>}
    >
      <div className="container">
        <div className="grid">
          <div className={"col-12 form-field-container"}>
            <label
              htmlFor={`recipient.contact.full_name`}
              className="font-bold"
            >
              Invitee
            </label>
            <Controller
              name={`recipient.contact.full_name`}
              control={control}
              render={({ field }) => (
                <Chip
                  label={field.value}
                  style={{ width: "max-content" }}
                  className="mt-2"
                />
              )}
            />
          </div>
          <div className={"col-12 form-field-container"}>
            <label className={"m-1 font-bold"} htmlFor={`ceremony_date`}>
              Ceremony Date
            </label>
            <Controller
              name={`ceremony.datetime`}
              control={control}
              render={({ field, fieldState: { invalid, error } }) => {
                return (
                  <>
                    <Chip
                      label={
                        field.value
                          ? format(
                              new Date(
                                field.value.toLocaleString("en-US", {
                                  timeZone: "America/Vancouver",
                                })
                              ),
                              `p 'on' EEEE, MMMM dd, yyyy`
                            )
                          : ""
                      }
                      style={{ width: "max-content" }}
                      className="mt-2"
                    />

                    {invalid && <p className="error">{error.message}</p>}
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
