/*!
 * Global Setting Edit fieldset component
 * File: SettingEdit.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { Controller, useFormContext } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import {Panel} from "primereact/panel";
import classNames from 'classnames';

/**
 * Model data edit component
 * @returns {JSX.Element}
 */

export default function SettingEdit() {

    const { control } = useFormContext();

    return <Panel className={'mb-3'} header={<>Award</>}>
        <div className="container">
            <div className="grid">
                <div className="col-12 form-field-container">
                    <label htmlFor={'label'}>Name</label>
                    <Controller
                        name={'name'}
                        control={control}
                        rules={{ required: "Name is required." }}
                        render={({ field, fieldState: {invalid, error} }) => (
                            <>
                                <InputText
                                    id={field.name}
                                    value={field.value || ''}
                                    maxLength={256}
                                    className={classNames('w-full', {"p-invalid": error})}
                                    aria-describedby={`setting-name-help`}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    placeholder={`Enter a name for this settings`}
                                />
                                { invalid && <p className="error">{error.message}</p> }
                            </>
                        )}
                    />
                </div>
                <div className="col-12 form-field-container">
                    <label htmlFor={'label'}>Label</label>
                    <Controller
                        name={'label'}
                        control={control}
                        rules={{ required: "Label is required." }}
                        render={({ field, fieldState: {invalid, error} }) => (
                            <>
                                <InputText
                                    id={field.name}
                                    value={field.value || ''}
                                    maxLength={256}
                                    className={classNames('w-full', {"p-invalid": error})}
                                    aria-describedby={`setting-label-help`}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    placeholder={`Enter a label for this setting`}
                                />
                                { invalid && <p className="error">{error.message}</p> }
                            </>
                        )}
                    />
                </div>
                <div className="col-12 form-field-container">
                    <label htmlFor={'value'}>Value</label>
                    <Controller
                        name={'value'}
                        control={control}
                        render={({ field, fieldState: {invalid, error} }) => (
                            <>
                                <InputText
                                    id={field.name}
                                    value={field.value || ''}
                                    maxLength={256}
                                    className={classNames('w-full', {"p-invalid": error})}
                                    aria-describedby={`setting-vendor-help`}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    placeholder={`Enter a value for this setting`}
                                />
                                { invalid && <p className="error">{error.message}</p> }
                            </>
                        )}
                    />
                </div>
            </div>
        </div>
    </Panel>;
}
