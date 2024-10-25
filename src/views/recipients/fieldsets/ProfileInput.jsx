/*!
 * Profile Information fieldset component
 * File: ProfileInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { useEffect, useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { matchers } from "@/services/validation.services.js";
import { Dropdown } from "primereact/dropdown";
import { Panel } from "primereact/panel";
import { RadioButton } from 'primereact/radiobutton';

import { useAPI } from "@/providers/api.provider.jsx";
import classNames from "classnames";
import FieldsetHeader from "@/components/common/FieldsetHeader.jsx";

/**
 * Recipient Profile Information
 * @returns first_name, last_name, office email, office phone, employee number,
 * organization, branch, personal phone, personal email
 */

export default function ProfileInput({ validate }) {
  const { control, getValues, setValue } = useFormContext();
  const api = useAPI();
  const [organizations, setOrganizations] = useState([]);
  const [attending_with_organization, setAttendingWithOrganization] =
    useState();
  const [complete, setComplete] = useState(false);

  // update local ministry selection state
  // - get organizations allowed for user
  useEffect(() => {
    api.getOrganizationsUser().then(setOrganizations).catch(console.error);
  }, []);

  // auto-validate fieldset
  useEffect(() => {
    setComplete(validate(getValues()) || false);
  }, [useWatch()]);

  // Note: To fix error handling to make sure naming convention works
  return (
    <Panel
      collapsed
      toggleable
      className={"mb-3"}
      headerTemplate={FieldsetHeader("Profile", complete)}
    >
      <div className="container">
        <div className="grid">
          <div className={"col-12 form-field-container"}>
            <label htmlFor={"contact.first_name"}>First Name</label>
            <Controller
              name={"contact.first_name"}
              control={control}
              rules={{ required: "First name is required." }}
              render={({ field, fieldState: { invalid, error } }) => (
                <>
                  <InputText
                    id={field.name}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    className={classNames("w-full", { "p-invalid": error })}
                    aria-describedby={`first_name-help`}
                    placeholder={`Recipient\'s first name`}
                  />
                  {invalid && <p className="error">{error.message}</p>}
                </>
              )}
            />
          </div>
          <div className="col-12 form-field-container">
            <label htmlFor={"contact.last_name"}>Last Name</label>
            <Controller
              name={"contact.last_name"}
              control={control}
              rules={{ required: "Last name is required." }}
              render={({ field, fieldState: { invalid, error } }) => (
                <>
                  <InputText
                    id={field.name}
                    value={field.value || ""}
                    className={classNames("w-full", { "p-invalid": error })}
                    aria-describedby={`last_name-help`}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder={`Recipient\'s last name`}
                  />
                  {invalid && <p className="error">{error.message}</p>}
                </>
              )}
            />
          </div>
          <div className="col-12 form-field-container">
            <label htmlFor={`contact.office_email`}>
              Government Email Address (If retired, enter preferred email
              address)
            </label>
            <Controller
              name={"contact.office_email"}
              control={control}
              rules={{
                required: "Government email is required.",
                pattern: {
                  value: matchers.govEmail,
                  message: "Invalid email address (e.g., example@gov.bc.ca)",
                },
              }}
              render={({ field, fieldState: { invalid, error } }) => (
                <>
                  <InputText
                    id={field.name}
                    value={field.value || ""}
                    className={classNames("w-full", { "p-invalid": error })}
                    aria-describedby={`government-email-help`}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder={`Recipient\'s government email address`}
                  />
                  {invalid && <p className="error">{error.message}</p>}
                </>
              )}
            />
          </div>
          <div className={"col-12 form-field-container"}>
            <label htmlFor={"contact.personal_email"}>
              Alternate Email Address
            </label>
            <Controller
              name={"contact.personal_email"}
              control={control}
              rules={{
                required: "Personal email address is required.",
                pattern: {
                  value: matchers.email,
                  message: "Invalid email address. (e.g., example@gov.bc.ca)",
                },
              }}
              render={({ field, fieldState: { invalid, error } }) => (
                <>
                  <InputText
                    id={`${field.name}`}
                    value={field.value || ""}
                    type="text"
                    onChange={(e) => field.onChange(e.target.value)}
                    aria-describedby={"personal_email-help"}
                    placeholder={"Recipient's personal email address"}
                    className={classNames("w-full", { "p-invalid": error })}
                  />
                  {invalid && <p className="error">{error.message}</p>}
                </>
              )}
            />
          </div>

          <div className={"col-12 form-field-container"}>
            <p>
              Alternate Email Address is preferred
            </p>
            <div className="grid">
                
              <Controller
                name={"contact.alternate_is_preferred"}
                control={control}
                render={({ field, fieldState: { invalid, error } }) => (
                  <>
                    <div className="col-12 form-field-container">
                      <div className="flex align-items-center">
                        <RadioButton
                          inputId="alternateEmailPreferredNo"
                          name="alternateEmailPreferred"
                          checked={field.value != true}
                          value="No"
                          onChange={(e) => {
                            setValue(
                              "contact.alternate_is_preferred",
                              e.value === "Yes"
                            );
                          }}
                        />
                        <label className={"ml-3"} htmlFor="alternateEmailPreferredNo">No, recipient prefers BC Government email address</label>
                      </div>
                      <div className="flex align-items-center">
                        <RadioButton
                          inputId="alternateEmailPreferredYes"
                          checked={field.value}
                          name="alternateEmailPreferred"
                          value="Yes"
                          onChange={(e) => {
                            setValue(
                              "contact.alternate_is_preferred",
                              e.value === "Yes"
                            );
                            console.log(field.value)
                          }}
                          />
                        <label className={"ml-3"} htmlFor="alternateEmailPreferredYes">Yes, recipient prefers alternate email address</label>
                      </div>
                     
                      {/* Not sure why this is here, because it is repeated in Registration Options in next fieldset */}
                      <div className="flex align-items-center">
                        <p>
                          Recipient has previously registered for this milestone (in
                          the last 2 years) and was unable to attend the ceremony.
                        </p>
                      </div>
                    </div>

                  </>
              
                )}
              />
            </div>
            
            
          </div>
          <div className="col-12 form-field-container">
            <label htmlFor={`employee_number`}>
              Employee Number (six digits)
            </label>
            <Controller
              name={`employee_number`}
              control={control}
              rules={{
                required: "Employee number is required.",
                pattern: {
                  value: matchers.employeeNumber,
                  message: "Invalid employee number. (e.g., 123456)",
                },
              }}
              render={({ field, fieldState: { invalid, error } }) => (
                <>
                  <InputText
                    id={field.name}
                    value={field.value || ""}
                    maxLength={6}
                    minLength={6}
                    placeholder="012345"
                    onChange={(e) => {
                      // require integers for employee number
                      const filteredValue = e.target.value.replace(
                        /[^0-9]/g,
                        ""
                      );
                      field.onChange(filteredValue);
                    }}
                    aria-describedby={`employee_number-help`}
                    className={classNames("w-full", { "p-invalid": error })}
                  />
                  {invalid && <p className="error">{error.message}</p>}
                </>
              )}
            />
          </div>
          <div className="col-12 form-field-container">
            <label htmlFor={`organization.id`}>Ministry/Organization</label>
            <Controller
              name={`organization.id`}
              control={control}
              rules={{ required: "Ministry or Organization is required." }}
              render={({ field, fieldState: { invalid, error } }) => (
                <>
                  <Dropdown
                    id={field.name}
                    value={field.value || ""}
                    filter
                    onChange={(e) => field.onChange(e.target.value)}
                    aria-describedby={`organization-help`}
                    options={organizations}
                    optionLabel="name"
                    optionValue="id"
                    className={classNames("w-full", { "p-invalid": error })}
                    placeholder={`Select Recipient\'s ministry or organization`}
                  />
                  {invalid && <p className="error">{error.message}</p>}
                </>
              )}
            />
          </div>
          <div className="col-12 form-field-container">
            <label htmlFor={`division`}>Division</label>
            <Controller
              name={"division"}
              control={control}
              rules={{ required: "Division is required." }}
              render={({ field, fieldState: { invalid, error } }) => (
                <>
                  <InputText
                    id={field.name}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    aria-describedby={`division-help`}
                    className={classNames("w-full", { "p-invalid": error })}
                    placeholder={`Recipient\'s division`}
                  />
                  {invalid && <p className="error">{error.message}</p>}
                  <small>No acronyms, please spell the name in full.</small>
                </>
              )}
            />
          </div>
          <div className="col-12 form-field-container">
            <label htmlFor={"branch"}>Branch</label>
            <Controller
              name={"branch"}
              control={control}
              rules={{ required: "Branch is required." }}
              render={({ field, fieldState: { invalid, error } }) => (
                <>
                  <InputText
                    id={field.name}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    aria-describedby={`branch-help`}
                    className={classNames("w-full", { "p-invalid": error })}
                    placeholder={`Recipient\'s branch`}
                  />
                  {invalid && <p className="error">{error.message}</p>}
                  <small>No acronyms, please spell the name in full.</small>
                </>
              )}
            />
          </div>
          <div className="col-12 form-field-container">
            <label htmlFor={`attending_with_organization.id`}>
              Attending Ceremony With Ministry/Organization
            </label>
            <Controller
              name={`attending_with_organization.id`}
              control={control}
              render={({ field, fieldState: { invalid, error } }) => (
                <>
                  <Dropdown
                    id={field.name}
                    value={field.value || ""}
                    filter
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                    aria-describedby={`organization-help`}
                    options={organizations}
                    optionLabel="name"
                    optionValue="id"
                    className={classNames("w-full", { "p-invalid": error })}
                    placeholder={`Select Recipient\'s ministry or organization`}
                  />
                  {invalid && <p className="error">{error.message}</p>}
                </>
              )}
            />
          </div>
        </div>
      </div>
    </Panel>
  );
}
