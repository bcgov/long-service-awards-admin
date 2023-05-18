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
import { SelectButton } from "primereact/selectbutton";
import { Checkbox } from "primereact/checkbox";
/**
 * Address Input reusable component. Conditional PO Box requirement for Victoria addresses.
 * @returns address line 1, address line 2, city/community, province/state, country, postal code, po box
 */

export default function RSVPOptions() {
  const api = useAPI();
  const { control, setValue, getValues } = useFormContext();

  const [dietaryOptions, setDietaryOptions] = useState([]);

  const dietaryOptionsValues = [
    { option: "Dairy-free", name: "dairy_free" },
    { option: "Gluten-free", name: "gluten_free" },
    { option: "Sugar-free", name: "sugar_free" },
    { option: "Shellfish-free", name: "shellfish_free" },
    { option: "Peanut-free", name: "peanut_free" },
    { option: "Nut-free", name: "nut_free" },
    {
      option:
        "Other. Someone from the Long Service Awards team will contact you closer to the event for further information.",
      name: "other",
    },
  ];

  const accessibilityRequirements = [
    { name: "Yes", value: true },
    { name: "No", value: false },
  ];

  return (
    <Fieldset toggleable={false} className={"mb-3"} legend={<>Options</>}>
      <div className="container">
        <div className="grid">
          <div className={"col-12 form-field-container"}>
            <label htmlFor={`accessibility_requirements`} className="font-bold">
              Accessibility requirements
            </label>
            <p>
              Do you have any accessibility requirements to attend the ceremony
              (e.g. accessible parking and/or seating, a sign language
              interpreter (ASL), service dog access etc.)?
            </p>
            <Controller
              name="accessibility_requirements"
              control={control}
              defaultValue={false}
              render={({ field, fieldState: { invalid, error } }) => {
                return (
                  <>
                    <div className="flex align-items-center">
                      <SelectButton
                        className={"radio-toggle"}
                        value={field.value}
                        onChange={(e) => {
                          setValue(
                            "accessibility_requirements",
                            e.value === true
                          );
                        }}
                        options={accessibilityRequirements}
                        optionLabel="name"
                      />
                      {invalid && <p className="error">{error.message}</p>}
                      <label
                        className={"ml-2"}
                        htmlFor={`accessibility_requirements`}
                      >
                        (Selected: No)
                      </label>
                    </div>
                    <small>
                      If yes. someone from the Long Service Awards team will
                      contact you closer to the event for further information
                    </small>
                  </>
                );
              }}
            />
          </div>
          <div className={"col-12 form-field-container"}>
            <label className={"m-1 font-bold"} htmlFor={`dietary_requirements`}>
              Dietary Requirements
            </label>
            {dietaryOptionsValues.map((o, i) => (
              <Controller
                name={`dietary_requirements.` + `${o.name}`}
                control={control}
                key={i}
                render={({ field, fieldState: { invalid, error } }) => {
                  return (
                    <div className="field-checkbox">
                      <Checkbox
                        inputId={i}
                        name="option"
                        value={o.name || ""}
                        onChange={(e) => field.onChange(e.checked)}
                        checked={field.value}
                      />
                      <label htmlFor={`dietary_requirements.` + `${o.name}`}>
                        {o.option}
                      </label>
                    </div>
                  );
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </Fieldset>
  );
}
