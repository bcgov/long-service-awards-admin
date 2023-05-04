/*!
 * Milestone Input fieldset
 * File: MilestoneInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { useContext, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { MultiSelect } from "primereact/multiselect";
import classNames from "classnames";
import InfoToolTip from "../common/InfoToolTip";
import { OptionsContext, RegistrationContext } from "@/AppContext.js";
import { Panel } from "primereact/panel";
import { getMilestones } from "@/services/api.routes.js";

/**
 * Previous Milestones reusable component.
 * @param {object} props
 * @returns years of service, current milestone, qualifying year, prior milestones,
 */

export default function PreviousMilestonesInput({ threshold = 25 }) {
  // load form data
  const { options } = useContext(OptionsContext);
  const { registration } = useContext(RegistrationContext);
  const { organizations = [] } = options || {};
  const { control, getValues } = useFormContext();

  // set local states
  const [milestones, setMilestones] = useState();
  const [eligible, setEligible] = useState(false);

  // update local ministry selection state
  // - previous service pins only available to select organizations
  useEffect(() => {
    const organization = getValues("service.milestone");
    setEligible(
      (organizations || []).filter(
        (org) =>
          organization &&
          organization.hasOwnProperty("id") &&
          org.id === organization.id &&
          org.previous_service_pins
      ).length !== 0
    );

    getMilestones().then(setMilestones).catch(console.error);
  }, [registration]);

  return (
    eligible && (
      <Panel
        className={"mb-3"}
        header={
          <>
            Previous Milestones{" "}
            <InfoToolTip
              target="milestones-form"
              content="If prior Service Pins have not been claimed, use this field
                         to submit a claim of eligibility for those years."
            />
          </>
        }
      >
        <div className="container">
          <div className="grid">
            <div className="col-12 form-field-container">
              <label htmlFor={`prior_milestones`}>
                Prior Unclaimed Milestone(s) Selected
              </label>
              <Controller
                name={"prior_milestones"}
                control={control}
                render={({ field, fieldState: { invalid, error } }) => (
                  <>
                    <MultiSelect
                      disabled={!getValues(`service.service_years`)}
                      id={field.name}
                      display="chip"
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(e.value);
                      }}
                      aria-describedby={"prior_milestones-help"}
                      options={(milestones || []).filter(
                        (opt) =>
                          opt["name"] <= getValues(`service.service_years`) &&
                          opt["name"] >= threshold
                      )}
                      optionLabel="text"
                      className={classNames({ "p-invalid": error })}
                      placeholder={`Select your prior milestones.`}
                    />
                    {invalid && <p className="error">{error.message}</p>}
                  </>
                )}
              />
            </div>
          </div>
        </div>
      </Panel>
    )
  );
}
