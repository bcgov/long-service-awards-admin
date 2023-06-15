/*!
 * Ceremony Details fieldset component
 * File: CeremonyInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { convertDate } from "@/services/validation.services.js";
import classNames from "classnames";
import { Calendar } from "primereact/calendar";
import { Fieldset } from "primereact/fieldset";
import { InputText } from "primereact/inputtext";
import { Controller, useFormContext } from "react-hook-form";
import { Fragment } from "react";

export default function CeremonyDetailsInput({ id, label }) {
  const { control } = useFormContext();

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
                <Fragment>
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
                </Fragment>
              )}
            />
          </div>

          <div className={"col-12 form-field-container"}>
            <label className={"m-1"} htmlFor={`datetime`}>
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
                    showTime
                    hourFormat="12"
                    showIcon
                    placeholder="Select ceremony date and time"
                  />
                  {invalid && <p className="error">{error.message}</p>}
                </>
              )}
            />
            <small>Select the ceremony date and time.</small>
          </div>
        </div>
      </div>
    </Fieldset>
  );
}
