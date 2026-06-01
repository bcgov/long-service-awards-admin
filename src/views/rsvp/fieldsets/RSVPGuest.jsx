/*!
 * RSVP Guest fieldset component
 * File: RSVPGuest.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { Checkbox } from "primereact/checkbox";
import { Fieldset } from "primereact/fieldset";
import { useState, useEffect, Fragment } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { SelectButton } from "primereact/selectbutton";
import { useAPI } from "@/providers/api.provider.jsx";

export default function RSVPGuest() {
  const api = useAPI();
  const { control, setValue } = useFormContext();
  const [guestAccommodations, setGuestAccommodations] = useState(true);
  const [accommodations, setAccommodations] = useState([]);
  const accessibilityRequirements = [
    { name: "Yes", value: true },
    { name: "No", value: false },
  ];

  const guestOptions = [
    { name: "Yes", value: true, description: "Yes, I am bringing a guest" },
    { name: "No", value: false, description: "No, I am not bringing a guest" },
  ];

  useEffect(() => {
    api
      .getRSVPAccommodations()
      .then((results) => {
        const accommodations = results || {};
        //remove accesibility requirement from the list
        accommodations.splice(
          accommodations.findIndex(({ name }) => name == "accessibility"),
          1,
        );
        //sort alphabetically
        accommodations.sort((a, b) => a.name.localeCompare(b.name));
        //move "Other" to the end
        accommodations.push(
          ...accommodations.splice(
            accommodations.findIndex((v) => v.name === "other"),
            1,
          ),
        );
        setAccommodations(accommodations);
      })
      .catch(console.error);
  }, []);

  return (
    <Fieldset className={"mb-3"} legend={<>Are you bringing a guest?</>}>
      <div className="container">
        <div className="grid">
          <div className={"col-12 form-field-container"}>
            <Controller
              name="guest_count"
              control={control}
              defaultValue={true}
              render={({ field, fieldState: { invalid, error } }) => (
                <>
                  <div className="flex align-items-center">
                    <Checkbox
                      id={field.name + "_yes"}
                      inputId={field.name + "_yes"}
                      checked={field.value === true}
                      aria-describedby={`active-help`}
                      value={true}
                      onChange={() => {
                        setValue("guest_count", true);
                        setGuestAccommodations(true);
                      }}
                    />
                    {invalid && <p className="error">{error.message}</p>}
                    <label className={"ml-2"} htmlFor={`guest_count_yes`}>
                      Yes, I am bringing a guest
                    </label>
                  </div>
                  <div className="flex align-items-center">
                    <Checkbox
                      id={field.name + "_no"}
                      inputId={field.name + "_no"}
                      checked={field.value === false}
                      aria-describedby={`active-help`}
                      value={false}
                      onChange={() => {
                        setValue("guest_count", false);
                        setGuestAccommodations(false);
                      }}
                    />
                    {invalid && <p className="error">{error.message}</p>}
                    <label className={"ml-2"} htmlFor={`guest_count_no`}>
                      No, I am not bringing a guest
                    </label>
                  </div>
                  {/* <div className="flex align-items-center">
                    <SelectButton
                      className={"radio-toggle"}
                      value={field.value}
                      onChange={(e) => {
                        setValue("guest_count", e.value === true);

                        setGuestAccommodations(!guestAccommodations);
                      }}
                      options={guestOptions.map((a) => {
                        return { value: a.value, name: a.name };
                      })}
                      optionLabel="name"
                    />
                    <label className={"ml-2"} htmlFor={`guest_count`}>
                      (Selected:{" "}
                      {
                        (
                          guestOptions.find((a) => a.value === field.value) ||
                          {}
                        ).description
                      }
                      )
                    </label>
                  </div> */}
                </>
              )}
            />
          </div>
          {guestAccommodations && (
            <>
              <div className={"col-12 form-field-container"}>
                <label
                  htmlFor={`guest_accommodations.accessibility`}
                  className="font-bold"
                >
                  Accessibility requirements
                </label>
                <p>
                  Does your guest have any accessibility requirements to attend
                  the ceremony (e.g. accessible parking and/or seating, a sign
                  language interpreter (ASL), service dog access etc.)?
                </p>
                <Controller
                  name="guest_accommodations.accessibility"
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
                            setValue(
                              "guest_accommodations.accessibility",
                              true,
                            );
                          }}
                        />
                        <label
                          className={"ml-2"}
                          htmlFor={`guest_accommodations.accessibility_yes`}
                        >
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
                            setValue(
                              "guest_accommodations.accessibility",
                              false,
                            );
                          }}
                        />
                        <label
                          className={"ml-2"}
                          htmlFor={`guest_accommodations.accessibility_no`}
                        >
                          No
                        </label>
                      </div>
                      {invalid && <p className="error">{error.message}</p>}
                      <small>
                        If yes, someone from the Long Service Awards team will
                        contact you closer to the event for further information
                      </small>
                    </>
                  )}
                />
              </div>
              <div className={"col-12 form-field-container"}>
                <label
                  className={"m-1 font-bold"}
                  htmlFor={`guest_accommodations`}
                >
                  Dietary Requirements
                </label>
                <p>
                  The dinner buffet has an assortment of labelled dishes and
                  will accommodate most dietary needs. Please review the options
                  below and select all requirements that apply.
                </p>
                {/* START */}

                {/* Main options (everything except celiac + other) */}
                {accommodations
                  .filter((o) => o.name !== "celiac" && o.name !== "other")
                  .map((o, i) => (
                    <Controller
                      name={`guest_accommodations.` + `${o.name}`}
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
                              htmlFor={`guest_accommodations.` + `${o.name}`}
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

                {/* Severe cross-contamination section */}
                <div style={{ marginTop: "1rem", fontWeight: 600 }}>
                  Select the following if cross contamination is an issue due to
                  a severe or life-threatening dietary allergies:
                </div>

                {accommodations
                  .filter((o) => o.name === "celiac" || o.name === "other")
                  .map((o, i) => (
                    <Controller
                      // IMPORTANT: SAME name path as the main list so it saves to the same object
                      name={`guest_accommodations.` + `${o.name}`}
                      control={control}
                      key={`severe-${i}`}
                      render={({ field }) => {
                        return (
                          <div className="field-checkbox">
                            <Checkbox
                              inputId={`severe-${i}`}
                              name="option"
                              value={o.name || ""}
                              onChange={(e) => field.onChange(e.checked)}
                              checked={field.value}
                            />
                            <label
                              htmlFor={`guest_accommodations.` + `${o.name}`}
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

                {/* END */}
              </div>
            </>
          )}
        </div>
      </div>
    </Fieldset>
  );
}
