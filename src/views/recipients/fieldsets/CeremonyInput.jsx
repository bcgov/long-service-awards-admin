/*!
 * Ceremony Attendance Input fieldset
 * File: CeremonyInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import {useFormContext, useWatch} from "react-hook-form";
import {Panel} from "primereact/panel";
import {RadioButton} from "primereact/radiobutton";
import FieldsetHeader from "@/components/common/FieldsetHeader.jsx";

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

    return <Panel
        collapsed
        toggleable
        className={'mb-3'}
        headerTemplate={FieldsetHeader('Ceremony Attendance')}
    >
        <div className="container">
            <div className="grid">
                <div className="col-12 form-field-container">
                    
                    
                    <div className="flex align-items-center">
                        <RadioButton
                            inputId="ceremonyOptOutNo"
                            checked={!ceremonyOptOut}
                            name="ceremonyOptOut"
                            value="No"
                            onChange={(e) => {
                                setValue('service.ceremony_opt_out', e.value === 'Yes')
                            }}
                        />
                        <label className={'ml-3'} htmlFor="ceremonyOptOutNo">
                            Recipient will attend the ceremony
                        </label>
                    </div>

                    <div className="flex align-items-center">
                        <RadioButton
                            inputId="ceremonyOptOutYes"
                            checked={ceremonyOptOut}
                            name="ceremonyOptOut"
                            value="Yes"
                            onChange={(e) => {
                                setValue('service.ceremony_opt_out', e.value === 'Yes')
                            }}
                        />
                        <label className={'ml-3'} htmlFor="ceremonyOptOutYes">
                            Recipient will <span className={"font-bold"}>not attend</span> the ceremony and will only receive an award
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </Panel>;
}
