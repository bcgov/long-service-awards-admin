/*!
 * BCGEU Input fieldset
 * File: BCGEUInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { Controller, useFormContext } from "react-hook-form";
import {Checkbox} from "primereact/checkbox";
import {Panel} from "primereact/panel";
import FieldsetHeader from "@/components/common/FieldsetHeader.jsx";

/**
 * BCGEU Member reusable component.
 * @returns {JSX.Element}
 */

export default function BCGEUInput() {

    // set local states
    const { control } = useFormContext();

    return <Panel
        toggleable
        collapsed={true}
        className={'mb-3'}
        headerTemplate={FieldsetHeader('BCGEU Membership')}
    >
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
                        <label className={'m-1'} htmlFor={`bcgeu`}>Recipient is a BCGEU Member</label>
                    </div>
                </div>
            </div>
        </div>
    </Panel>;
}
