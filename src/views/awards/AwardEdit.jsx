/*!
 * Award Edit fieldset component
 * File: AwardEdit.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Panel } from "primereact/panel";
import classNames from "classnames";
import { Dropdown } from "primereact/dropdown";
import { useAPI } from "@/providers/api.provider.jsx";
import fallbackImg from "@/assets/images/bclogo.jpg";
import { Checkbox } from "primereact/checkbox";
import { Editor } from "primereact/editor";
import { InputNumber } from "primereact/inputnumber";

/**
 * Model data edit component
 * @returns {JSX.Element}
 */

export default function AwardEdit({ awardTypes }) {
  const api = useAPI();
  const { control, getValues } = useFormContext();
  const [milestones, setMilestones] = useState([]);

  // load data list
  useEffect(() => {
    api.getMilestones().then(setMilestones).catch(console.error);
  }, []);

  return (
    <Panel className={"mb-3"} header={<>Award</>}>
      <div className="container">
        <div className="grid">
          <div className="col-12 flex align-items-center">
            <Controller
              name="active"
              control={control}
              render={({ field, fieldState: { invalid, error } }) => (
                <>
                  <Checkbox
                    id={field.name}
                    inputId={field.name}
                    checked={field.value || false}
                    aria-describedby={`active-help`}
                    value={field.value || false}
                    onChange={(e) => {
                      field.onChange(e.checked);
                    }}
                  />
                  {invalid && <p className="error">{error.message}</p>}
                  <label className={"m-1"} htmlFor={`active`}>
                    Activate
                  </label>
                </>
              )}
            />
          </div>
          <div className={"col-12 form-field-container"}>
            <label htmlFor={"type"}>Award Type</label>
            <Controller
              name={"type"}
              control={control}
              rules={{
                required: "Award type is required.",
              }}
              render={({ field, fieldState: { invalid, error } }) => (
                <>
                  <Dropdown
                    className={classNames({ "p-invalid": error })}
                    id={field.name}
                    inputId={field.name}
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e.value);
                    }}
                    aria-describedby={`award-type-help`}
                    options={awardTypes}
                    optionLabel="label"
                    optionValue="name"
                    placeholder={"Select the milestone for this award"}
                  />
                  {invalid && <p className="error">{error.message}</p>}
                </>
              )}
            />
          </div>
          <div className="col-12 form-field-container">
            <label htmlFor={"short_code"}>Short Code</label>
            <Controller
              name={"short_code"}
              control={control}
              render={({ field, fieldState: { invalid, error } }) => (
                <>
                  <InputText
                    id={field.name}
                    value={field.value || ""}
                    maxLength={64}
                    className={classNames("w-full", { "p-invalid": error })}
                    aria-describedby={`award-short_code-help`}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder={`Enter a short code for this award`}
                  />
                  {invalid && <p className="error">{error.message}</p>}
                </>
              )}
            />
          </div>
          <div className="col-12 form-field-container">
            <label htmlFor={"label"}>Label</label>
            <Controller
              name={"label"}
              control={control}
              rules={{ required: "Label is required." }}
              render={({ field, fieldState: { invalid, error } }) => (
                <>
                  <InputText
                    id={field.name}
                    value={field.value || ""}
                    className={classNames("w-full", { "p-invalid": error })}
                    aria-describedby={`award-label-help`}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder={`Enter a label for this award`}
                  />
                  {invalid && <p className="error">{error.message}</p>}
                </>
              )}
            />
          </div>
          <div className={"col-12 form-field-container"}>
            <label htmlFor={"service.milestone"}>Award Milestone</label>
            <Controller
              name={`milestone`}
              control={control}
              rules={{
                required: { value: true, message: "Milestone is required." },
              }}
              render={({ field, fieldState: { invalid, error } }) => (
                <>
                  <Dropdown
                    className={classNames({ "p-invalid": error })}
                    id={field.name}
                    inputId={field.name}
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e.value);
                    }}
                    aria-describedby={`milestone-help`}
                    options={
                      (milestones || [])
                        .filter((opt) => opt["name"] >= 25)
                        .reverse() || []
                    }
                    optionLabel="label"
                    optionValue="name"
                    placeholder={"Select the milestone for this award"}
                  />
                  {invalid && <p className="error">{error.message}</p>}
                </>
              )}
            />
          </div>
          <div className="col-12 form-field-container">
            <label htmlFor={`description`}>Award Description</label>
            <Controller
              name={"description"}
              control={control}
              rules={{
                required: "Description is required.",
              }}
              render={({ field, fieldState: { invalid, error } }) => (
                <>
                  <Editor
                    id={field.name}
                    value={field.value || ""}
                    onTextChange={(e) => field.onChange(e.htmlValue)}
                    headerTemplate={
                      <span className="ql-formats">
                        <button className="ql-bold" aria-label="Bold"></button>
                        <button
                          aria-label="Ordered List"
                          className="ql-list"
                          value="ordered"
                        ></button>
                        <button
                          aria-label="Unordered List"
                          className="ql-list"
                          value="bullet"
                        ></button>
                      </span>
                    }
                    className={classNames("w-full", { "p-invalid": error })}
                    style={{ height: "320px" }}
                    aria-describedby={`award-description-help`}
                  />
                  {invalid && <p className="error">{error.message}</p>}
                </>
              )}
            />
          </div>
          <div className="col-12 form-field-container">
            <label htmlFor={"quantity"}>
              Quantity (-1 indicates unlimited)
            </label>
            <Controller
              name={"quantity"}
              control={control}
              render={({ field, fieldState: { invalid, error } }) => (
                <>
                  <InputNumber
                    id={field.name}
                    value={field.value || field.onChange(-1)}
                    min={-1}
                    max={9999}
                    className={classNames("w-full", { "p-invalid": error })}
                    aria-describedby={`award-quantity-help`}
                    onChange={(e) => field.onChange(e.value)}
                    placeholder={`Enter a quantity for this award (-1 indicates unlimited)`}
                  />
                  {invalid && <p className="error">{error.message}</p>}
                </>
              )}
            />
          </div>
          <div className="col-12 form-field-container">
            <label htmlFor={"image_url"}>
              Image URL
              <div>
                <a target={"_blank"} href={getValues("image_url")}>
                  <small>{getValues("image_url")}</small>
                </a>
              </div>
            </label>
            <Controller
              name={"image_url"}
              control={control}
              render={({ field, fieldState: { invalid, error } }) => (
                <>
                  <InputText
                    id={field.name}
                    value={field.value || ""}
                    className={classNames("w-full", { "p-invalid": error })}
                    aria-describedby={`award-image-help`}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder={`Enter the image url for this award`}
                  />
                  {invalid && <p className="error">{error.message}</p>}
                  <img
                    className="m-2 w-8 mx-auto border-round"
                    src={getValues("image_url") || fallbackImg}
                    onError={(e) => (e.target.src = fallbackImg)}
                    alt={"Image Thumbnail"}
                  />
                </>
              )}
            />
          </div>
        </div>
      </div>
    </Panel>
  );
}
