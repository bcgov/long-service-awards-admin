/*!
 * Previous Awards Input fieldset
 * File: RegistrationOptionsInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import {useFormContext, useWatch} from "react-hook-form";
import {Panel} from "primereact/panel";
import {SelectButton} from "primereact/selectbutton";
import FieldsetHeader from "@/components/common/FieldsetHeader.jsx";

/**
 * Registration options component.
 * @returns {JSX.Element}
 */

export default function RegistrationOptionsInput() {

    // set local states
    const { control, setValue } = useFormContext();

    const previousRegistration = useWatch({control, name: "service.previous_registration"});
    const previousAward = useWatch({control, name: "service.previous_award"});

    return <Panel
        toggleable
        collapsed={true}
        className={'mb-3'}
        headerTemplate={FieldsetHeader('Registration Options')}
    >
        <div className="container">
            <div className="grid">
                <div className="col-12 form-field-container">
                    <div className="flex align-items-center">
                        <SelectButton
                            className={'radio-toggle'}
                            value={previousRegistration ? 'Yes' : 'No'}
                            onChange={(e) => {
                                setValue('service.previous_registration', e.value === 'Yes')
                                setValue('service.previous_award', false)
                            }}
                            options={['Yes', 'No']}
                        />
                        <label className={'ml-3'}>
                            Recipient has previously registered for this milestone (in the last 2 years)
                            and was unable to attend the ceremony.
                        </label>
                    </div>
                </div>
                {
                    previousRegistration && <div className="col-12 form-field-container">
                        <div className="flex align-items-center">
                            <SelectButton
                                className={'radio-toggle'}
                                value={previousAward ? 'Yes' : 'No'}
                                onChange={(e) => {
                                    setValue('service.previous_award', e.value === 'Yes')
                                }}
                                options={['Yes', 'No']}
                            />
                            <label className={'ml-3'}>
                                If yes, have they received their award?
                            </label>
                        </div>
                    </div>
                }
            </div>
        </div>
    </Panel>;
}
