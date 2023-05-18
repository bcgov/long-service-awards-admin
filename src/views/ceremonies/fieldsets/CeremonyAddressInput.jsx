/*!
 * Contact Information fieldset component
 * File: CeremonyAddressInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import {Controller, useFormContext, useWatch} from "react-hook-form";
import classNames from "classnames";
import {matchers} from "@/services/validation.services.js";
import {InputMask} from "primereact/inputmask";
import {Panel} from "primereact/panel";
import AddressInput from "@/views/recipients/fieldsets/AddressInput.jsx";
import {Tag} from "primereact/tag";
import {useEffect, useState} from "react";
import FieldsetHeader from "@/components/common/FieldsetHeader.jsx";

/**
 * Contact Details Reusable component.
 * @returns first_name, last_name, office email, office phone, employee number,
 * organization, branch, personal phone, personal email
 */

export default function PersonalContactInput({validate}) {
    const { control, getValues } = useFormContext();
    const [complete, setComplete] = useState(false);

    // validate fieldset
    useEffect(() => {
        setComplete(validate(getValues()) || false);
    }, [useWatch({name: 'contact'})]);

    // Note: To fix error handling to make sure naming convention works
    return <>
        <Panel
            collapsed
            toggleable
            className={'mb-3'}
            headerTemplate={FieldsetHeader('Ceremony Address', complete)}
        >
            <AddressInput id={'address'} label={'Venue'} />
        </Panel>
    </>;
}
