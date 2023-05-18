/*!
 * Address fieldset component
 * File: CeremonyInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import classNames from "classnames";
import { matchers } from "@/services/validation.services.js";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import { BlockUI } from "primereact/blockui";
import { AutoComplete } from "primereact/autocomplete";
import { useAPI } from "@/providers/api.provider.jsx";
import { Fieldset } from "primereact/fieldset";
import { convertDate } from "@/services/validation.services.js";
import { Chip } from "primereact/chip";
import { format } from "date-fns";

/**
 * Address Input reusable component. Conditional PO Box requirement for Victoria addresses.
 * @returns address line 1, address line 2, city/community, province/state, country, postal code, po box
 */

export default function RSVPInviteeDetails() {
  const api = useAPI();
  const { control, setValue, getValues } = useFormContext();

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
              render={({ field, fieldState: { invalid, error } }) => (
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
                              new Date(field.value),
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
