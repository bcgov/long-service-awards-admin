/*!
 * Ceremony Attendance Input fieldset
 * File: CeremonyInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import {useFormContext, useWatch} from "react-hook-form";
import {Panel} from "primereact/panel";
import {SelectButton} from "primereact/selectbutton";

/**
 * Ceremony Attendance component.
 * @returns {JSX.Element}
 */

export default function CeremonyInput() {

    // set local states
    const { control, setValue } = useFormContext();

    const ceremonyOptOut = useWatch({
        control,
        name: "service.ceremony_opt_out",
    });

    return <Panel collapsed toggleable className={'mb-3'} header={<>Ceremony Attendance</>}>
        <div className="container">
            <div className="grid">
                <div className="col-12 form-field-container">
                    <div className="flex align-items-center">
                        <SelectButton
                            className={'radio-toggle'}
                            value={ceremonyOptOut ? 'Yes' : 'No'}
                            onChange={(e) => {
                                setValue('service.ceremony_opt_out', e.value === 'Yes')
                            }}
                            options={['Yes', 'No']}
                        />
                        <label className={'ml-3'}>
                            Recipient will receive an award only and not attend the ceremony?
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </Panel>;
}
