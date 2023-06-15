/*!
 * RSVPRetiring fieldset component
 * File: RSVPRetiring.js
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
import { Checkbox } from "primereact/checkbox";
import { format } from "date-fns";

export default function RSVPRetiring() {
  const api = useAPI();
  const { control } = useFormContext();

  return (
    <Fieldset
      toggleable={false}
      className={"mb-3"}
      legend={<>Retiring before the ceremony date?</>}
    >
      <div className="container">
        <div className="grid">
          <div className={"col-12 form-field-container"}>
            <Controller
              name="recipient.retirement"
              control={control}
              render={({ field, fieldState: { invalid, error } }) => {
                console.log(field.value);
                return (
                  <div className="flex align-items-center">
                    <Checkbox
                      id={field.name}
                      inputId={field.name}
                      checked={!!field.value || false}
                      aria-describedby={`active-help`}
                      value={field.value || false}
                      onChange={(e) => {
                        field.onChange(e.checked);
                      }}
                    />
                    {invalid && <p className="error">{error.message}</p>}
                    <label className={"ml-2"} htmlFor={`recipient.retirement`}>
                      Yes, I will be retiring before the ceremony date
                    </label>
                  </div>
                );
              }}
            />
          </div>
        </div>
      </div>
    </Fieldset>
  );
}
