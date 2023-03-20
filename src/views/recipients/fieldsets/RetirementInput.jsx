/*!
 * Retirement Date Selection fieldset
 * File: RetirementInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { Controller, useFormContext } from "react-hook-form";
import classNames from "classnames";
import {Checkbox} from "primereact/checkbox";
import {Calendar} from "primereact/calendar";
import {convertDate} from "@/services/validation.services.js";
import {Panel} from "primereact/panel";

/**
 * Retirement date input reusable component.
 * @returns years of service, current milestone, qualifying year, prior milestones,
 */

export default function RetirementInput() {

    //set current date and populate start and end of year based on current date
    const today = new Date();
    const year = today.getFullYear();
    const startYear = new Date(1970, 0, 0);
    const endYear = new Date(year, 11, 31);

    // set local states
    const { control, setValue, getValues } = useFormContext();

    return <Panel className={'mb-3'} header={<>Retirement Date</>}>
        <div className="container">
            <p>Has the recipient retired or is to retire this year?</p>
            <div className="grid">
                <div className="col-6 form-field-container">
                    <div className="flex align-items-center">
                        <Controller
                            name="retirement"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    id={field.name}
                                    inputId={field.name}
                                    checked={field.value || false}
                                    aria-describedby={`retirement-help`}
                                    value={field.value || ''}
                                    onChange={(e) => {
                                        setValue("retirement_date", null);
                                        field.onChange(e.checked);
                                    }}
                                />
                            )}
                        />
                        <label className={'m-1'} htmlFor={`retirement`}>Yes, I am retiring this year</label>
                    </div>
                </div>
                <div className={'col-12 form-field-container'}>
                    <label className={'m-1'} htmlFor={`retirement_date`}>
                        Retirement Date (leave blank if date is not known)
                    </label>
                    <Controller
                        name="retirement_date"
                        control={control}
                        render={({ field, fieldState: {invalid, error} }) => (
                            <>
                            <Calendar
                                disabled={!getValues('retirement')}
                                id={field.name}
                                aria-describedby={`retirement_date-help`}
                                className={ classNames('m-1', {"p-invalid": error})}
                                value={convertDate(field.value || '')}
                                onChange={(e) => {field.onChange(e.value)}}
                                dateFormat="dd/mm/yy"
                                mask="99/99/9999"
                                showIcon
                                placeholder="Select retirement date"
                                minDate={startYear}
                                maxDate={endYear}
                            />
                            { invalid && <p className="error">{error.message}</p> }
                            </>
                        )}
                    />
                    <small>Select the retirement date (if known).</small>
                </div>
            </div>
        </div>
    </Panel>;
}
