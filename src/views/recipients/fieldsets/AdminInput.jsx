/*!
 * Admin Notes Input fieldset component
 * File: AdminInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import {Controller, useFormContext} from "react-hook-form";
import classNames from "classnames";
import {Panel} from "primereact/panel";
import FieldsetHeader from "@/components/common/FieldsetHeader.jsx";
import {Editor} from "primereact/editor";
import {Dropdown} from "primereact/dropdown";


/**
 * Award selection reusable component.
 * @returns years of service, current milestone, qualifying year, prior milestones,
 */

export default function AdminInput() {

    // get context / hooks
    const { control } = useFormContext();

    // define status options
    const statuses = [
        {
            label: 'Registered',
            value: 'registered'
        },
        {
            label: 'Archived',
            value: 'archived'
        },
        {
            label: 'Validated',
            value: 'validated'
        },
        {
            label: 'Self',
            value: 'self'
        },
        {
            label: 'Delegated',
            value: 'delegated'
        }];

    return <Panel
        toggleable
        collapsed={true}
        headerTemplate={FieldsetHeader('Administrative Notes')}
        className={'mb-3'}
    >
        <div className={"col-12 form-field-container"}>
            <label htmlFor={'status'}>
                Registration Status
            </label>
            <Controller
                name={`status`}
                control={control}
                rules={{required: { value: true, message: "Status is required."}}}
                render={({ field, fieldState: {invalid, error} }) => (
                    <>
                        <Dropdown
                            className={classNames({"p-invalid": error})}
                            id={field.name}
                            inputId={field.name}
                            value={field.value || ''}
                            onChange={(e) => {
                                field.onChange(e.value);
                            }}
                            aria-describedby={`status-help`}
                            options={statuses}
                            optionLabel="label"
                            optionValue="value"
                            placeholder={'Select the registration status'}
                        />
                        { invalid && <p className="error">{error.message}</p> }
                    </>
                )}
            />
        </div>
        <div className="col-12 form-field-container">
            <Controller
                name={'notes'}
                control={control}
                render={({ field, fieldState: {invalid, error} }) => (
                    <>
                        <Editor
                            id={field.name}
                            value={field.value || ''}
                            onTextChange={(e) => field.onChange(e.htmlValue)}
                            headerTemplate={<span className="ql-formats">
                                        <button className="ql-bold" aria-label="Bold"></button>
                                        <button aria-label="Ordered List"
                                                className="ql-list" value="ordered"></button>
                                        <button aria-label="Unordered List"
                                                className="ql-list" value="bullet"></button>
                                    </span>}
                            className={classNames('w-full', {"p-invalid": error})}
                            style={{ height: '320px' }}
                            aria-describedby={`award-description-help`}
                        />
                        { invalid && <p className="error">{error.message}</p> }
                    </>
                )}
            />
        </div>
    </Panel>;
}
