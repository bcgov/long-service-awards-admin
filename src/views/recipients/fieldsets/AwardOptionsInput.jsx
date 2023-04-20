/*!
 * Award Options Input fieldset component
 * File: AwardOptionsInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { useEffect, useState} from "react";
import {Controller, useFormContext, useForm, useWatch} from "react-hook-form";
import { InputText } from "primereact/inputtext";
import classNames from "classnames";
import {Button} from "primereact/button";
import PecsfInput from "@/views/recipients/fieldsets/PecsfInput.jsx";
import EngravingInput from "@/views/recipients/fieldsets/EngravingInput.jsx";
import parse from "html-react-parser"
import {ListBox} from "primereact/listbox";

/**
 * Common Award Options Component.
 * @returns variable award options for text, radio buttons, multiselect, and dropdown
 */

export default function AwardOptionsInput({award, confirm, cancel, regControl}) {

    // set states
    const [awardOptions, setAwardOptions] = useState([]);
    const { getValues } = useFormContext();
    const currentServiceID = useWatch({regControl, name: "service.id",});

    // create award options form
    // - set default PECSF donation type to 'pool' if charity is null
    const {
        reset,
        control,
        handleSubmit,
        setValue,
        formState: {errors},
    } = useForm({
        mode: "onBlur",
        defaultValues: {
            donation: getValues('service.awards.options.pecsf_charity') || 'pool'
        }});

    /**
     * Get award option schema for award selection
     * - group award options by type
     * - multiple of same type are converted to selection dropdowns
     * - customizable types are handled as text inputs
     * - PECSF options are handled in separate fieldset component
     * */

    useEffect(() => {
        const {options} = award || {};
        setAwardOptions((options || []).reduce(function(rv, x) {
                (rv[x.type] = rv[x.type] || []).push(x);
                return rv;
            }, {})
        );

    }, [award]);

    /**
     * Confirm selection of award options
     * - Check if option has existing value in registration form context
     * - PECSF options are set by the name
     * - Engravings with character limits are set by item size
     * */

    const confirmOptions = (selectedOptions) => {
        // get engraving size (if exists)
        const engravingSize = selectedOptions.hasOwnProperty('options') && selectedOptions.options;
        // get available options for award
        const { options } = award || {};
        // map recipient option selections to available options in form context
        const filteredOptions = (options || [])
            .filter(({type, name, value, customizable}) => {
                // filter available options by selected ones
                return ( selectedOptions.hasOwnProperty(type) && customizable)
                    || (selectedOptions.hasOwnProperty(type) && selectedOptions[type] === value)
                    || (type === 'pecsf-charity' && selectedOptions.hasOwnProperty(name))
                    || (type.includes('certificate') && selectedOptions.hasOwnProperty(name))
            })
            .filter(({type, name, value, customizable}) => {
                // filter engraving size to selected one
                return (type !== 'engraving' || name === engravingSize)
            })
            .map((option) => {
                const {type, name, value, customizable} = option || {};
                return {
                    service: currentServiceID,
                    award_option: option,
                    custom_value: customizable && selectedOptions[name]
                        ? selectedOptions[name]
                        : type === 'engraving'
                            && selectedOptions.hasOwnProperty('engraving')
                            && selectedOptions.options === name
                                ? selectedOptions['engraving']
                                : value,
                    pecsf_charity: type === 'pecsf-charity' ? selectedOptions[name] : null
                }
            });
        // DEBUG ===
        // console.log(selectedOptions, filteredOptions)
        // confirm award option updates
        confirm(filteredOptions);
    }

    /**
     * Check if option has existing value in registration form context
     * */

    const getCurrentValue = (field, key) => {
        // get current award ID
        const currentAward = getValues('service.awards.award') || {};
        // get option selections
        const selections = getValues('service.awards.selections') || [];
        // console.log('Current Selections:', selections, currentAward, field)
        // filter award option selections to match award option schema
        const {custom_value, award_option} = (award && award.id) === (currentAward && currentAward.id)
        && selections.find(({award_option}) => {
            return award_option.hasOwnProperty(key) && field === award_option[key];
        }) || {};
        const {customizable} = award_option || {};
        return customizable ? custom_value : award_option && award_option.value;
    }

    /**
     * Dropdown item component template
     * */

    const dropdownItemTemplate = (option) => {
        if (option) {
            return (
                <div key={option.id} className="flex align-items-center">
                    <span>{option.label}: {option.description}</span>
                </div>
            );
        }
        return <span>Select An Option</span>;
    };

    /**
     * Award option fieldset templates
     * */

    const OptionInputTemplate = () => {
        const templates = {
            textInput: (option) => {
                const currentMessage = getCurrentValue(option.name, 'name');
                return <>
                    <h4>{option.label}</h4>
                    {currentMessage && <p style={{fontWeight: 'bold'}}>Current Message: "{currentMessage}" </p>}
                    <label htmlFor={option.name}>{ option.description }</label>
                    <Controller
                        defaultValue={currentMessage}
                        name={option.name}
                        control={control}
                        rules={{
                            required: "This field is required.",
                            maxLength: parseInt(option.value)
                        }}
                        render={({ field, fieldState: {invalid, error} }) => (
                            <>
                                <InputText
                                    id={field.name}
                                    value={field.value || ''}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    aria-describedby={`award-option-help`}
                                    className={classNames({"p-invalid": error})}
                                    placeholder={ option.description }
                                />
                                <div><small>Maximum {option.value} characters.</small></div>
                                { invalid && <p className="error">{error.message}</p> }
                            </>
                        )} />
                </>

            },
            dropdown: (options) => {
                return options.length > 0 &&
                    <>
                        <label htmlFor={options[0].name}>
                            {award && award.label}: Select An Option
                        </label>
                        <Controller
                            defaultValue={getCurrentValue(options[0].type, 'type')}
                            name={options[0].type}
                            control={control}
                            rules={{
                                required: "This field is required.",
                            }}
                            render={({ field, fieldState: {invalid, error} }) => (
                                <>
                                    <ListBox
                                        id={field.name}
                                        value={field.value || ''}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        options={options}
                                        itemTemplate={dropdownItemTemplate}
                                        className={classNames("w-full", {"p-invalid": error})}
                                        aria-describedby={`award-options-help`}
                                        listStyle={{ maxHeight: '250px' }}
                                    />
                                    { invalid && <p className="error">{error.message}</p> }
                                </>
                            )} />
                    </>
            }
        }

        return <>
            {
                Object.keys(awardOptions || {}).length > 0
                && <h3>Award Options (please complete the following)</h3>
            }
            {
                Object.keys(awardOptions || {}).map((key, index) => {
                    // handle special options
                    const pecsf = key === 'pecsf-charity';
                    const engraving = key === 'engraving';
                    // handle multi-option dropdowns
                    const multiselect = awardOptions[key].length > 1;
                    // handle multi-option dropdowns
                    return <div key={`award-option-${index}`} className={'col-12 form-field-container'}>
                        { pecsf && <PecsfInput control={control} setValue={setValue} /> }
                        { engraving && <EngravingInput award={award} control={control} setValue={setValue} /> }
                        { !pecsf && !engraving && multiselect && templates.dropdown(awardOptions[key]) }
                        { !pecsf && !engraving && !multiselect && templates.textInput(awardOptions[key][0]) }
                    </div>

                })
            }
        </>;
    }

    return <div className={'grid'}>
        <form onSubmit={handleSubmit(confirmOptions)}>
            {
                award && <div>{ parse(award.description || '')}</div>
            }
            <OptionInputTemplate />
            <div>
                <Button
                    type={'submit'}
                    className={'p-button-success m-1'}
                    icon="pi pi-check"
                    label="Confirm Award Selection"
                />
                <Button
                    type={'button'}
                    className={'m-1'}
                    onClick={cancel}
                    icon="pi pi-times"
                    label="Cancel"
                />
                {
                    award && award.options.length > 0 && <Button
                        type={'button'}
                        className={'p-button-info m-1'}
                        label="Reset"
                        onClick={() => {
                            reset()
                        }}
                    />
                }
            </div>
            {
                Object.keys(errors || {}).length > 0
                && <p className={'error'}>The form has errors. Please check the fields above.</p>
            }
        </form>
    </div>;
}
