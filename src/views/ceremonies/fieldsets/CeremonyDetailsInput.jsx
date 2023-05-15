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

/**
 * Address Input reusable component. Conditional PO Box requirement for Victoria addresses.
 * @returns address line 1, address line 2, city/community, province/state, country, postal code, po box
 */

export default function CeremonyDetailsInput({ id, label }) {
  const api = useAPI();
  const { control, setValue, getValues } = useFormContext();

  return (
    <Fieldset
      toggleable={false}
      className={"mb-3"}
      legend={<>{label} Ceremony Details</>}
    >
      <div className="container">
        <div className="grid">
          <div className={"col-12 form-field-container"}>
            <label htmlFor={`${id}.venue_name`}>Venue Name</label>
            <Controller
              name={`venue`}
              control={control}
              rules={{ required: "Venue name is required." }}
              render={({ field, fieldState: { invalid, error } }) => (
                <>
                  <InputText
                    id={field.venue}
                    value={field.value || ""}
                    maxLength={256}
                    aria-describedby={`${id}-venue_name-help`}
                    onChange={(e) => field.onChange(e.target.value)}
                    className={classNames({ "p-invalid": error })}
                    placeholder="Venue Name"
                  />
                  {invalid && <p className="error">{error.message}</p>}
                </>
              )}
            />
          </div>

          <div className={"col-12 form-field-container"}>
            <label className={"m-1"} htmlFor={`ceremony_date`}>
              Ceremony Date
            </label>
            <Controller
              name={`datetime`}
              control={control}
              render={({ field, fieldState: { invalid, error } }) => (
                <>
                  <Calendar
                    id={field.datetime}
                    aria-describedby={`ceremony_date-help`}
                    className={classNames("m-1", { "p-invalid": error })}
                    value={convertDate(field.value || "")}
                    onChange={(e) => {
                      field.onChange(e.value);
                    }}
                    dateFormat="dd/mm/yy"
                    mask="99/99/9999"
                    showIcon
                    placeholder="Select ceremony date"
                  />
                  {invalid && <p className="error">{error.message}</p>}
                </>
              )}
            />
            <small>Select the ceremony date.</small>
          </div>
        </div>
      </div>
    </Fieldset>
  );
}
