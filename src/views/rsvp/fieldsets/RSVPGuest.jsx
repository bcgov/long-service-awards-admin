/*!
 * RSVP Guest fieldset component
 * File: RSVPGuest.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { Checkbox } from "primereact/checkbox";
import { Fieldset } from "primereact/fieldset";
import { Controller, useFormContext } from "react-hook-form";

export default function RSVPGuest() {
  const { control } = useFormContext();

  return (
    <Fieldset className={"mb-3"} legend={<>Are you bringing a guest?</>}>
      <div className="container">
        <div className="grid">
          <div className={"col-12 form-field-container"}>
            <Controller
              name="guest"
              control={control}
              render={({ field, fieldState: { invalid, error } }) => (
                <div className="flex align-items-center">
                  <Checkbox
                    id={field.name}
                    inputId={field.name}
                    checked={!!field.value}
                    aria-describedby={`active-help`}
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(
                        e.target.checked ? (field.value = 1) : (field.value = 0)
                      );
                    }}
                  />
                  {invalid && <p className="error">{error.message}</p>}
                  <label className={"ml-2"} htmlFor={`guest`}>
                    I would like to bring a guest
                  </label>
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </Fieldset>
  );
}
