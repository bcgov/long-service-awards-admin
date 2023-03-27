/*!
 * Award Edit fieldset component
 * File: AwardEdit.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { Controller, useFormContext } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import {Panel} from "primereact/panel";
import classNames from 'classnames';
import {Checkbox} from "primereact/checkbox";

/**
 * Model data edit component
 * @returns {JSX.Element}
 */

export default function OrganizationEdit() {

    const { control } = useFormContext();

    return <Panel className={'mb-3'} header={<>Award</>}>
        <div className="container">
            <div className="grid">
                <div className="col-12 flex align-items-center">
                    <Controller
                        name="active"
                        control={control}
                        render={({ field, fieldState: {invalid, error} }) => (
                            <>
                                <Checkbox
                                    id={field.name}
                                    inputId={field.name}
                                    checked={field.value || false}
                                    aria-describedby={`active-help`}
                                    value={field.value || false}
                                    onChange={(e) => {
                                        field.onChange(e.checked);
                                    }}
                                />
                                { invalid && <p className="error">{error.message}</p> }
                                <label className={'m-1'} htmlFor={`active`}>Activate</label>
                            </>
                        )}
                    />
                </div>
                <div className="col-12 form-field-container">
                    <label htmlFor={'name'}>Name</label>
                    <Controller
                        name={'name'}
                        control={control}
                        render={({ field, fieldState: {invalid, error} }) => (
                            <>
                                <InputText
                                    id={field.name}
                                    value={field.value || ''}
                                    maxLength={128}
                                    className={classNames('w-full', {"p-invalid": error})}
                                    aria-describedby={`organization-name-help`}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    placeholder={`Enter the full organization name`}
                                />
                                { invalid && <p className="error">{error.message}</p> }
                            </>
                        )}
                    />
                </div>
                <div className="col-12 form-field-container">
                    <label htmlFor={'abbreviation'}>Abbreviation</label>
                    <Controller
                        name={'abbreviation'}
                        control={control}
                        rules={{ required: "Abbreviation is required." }}
                        render={({ field, fieldState: {invalid, error} }) => (
                            <>
                                <InputText
                                    id={field.name}
                                    value={field.value || ''}
                                    max={64}
                                    className={classNames('w-full', {"p-invalid": error})}
                                    aria-describedby={`organization-abbreviation-help`}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    placeholder={`Enter the organization's abbreviated name`}
                                />
                                { invalid && <p className="error">{error.message}</p> }
                            </>
                        )}
                    />
                </div>
                <div className="col-12 flex align-items-center">
                    <Controller
                        name="previous_service_pins"
                        control={control}
                        render={({ field, fieldState: {invalid, error} }) => (
                            <>
                                <Checkbox
                                    id={field.name}
                                    inputId={field.name}
                                    checked={field.value || false}
                                    aria-describedby={`organization-previous_service_pins-help`}
                                    value={field.value || false}
                                    onChange={(e) => {
                                        field.onChange(e.checked);
                                    }}
                                />
                                { invalid && <p className="error">{error.message}</p> }
                                <label className={'m-1'} htmlFor={`previous_service_pins`}>Allows Retroactive Pins</label>
                            </>
                        )}
                    />
                </div>
            </div>
        </div>
    </Panel>;
}
