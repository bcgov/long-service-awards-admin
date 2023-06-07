/*!
 * RSVP Form provider component
 * File: FormContext.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm, useFormState, useWatch } from "react-hook-form";
import { BlockUI } from "primereact/blockui";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Panel } from "primereact/panel";
import { useStatus } from "@/providers/status.provider.jsx";
import { Message } from "primereact/message";
import { useAPI } from "@/providers/api.provider.jsx";
/**
 * FormContext component
 * @param loader
 * @param {Function} loader
 * @param {Function} save
 * @param {Function} remove
 * @param cancel
 * @param {Object} defaults
 * @param {boolean} blocked
 * @param validate
 * @param children
 * @returns {JSX.Element}
 */

export default function RSVPForm({
  loader,
  save,
  remove,
  cancel = () => {},
  defaults = {},
  blocked,
  validate,
  children,
}) {
  // get context / hooks
  const status = useStatus();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [complete, setComplete] = useState(false);
  const [formData, setFormData] = useState();
  const api = useAPI();

  // initialize form (react hook form)
  const methods = useForm({
    mode: "all",
    defaultValues: useMemo(() => {
      return { ...defaults, ...formData };
    }, [formData]),
  });

  const { control, handleSubmit, getValues, reset } = methods;

  const isAttending =
    useWatch({ control, name: "attendance_confirmed" }) || null;

  const { errors } = useFormState({
    control,
  });

  // auto-validate form (ignore if no validation method provided)
  useEffect(() => {
    setComplete(!validate || validate(getValues()));
  }, [useWatch({ control })]);

  // load form data
  useEffect(() => {
    setLoading(true);
    loader()
      .then(setFormData)
      .catch((error) => {
        console.error(error);
        status.setMessage("loadError");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // effect runs when state is updated
  useEffect(() => {
    reset(formData);
  }, [formData]);

  // save current form data
  const _submitForm = async () => {
    setLoading(true);
    console.log("Save:", getValues());
    await save(getValues());
    setLoading(false);
  };

  // save current form data
  const _deleteForm = async (id) => {
    setLoading(true);
    await remove(id);
    setLoading(false);
  };

  // cancel form edits
  const _cancelForm = async () => {
    cancel();
  };

  // component for blocked form
  const blockTemplate = () => {
    return loading ? (
      <Button
        disabled={true}
        icon={"pi pi-spin pi-spinner"}
        label={"Loading"}
      />
    ) : (
      <Button disabled={true} icon={"pi pi-lock"} label={"Form Locked"} />
    );
  };

  return (
    <FormProvider {...methods}>
      <form>
        <BlockUI blocked={loading || blocked} template={blockTemplate}>
          {children}
          {Object.keys(errors).length > 0 && (
            <Message
              className={"w-full mb-3 mt-3"}
              severity="warn"
              text="Form is incomplete. Please check for errors or missing fields."
            />
          )}
          <Panel
            icons={<i className={"pi pi-save"} />}
            header={"Confirm attendance"}
          >
            <ConfirmDialog
              header="Confirmation"
              visible={showConfirm}
              onHide={() => setShowConfirm(false)}
              message="Are you sure you want to delete this record?"
              icon="pi pi-exclamation-triangle"
              accept={_deleteForm}
              reject={() => setShowConfirm(false)}
            />

            <div className="container m-3">
              <div className={"grid"}>
                <div className={"col-5"}>
                  <Button
                    disabled={!complete}
                    className={
                      "p-button-success w-full flex justify-content-center"
                    }
                    icon={"pi pi-fw pi-check"}
                    type="submit"
                    onClick={handleSubmit(_submitForm)}
                  >
                    {isAttending
                      ? "RSVP: I WILL BE ATTENDING THE CEREMONY"
                      : "I WILL NOT BE ATTENDING THE CEREMONY"}
                  </Button>
                </div>
              </div>
            </div>
          </Panel>
        </BlockUI>
      </form>
    </FormProvider>
  );
}
