/*!
 * RSVP Options component
 * File: RSVPOptions.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { useAPI } from "@/providers/api.provider.jsx";
import { Checkbox } from "primereact/checkbox";
import { Fieldset } from "primereact/fieldset";
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
      .getRSVPAccommodations()
      .then((results) => {
        const accommodations = results || {};
        //remove accesibility requirement from the list
        accommodations.splice(
          accommodations.findIndex(({ name }) => name == "accessibility"),
          1
        );
        //sort alphabetically
        accommodations.sort((a, b) => a.name.localeCompare(b.name));
        //move "Other" to the end
        accommodations.push(
          ...accommodations.splice(
            accommodations.findIndex((v) => v.name === "other"),
            1
          )
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
                htmlFor={`recipient_accommodations.accessibility`}
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
                name="recipient_accommodations.accessibility"
                control={control}
                defaultValue={false}
                render={({ field, fieldState: { invalid, error } }) => (
                  <>
                    <div className="flex align-items-center">
                      <Checkbox
                        id={field.name + "_yes"}
                        inputId={field.name + "_yes"}
                        checked={field.value === true}
                        aria-describedby={`accessibility-help`}
                        value={true}
                        onChange={() => {
                          setValue("recipient_accommodations.accessibility", true);
                        }}
                      />
                      <label className={"ml-2"} htmlFor={`recipient_accommodations.accessibility_yes`}>
                        Yes
                      </label>
                    </div>
                    <div className="flex align-items-center">
                      <Checkbox
                        id={field.name + "_no"}
                        inputId={field.name + "_no"}
                        checked={field.value === false}
                        aria-describedby={`accessibility-help`}
                        value={false}
                        onChange={() => {
                          setValue("recipient_accommodations.accessibility", false);
                        }}
                      />
                      <label className={"ml-2"} htmlFor={`recipient_accommodations.accessibility_no`}>
                        No
                      </label>
                    </div>
                    {invalid && <p className="error">{error.message}</p>}
                    <small>
                      If yes. someone from the Long Service Awards team will
                      contact you closer to the event for further information
                    </small>
                  </>
                )}
              />
            </div>
            <div className={"col-12 form-field-container"}>
              <label className={"font-bold"} htmlFor={`accommodations`}>
                Dietary allergies and requirements
              </label>
              <p>
                The dinner buffet will have an assortment of labelled dishes.
                The buffet will accommodate most requirements. Please review the
                options below and select all requirements that apply.
              </p>
              {accommodations.map((o, i) => (
                <Controller
                  name={`recipient_accommodations.` + `${o.name}`}
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
                        <label
                          htmlFor={`recipient_accommodations.` + `${o.name}`}
                          style={{
                            color: o.name === "other" ? "red" : "inherited",
                          }}
                        >
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
