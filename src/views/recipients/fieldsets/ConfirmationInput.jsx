/*!
 * Registration Confirmation fieldset component
 * File: ConfirmationInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import {Controller, useFormContext, useWatch} from "react-hook-form";
import {Checkbox} from "primereact/checkbox";
import {Panel} from "primereact/panel";
import {Message} from "primereact/message";
import {useEffect, useState} from "react";

/**
 * Registration confirmation input component.
 * @returns {JSX.Element},
 */

export default function ConfirmationInput({validate}) {

    // set local states
    const { control, getValues } = useFormContext();
    const [complete, setComplete] = useState(false);

    // auto-validate form
    useEffect(() => {
        setComplete(
            Object.keys(validate || [])
                .filter(key => key !== 'confirmation')
                .every(key => validate[key](getValues())));
    }, [useWatch({control})]);

    return <Panel className={'mb-3'} header={'Declaration'}>
        <div className="container">
            {
                !complete && <Message
                    className={'w-full mb-3 mt-3'}
                    severity="warn"
                    text="Form is incomplete."
                    />
            }
            <div className="grid">
                <div className="col-12 form-field-container">
                    <div className="flex align-items-center">
                        <Controller
                            name="service.confirmed"
                            control={control}
                            render={({ field, fieldState: {invalid, error} }) => (
                                <>
                                    <Checkbox
                                        disabled={!complete}
                                        id={field.name}
                                        inputId={'registration-confirmation'}
                                        checked={field.value || false}
                                        aria-describedby={`service-confirmation-help`}
                                        value={field.value || false}
                                        className={'m-3'}
                                        onChange={(e) => {
                                            field.onChange(e.checked);
                                        }}
                                    />
                                    { invalid && <p className="error">{error.message}</p> }
                                </>
                            )}
                        />
                        <label className={'m-1 font-bold'} htmlFor={`registration-confirmation`}>
                            Confirm Registration {!complete && ' (complete form to confirm)' }
                        </label>
                    </div>
                </div>
                <div className="col-12 form-field-container">
                    <div className="flex align-items-center">
                        <Controller
                            name="service.survey_opt_in"
                            control={control}
                            render={({ field, fieldState: {invalid, error} }) => (
                                <>
                                    <Checkbox
                                        id={field.name}
                                        inputId={'survey_opt-in'}
                                        checked={field.value || false}
                                        aria-describedby={`survey_opt-in-help`}
                                        value={field.value || false}
                                        onChange={(e) => {
                                            field.onChange(e.checked);
                                        }}
                                        className={'m-3'}
                                    />
                                    { invalid && <p className="error">{error.message}</p> }
                                </>
                            )}
                        />
                        <label className={'m-1'} htmlFor={'survey_opt-in'}>Confirm survey participation</label>
                    </div>
                </div>
            </div>
        </div>
    </Panel>;
}
