/*!
 * BCGEU Input fieldset
 * File: RetirementInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { Controller, useFormContext } from "react-hook-form";
import {Checkbox} from "primereact/checkbox";
import {Panel} from "primereact/panel";

/**
 * BCGEU Member reusable component.
 * @returns years of service, current milestone, qualifying year, prior milestones,
 */

export default function BCGEUInput() {

    // set local states
    const { control } = useFormContext();

    return <Panel className={'mb-3'} header={<>BCGEU Membership</>}>
        <div className="container">
            <p>BCGEU Membership</p>
            <div className="grid">
                <div className="col-12 form-field-container">
                    <div className="flex align-items-center">
                        <Controller
                            name="bcgeu"
                            control={control}
                            render={({ field, fieldState: {invalid, error} }) => (
                                <>
                                    <Checkbox
                                        id={field.name}
                                        inputId={field.name}
                                        checked={field.value || false}
                                        aria-describedby={`bcgeu-help`}
                                        value={field.value || false}
                                        onChange={(e) => {
                                            field.onChange(e.checked);
                                        }}
                                    />
                                    { invalid && <p className="error">{error.message}</p> }
                                </>
                            )}
                        />
                        <label className={'m-1'} htmlFor={`bcgeu`}>Yes, I am a BCGEU Member</label>
                    </div>
                </div>
            </div>
        </div>
    </Panel>;
}
