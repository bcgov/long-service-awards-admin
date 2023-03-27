/*!
 * Engraving Award Options fieldset component
 * File: EngravingInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { useEffect, useState } from "react";
import {Controller, useFormContext, useWatch} from "react-hook-form";
import classNames from "classnames";
import {InputText} from "primereact/inputtext";

/**
 * Pecsf Award Options Component.
 * @returns pecsf award and options
 */

export default function EngravingInput({award, control, setValue }) {

    // get values from registration form 
    const { getValues } = useFormContext();

    // initialize engraving local states
    const [engravingOption, setEngravingOption] = useState(null);

    // monitor item size
    const currentItemSize = useWatch({control, name: "options"});

    /**
     * Initialize PECSF selections from form data
     * */

    useEffect( () => {
        // get any previous selections
        const { selections } = getValues('service.awards') || {};
        // get options for selected award
        const { id, options } = award || {};
        // get engraving size options for item
        const engravingSizes = (options || []).filter(({award, type}) => type === 'engraving' && award === id);
        const selectedEngravingOption = (engravingSizes || [])
            .find(({name}) => name === currentItemSize);
        // select the corresponding engraving size for selected item size
        // - engraving option name is the key for the item size
        setEngravingOption(selectedEngravingOption);
        // filter selections by current award selection and engraving type
        // - engraving option is selected by item size
        const {custom_value} = (selections || [])
            .find(({award_option}) =>
                award_option.award === id
                && selectedEngravingOption
                && selectedEngravingOption.type === 'engraving'
                && selectedEngravingOption.id === award_option.id
                && selectedEngravingOption.value === award_option.value
            ) || {};
        // set current message to custom value
        setValue('engraving', custom_value);
    }, [currentItemSize]);

    return <>
        <h4>Engraving</h4>
        <label htmlFor={'engraving'}>{ '' }</label>
        <Controller
            name={'engraving'}
            control={control}
            render={({ field, fieldState: {invalid, error} }) => (
                <>
                    <InputText
                        disabled={!engravingOption}
                        maxLength={engravingOption ? parseInt(engravingOption.value || '') : 0}
                        id={field.name}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value)}
                        aria-describedby={`award-option-help`}
                        className={classNames({"p-invalid": error})}
                        placeholder={
                            engravingOption
                                ? `Optional engraved message`
                                : 'Select an item size'
                        }
                    />
                    <div><small>{
                        engravingOption
                            ? `Maximum ${engravingOption.value} characters.`
                            : 'To add an engraving, first select an item size'
                    }</small></div>
                    { invalid && <p className="error">{error.message}</p> }
                </>
            )} />
    </>

}