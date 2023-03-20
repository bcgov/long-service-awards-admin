/*!
 * Supervisor Contact Details fieldset component
 * File: SupervisorContactInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import {Controller, useFormContext, useFormState} from "react-hook-form";
import { InputText } from "primereact/inputtext";
import classNames from "classnames";
import validate, {matchers, validators} from "@/services/validation.services.js";
import {Panel} from "primereact/panel";
import AddressInput from "@/views/recipients/fieldsets/AddressInput.jsx";
import {Tag} from "primereact/tag";
import {useEffect, useState} from "react";

/**
 * Supervisor Contact Details
 * @returns first_name, last_name, office email */

export default function SupervisorContactInput() {
    const { control, getValues } = useFormContext();
    const [complete, setComplete] = useState(false);

    // validate fieldset
    const validation = () => {
        const { supervisor } = getValues() || {};
        const { office_address } = supervisor || {};
        setComplete(validate([
            {key: "first_name", validators: [validators.required]},
            {key: "last_name", validators: [validators.required]},
            {key: "office_email", validators: [validators.required, validators.email]},
        ], supervisor) && validate([
            { key: "street1", validators: [validators.required] },
            { key: "community", validators: [validators.required] },
            { key: "province", validators: [validators.required] },
            { key: "postal_code", validators: [validators.required, validators.postal_code] },
        ], office_address));
    };
    useEffect(() => validation, [getValues('supervisor')]);


    // Note: To fix error handling to make sure naming convention works
    return <>
        <Panel
            onClick={validation}
            collapsed
            toggleable
            className={'mb-3'}
            header={<>Supervisor Contact Details {complete && <Tag severity={'success'} value={'Complete'} /> } </>}>
            <div className="container">
                <div className="grid">
                    <div className={'col-12 form-field-container'}>
                        <label htmlFor={'supervisor.first_name'}>First Name</label>
                        <Controller
                            name={'supervisor.first_name'}
                            control={control}
                            rules={{ required: "First name is required." }}
                            render={({ field, fieldState: {invalid, error} }) => (
                                <>
                                    <InputText
                                        id={field.name}
                                        value={field.value || ''}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        className={classNames({"p-invalid": error})}
                                        aria-describedby={`first_name-help`}
                                        placeholder={`Supervisor first name`}
                                    />
                                    { invalid && <p className="error">{error.message}</p> }
                                </>
                            )}
                        />

                    </div>
                    <div className="col-12 form-field-container">
                        <label htmlFor={'supervisor.last_name'}>Last Name</label>
                        <Controller
                            name={'supervisor.last_name'}
                            control={control}
                            rules={{ required: "Last name is required." }}
                            render={({ field, fieldState: {invalid, error} }) => (
                                <>
                                    <InputText
                                        id={field.name}
                                        value={field.value || ''}
                                        className={classNames({"p-invalid": error})}
                                        aria-describedby={`last_name-help`}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        placeholder={`Supervisor last name`}
                                    />
                                    { invalid && <p className="error">{error.message}</p> }
                                </>
                            )}
                        />
                    </div>
                    <div className="col-12 form-field-container">
                        <label htmlFor={`supervisor.office_email`}>Government Email</label>
                        <Controller
                            name={'supervisor.office_email'}
                            control={control}
                            rules={{
                                required: "Error: Government email is required.",
                                pattern: {
                                    value: matchers.govEmail,
                                    message: "Invalid email address. (e.g., example@gov.bc.ca)",
                                },
                            }}
                            render={({ field, fieldState: {invalid, error} }) => (
                                <>
                                    <InputText
                                        id={field.name}
                                        value={field.value || ''}
                                        className={classNames({"p-invalid": error})}
                                        aria-describedby={`government-email-help`}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        placeholder={`Supervisor government email address`}
                                    />
                                    { invalid && <p className="error">{error.message}</p> }</>
                            )}
                        />
                    </div>
                </div>
            </div>
            <AddressInput id={'supervisor.office_address'} label={'Supervisor'} />
        </Panel>
    </>;
}
