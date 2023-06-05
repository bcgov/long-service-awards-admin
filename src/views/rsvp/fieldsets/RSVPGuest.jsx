/*!
 * RSVP Guest fieldset component
 * File: RSVPGuest.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { Checkbox } from "primereact/checkbox";
import { Fieldset } from "primereact/fieldset";
import { useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { SelectButton } from "primereact/selectbutton";
import { useAPI } from "@/providers/api.provider.jsx";

export default function RSVPGuest() {
  const api = useAPI();
  const { control, setValue } = useFormContext();
  const [guestAccommodations, setGuestAccommodations] = useState(false);
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
    <Fieldset className={"mb-3"} legend={<>Are you bringing a guest?</>}>
      <div className="container">
        <div className="grid">
          <div className={"col-12 form-field-container"}>
            <Controller
              name="guest_count"
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
                      setGuestAccommodations(!guestAccommodations);
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
                  Does your guest any accessibility requirements to attend the
                  ceremony (e.g. accessible parking and/or seating, a sign
                  language interpreter (ASL), service dog access etc.)?
                </p>
                <Controller
                  name="guest_accommodations.accessibility"
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
                                "guest_accommodations.accessibility",
                                e.value === true
                              );
                            }}
                            options={accessibilityRequirements}
                            optionLabel="name"
                          />
                          <label
                            className={"ml-2"}
                            htmlFor={`guest_accommodations.accessibility`}
                          >
                            (Selected: No)
                          </label>
                        </div>
                        <small>
                          If yes. someone from the Long Service Awards team will
                          contact you closer to the event for further
                          information
                        </small>
                      </>
                    );
                  }}
                />
              </div>
              <div className={"col-12 form-field-container"}>
                <label
                  className={"m-1 font-bold"}
                  htmlFor={`guest_accommodations`}
                >
                  Dietary Requirements
                </label>
                {accommodations.map((o, i) => (
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
                          >
                            {o.label}
                          </label>
                        </div>
                      );
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Fieldset>
  );
}
