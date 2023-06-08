/*!
 * RSVP Options component
 * File: RSVPOptions.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { useAPI } from "@/providers/api.provider.jsx";
import { Checkbox } from "primereact/checkbox";
import { Fieldset } from "primereact/fieldset";
import { SelectButton } from "primereact/selectbutton";
import { Fragment, useEffect, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

export default function RSVPOptions() {
  const api = useAPI();
  const { control, setValue } = useFormContext();
  const [accommodations, setAccommodations] = useState([]);
  const accessibilityRequirements = [
    { name: "Yes", value: true },
    { name: "No", value: false },
  ];

  useEffect(() => {
    api
      .getAccommodations()
      .then((results) => {
        const accommodations = results || {};
        //remove accesibility requirement from the list
        accommodations.splice(
          accommodations.findIndex(({ name }) => name == "accessibility"),
          1
        );
        setAccommodations(accommodations);
      })
      .catch(console.error);
  }, []);

  return (
    accommodations && (
      <Fieldset toggleable={false} className={"mb-3"} legend={<>Options</>}>
        <div className="container">
          <div className="grid">
            <div className={"col-12 form-field-container"}>
              <label
                htmlFor={`accommodations.accessibility`}
                className="font-bold"
              >
                Accessibility requirements
              </label>
              <p>
                Do you have any accessibility requirements to attend the
                ceremony (e.g. accessible parking and/or seating, a sign
                language interpreter (ASL), service dog access etc.)?
              </p>
              <Controller
                name="accommodations.accessibility"
                control={control}
                defaultValue={false}
                render={({ field }) => {
                  return (
                    <>
                      <div className="flex align-items-center">
                        <SelectButton
                          className={"radio-toggle"}
                          value={field.value}
                          onChange={(e) => {
                            setValue(
                              "accommodations.accessibility",
                              e.value === true
                            );
                          }}
                          options={accessibilityRequirements}
                          optionLabel="name"
                        />
                        <label
                          className={"ml-2"}
                          htmlFor={`accommodations.accessibility`}
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
              <label className={"m-1 font-bold"} htmlFor={`accommodations`}>
                Dietary Requirements
              </label>
              {accommodations.map((o, i) => (
                <Controller
                  name={`accommodations.` + `${o.name}`}
                  control={control}
                  key={i}
                  render={({ field }) => {
                    return (
                      <div className="field-checkbox">
                        <Checkbox
                          inputId={i}
                          name="option"
                          value={o.name || ""}
                          onChange={(e) => field.onChange(e.checked)}
                          checked={field.value}
                        />
                        <label htmlFor={`accommodations.` + `${o.name}`}>
                          {o.label}
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
    )
  );
}
