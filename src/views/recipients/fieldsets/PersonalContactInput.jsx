/*!
 * Contact Information fieldset component
 * File: ProfileInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import {Controller, useFormContext} from "react-hook-form";
import classNames from "classnames";
import validate, {matchers, validators} from "@/services/validation.services.js";
import {InputMask} from "primereact/inputmask";
import {Panel} from "primereact/panel";
import AddressInput from "@/views/recipients/fieldsets/AddressInput.jsx";
import {Tag} from "primereact/tag";
import {useEffect, useState} from "react";

/**
 * Contact Details Reusable component.
 * @returns first_name, last_name, office email, office phone, employee number,
 * organization, branch, personal phone, personal email
 */

export default function PersonalContactInput() {
    const { control, getValues } = useFormContext();
    const [complete, setComplete] = useState(false);

    // validate fieldset
    const validation = () => {
        const { contact } = getValues() || {};
        const {personal_address} = contact || {};
        setComplete(validate([
            {key: "personal_phone", validators: [validators.phone]},
        ], contact) && validate([
            { key: "street1", validators: [validators.required] },
            { key: "community", validators: [validators.required] },
            { key: "province", validators: [validators.required] },
            { key: "postal_code", validators: [validators.required, validators.postal_code] },
        ], personal_address));
    };
    useEffect(() => validation, [getValues('contact')]);

    // Note: To fix error handling to make sure naming convention works
    return <>
        <Panel
            onClick={validation}
            collapsed
            toggleable
            className={'mb-3'}
            header={
            <>Personal Contact Information {complete && <Tag severity={'success'} value={'Complete'} /> } </>
        }>
        >
            <div className="container">
                <div className="grid">
                    <div className={'col-12 form-field-container'}>
                        <label htmlFor={'contact.personal_phone'}>Personal Phone Number</label>
                        <Controller
                            name={'contact.personal_phone'}
                            control={control}
                            rules={{
                                required: "Error: Personal phone number is required.",
                                pattern: {
                                    value: matchers.phone,
                                    message: "Invalid phone number. E.g. (555)-555-5555",
                                },
                            }}
                            render={({ field, fieldState: {invalid, error} }) => (
                                <>
                                    <InputMask
                                        id={field.name}
                                        value={field.value || ''}
                                        mask="(999) 999-9999? x99999"
                                        autoClear={false}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        placeholder={'Personal phone number Ex. (999) 999-9999 x99999'}
                                        aria-describedby={'personal_phone-help'}
                                        className={classNames({"p-invalid": error})}
                                    />
                                    { invalid && <p className="error">{error.message}</p> }
                                </>
                            )}
                        />
                    </div>
                </div>
            </div>
            <AddressInput id={'contact.personal_address'} label={'Personal'} />
        </Panel>
    </>;
}
