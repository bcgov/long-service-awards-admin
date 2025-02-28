/*!
 * Previous Awards Input fieldset
 * File: RegistrationOptionsInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import {useFormContext, useWatch} from "react-hook-form";
import {Panel} from "primereact/panel";
import { RadioButton } from 'primereact/radiobutton';
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
                        <p>
                            Recipient has previously registered for this milestone (in the last 2 years)
                            and was unable to attend the ceremony.
                        </p>
                    </div>
                    <div className="flex align-items-center"> 
                        <RadioButton
                            name="previousRegistration"
                            checked={previousRegistration === true}
                            inputId="previousRegistrationYes"
                            value='Yes'
                            onChange={(e) => {
                                setValue('service.previous_registration', e.value === 'Yes')
                                setValue('service.previous_award', false)
                            }}
                        />
                        <label className={'ml-3'} htmlFor="previousRegistrationYes">
                            Yes, recipient has previously registered for this milestone
                        </label>
                    </div>
                    
                    <div className="flex align-items-center"> 
                        <RadioButton
                            name="previousRegistration"
                            checked={!previousRegistration}
                            inputId="previousRegistrationNo"
                            value='No'
                            onChange={(e) => {
                                setValue('service.previous_registration', e.value === 'Yes')
                                setValue('service.previous_award', false)
                            }}
                        />
                        <label className={'ml-3'} htmlFor="previousRegistrationNo">
                            No, this is the first registration
                        </label>
                    </div>
                </div>
                {
                    previousRegistration && <div className="col-12 form-field-container">
                        <div className="flex align-items-center">
                            <p>
                                
                                If yes, have they received their reward?
                            </p>
                        </div>

                        <div className="flex align-items-center">
                            <RadioButton
                                name="previousAward"
                                checked={previousAward === true}
                                inputId="previousAwardYes"
                                value='Yes'
                                onChange={(e) => {
                                    setValue('service.previous_award', e.value === 'Yes')
                                }}
                            />
                            <label className={'ml-3'} htmlFor="previousAwardYes">
                                Yes, they have received their award
                            </label>
                           
                        </div>

                        <div className="flex align-items-center">
                            <RadioButton
                                name="previousAward"
                                checked={!previousAward}
                                inputId="previousAwardNo"
                                value='No'
                                onChange={(e) => {
                                    setValue('service.previous_award', e.value === 'Yes')
                                }}
                            />
                            <label className={'ml-3'} htmlFor="previousAwardNo">
                                No, they have not received their award
                            </label>
                           
                        </div>
                    </div>
                }
            </div>
        </div>
    </Panel>;
}
