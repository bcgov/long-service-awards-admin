/*!
 * Office Information fieldset component
 * File: ProfileInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import {Controller, useFormContext, useWatch} from "react-hook-form";
import classNames from "classnames";
import {matchers} from "@/services/validation.services.js";
import {InputMask} from "primereact/inputmask";
import {Panel} from "primereact/panel";
import AddressInput from "@/views/recipients/fieldsets/AddressInput.jsx";
import {useEffect, useState} from "react";
import {Tag} from "primereact/tag";
import FieldsetHeader from "@/components/common/FieldsetHeader.jsx";

/**
 * Office Contact Details Reusable component.
 * @returns office phone
 */

export default function OfficeContactInput({validate}) {
    const { control, getValues } = useFormContext();
    const [complete, setComplete] = useState(false);

    // auto-validate fieldset
    useEffect(() => {
        setComplete(validate(getValues()) || false);
    }, [useWatch({name: 'contact'})]);

    return <>
        <Panel
            collapsed
            className={'mb-3'}
            toggleable
            headerTemplate={FieldsetHeader('Office Contact Info', complete)}
        >
            <div className="container">
                <div className="grid">
                    <div className={'col-12 form-field-container'}>
                        <label htmlFor={'contact.office_phone'}>Office Phone Number</label>
                        <Controller
                            name={'contact.office_phone'}
                            control={control}
                            rules={{
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
                                        placeholder={'Office phone number Ex. (999) 999-9999 x99999'}
                                        aria-describedby={'office-phone-help'}
                                        className={classNames({"p-invalid": error})}
                                    />
                                    { invalid && <p className="error">{error.message}</p> }
                                </>
                            )}
                        />
                    </div>
                </div>
            </div>
            <AddressInput id={'contact.office_address'} label={'Office'} pobox={true} />
        </Panel>
    </>;
}
