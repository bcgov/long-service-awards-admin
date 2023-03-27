/*!
 * Award Options Edit fieldset component
 * File: AwardOptionsEdit.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import {Controller, useFieldArray, useFormContext} from "react-hook-form";
import { InputText } from "primereact/inputtext";
import {Panel} from "primereact/panel";
import classNames from 'classnames';
import {Fieldset} from "primereact/fieldset";
import {Checkbox} from "primereact/checkbox";
import {Button} from "primereact/button";

/**
 * Model data edit component
 * @returns {JSX.Element}
 */

export default function AwardOptionsEdit() {

    const { control, getValues } = useFormContext();
    // create field array for option data
    const { fields, prepend, remove } = useFieldArray({
        control, // control props comes from useForm
        name: "options", // unique name for your Field Array
    });

    // define default option obj

    const defaultOption = {
        award: getValues('id'),
        type: '',
        name: '',
        value: '',
        label: '',
        description: '',
        customizable: false
    }

    return <Panel className={'mb-3'} header={<>Award Options</>}>
        <Button
            className={'m-3 w-full'}
            label={'Add Option'}
            severity={"info"}
            icon="pi pi-plus"
            onClick={(e) => {
                e.preventDefault();
                prepend(defaultOption);
            }}
        />
        {
            (fields || []).map((item, index) => (
                <Fieldset key={`award-option-${item.id}`} className={'mb-3'} legend={`Option ${index + 1}`}>
                    <div className="container">
                        <div className="grid">
                            <div className="col-12 form-field-container">
                                <label htmlFor={`options.${index}.type`}>Option Type</label>
                                <Controller
                                    name={`options.${index}.type`}
                                    control={control}
                                    rules={{ required: "Option Type is required." }}
                                    render={({ field, fieldState: {invalid, error} }) => (
                                        <>
                                            <InputText
                                                id={field.name}
                                                value={field.value || ''}
                                                className={classNames('w-full', {"p-invalid": error})}
                                                aria-describedby={`award-option-type-help`}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                placeholder={`Enter a type for this award`}
                                            />
                                            { invalid && <p className="error">{error.message}</p> }
                                        </>
                                    )}
                                />
                            </div>
                            <div className="col-12 form-field-container">
                                <label htmlFor={`options.${index}.name`}>Name</label>
                                <Controller
                                    name={`options.${index}.name`}
                                    control={control}
                                    rules={{ required: "Name is required." }}
                                    render={({ field, fieldState: {invalid, error} }) => (
                                        <>
                                            <InputText
                                                id={field.name}
                                                value={field.value || ''}
                                                className={classNames('w-full', {"p-invalid": error})}
                                                aria-describedby={`award-options-name-help`}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                placeholder={`Enter a name for this award`}
                                            />
                                            { invalid && <p className="error">{error.message}</p> }
                                        </>
                                    )}
                                />
                            </div>
                            <div className="col-12 form-field-container">
                                <label htmlFor={`options.${index}.label`}>Label</label>
                                <Controller
                                    name={`options.${index}.label`}
                                    control={control}
                                    rules={{ required: "Label is required." }}
                                    render={({ field, fieldState: {invalid, error} }) => (
                                        <>
                                            <InputText
                                                id={field.name}
                                                value={field.value || ''}
                                                className={classNames('w-full', {"p-invalid": error})}
                                                aria-describedby={`award-option-label-help`}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                placeholder={`Enter a label for this award option`}
                                            />
                                            { invalid && <p className="error">{error.message}</p> }
                                        </>
                                    )}
                                />
                            </div>
                            <div className="col-12 form-field-container">
                                <label htmlFor={`options.${index}.description`}>Description</label>
                                <Controller
                                    name={`options.${index}.description`}
                                    control={control}
                                    rules={{
                                        required: "Description is required."
                                    }}
                                    render={({ field, fieldState: {invalid, error} }) => (
                                        <>
                                            <InputText
                                                id={field.name}
                                                value={field.value || ''}
                                                className={classNames('w-full', {"p-invalid": error})}
                                                aria-describedby={`award-option-description-help`}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                placeholder={`Enter a description for this award option`}
                                            />
                                            { invalid && <p className="error">{error.message}</p> }
                                        </>
                                    )}
                                />
                            </div>
                            <div className="col-12 form-field-container">
                                <label htmlFor={`options.${index}.value`}>Option Value</label>
                                <Controller
                                    name={`options.${index}.value`}
                                    control={control}
                                    render={({ field, fieldState: {invalid, error} }) => (
                                        <>
                                            <InputText
                                                id={field.name}
                                                value={field.value || ''}
                                                maxLength={64}
                                                className={classNames('w-full', {"p-invalid": error})}
                                                aria-describedby={`award-option-value-help`}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                placeholder={`Enter a value for this award option`}
                                            />
                                            { invalid && <p className="error">{error.message}</p> }
                                        </>
                                    )}
                                />
                            </div>
                            <div className="col-12 flex align-items-center">
                                <Controller
                                    name={`options.${index}.customizable`}
                                    control={control}
                                    render={({ field, fieldState: {invalid, error} }) => (
                                        <>
                                            <Checkbox
                                                id={field.name}
                                                inputId={field.name}
                                                checked={field.value || false}
                                                aria-describedby={`award-option-customizable-help`}
                                                value={field.value || false}
                                                onChange={(e) => {
                                                    field.onChange(e.checked);
                                                }}
                                            />
                                            { invalid && <p className="error">{error.message}</p> }
                                            <label className={'m-1'} htmlFor={`active`}>Make Customizable</label>
                                        </>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <Button
                        className={'m-2 w-full p-button-danger'}
                        label={'Remove Award Option'}
                        severity={"info"}
                        icon="pi pi-minus"
                        onClick={(e) => {e.preventDefault(); remove(index);}}
                    />
                </Fieldset>
            ))}
    </Panel>;
}
