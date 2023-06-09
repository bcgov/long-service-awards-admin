/*!
 * PECSF Award Options fieldset component
 * File: PecsfInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { useEffect, useState } from "react";
import {Controller, useFormContext } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import classNames from "classnames";
import {RadioButton} from "primereact/radiobutton";
import {useAPI} from "@/providers/api.provider.jsx";

/**
 * Pecsf Award Options Component.
 * @returns pecsf award and options
 */

export default function PecsfInput({control, setValue }) {

    // get values from registration form 
    const { getValues } = useFormContext();
    const api = useAPI();

    // initialize PECSF local states
    const [pool, setPool] = useState(true);
    const [regions, setRegions] = useState([]);
    const [charities, setCharities] = useState([]);
    const [filteredCharities1, setFilteredCharities1] = useState([]);
    const [filteredCharities2, setFilteredCharities2] = useState([]);
    const [selectedRegion1, setSelectedRegion1] = useState(null);
    const [selectedRegion2, setSelectedRegion2] = useState(null);

    /**
     * Initialize PECSF selections from form data
     * */

    useEffect( () => {
        const currentAward = getValues('service.awards');
        const { selections, award } = currentAward || {};
        const { id } = award || {};
        // filter selections by current award selection
        return (selections || [])
            .filter(({award_option}) => award_option.award === id)
            .forEach(({award_option, pecsf_charity}) => {
            const {name} = award_option || {};
            // if charities are selected, update states and PECSF form data
            if (pecsf_charity) {
                // set PECSF donation type to non-pool
                setPool(false);
                setValue('donation', 'charities')
                const {region, id} = pecsf_charity || {};
                // set selected regions
                if (name === 'pecsf-charity-1') {
                    setValue('pecsf-region-1', region);
                    setSelectedRegion1(region)
                }
                else {
                    setValue('pecsf-region-2', region);
                    setSelectedRegion2(region)
                }
                // set charity to selected option ID value
                setValue(name, id);
            }
        });
    }, [charities]);

    /**
     * Load PECSF options (regions and charities)
     * */

    useEffect(() => {
        // load PECSF charities
        api.getPecsfCharities().then(setCharities).catch(console.error);
        // load PECSF charity regions
        api.getPecsfRegions().then(setRegions).catch(console.error);
    }, []);

    /**
     * Filter charities by selected region
     * */

    useEffect(() => {
        setFilteredCharities1(charities.filter(charity => {
            return charity.region === selectedRegion1
        }))
        setFilteredCharities2(charities.filter(charity => {
            return charity.region === selectedRegion2
        }))
    }, [charities, selectedRegion1, selectedRegion2]);

    /**
     * Reset PECSF options
     * */

    const resetOptions = () => {
        setPool(true);
        setValue('pecsf-region-1', '');
        setValue('pecsf-charity-1', '');
        setSelectedRegion1(null);
        setValue('pecsf-region-2', '');
        setValue('pecsf-charity-2', '');
        setSelectedRegion2(null);
    }

    return <>
        <h4>PECSF Donation Options</h4>
        <div className="m-1 flex align-items-center">
            <RadioButton 
                onChange={() => {
                     setPool(true)
                     resetOptions();
                 }}
                 inputId="pool"
                 value="pool"
                 checked={pool}
            />
            <label htmlFor={'pool'} className="m-2">
                Donate to the PECSF Regional Pool Fund
            </label>
        </div>
        <div className="m-1 flex align-items-center">
            <RadioButton
                onChange={() => {
                    setPool(false)
                }}
                inputId="charities"
                value="charities"
                checked={!pool}
            />
            <label htmlFor="charities" className="m-2">
                Donate to a registered charitable organization (maximum of two)
            </label>
        </div>


        { pool
            ? <h4>PECSF Charities (not selected) </h4>
            : <h4>Select the PECSF Charities</h4> }

        <div className={'container'}>
            <div className={'grid'}>
                <div className={'col-12 form-field-container'}>
                    <label htmlFor={'pecsf-region-1'}>PECSF Region 1</label>
                    <Controller
                        name={'pecsf-region-1'}
                        control={control}
                        rules={{
                            validate: { required: v => pool || !!v }
                        }}
                        render={({ field, fieldState: {invalid} }) => (
                            <>
                                <Dropdown
                                    disabled={pool}
                                    id={field.name}
                                    inputId={field.name}
                                    value={field.value}
                                    filter
                                    onChange={(e) => {
                                        setSelectedRegion1(e.target.value)
                                        field.onChange(e.target.value)
                                    }}
                                    aria-describedby={`pecsf-region-1-options-help`}
                                    options={regions}
                                    optionValue={'name'}
                                    optionLabel={'name'}
                                    className={classNames("w-full md:w-26rem", {"p-invalid": invalid})}
                                    placeholder={'Select the first PECSF region'}
                                />
                                { invalid && <p className="error">Please select a region</p> }
                            </>
                        )} />
                </div>
                <div className={'col-12 form-field-container'}>
                    <label htmlFor={'pecsf-charity-1'}>PECSF Charity 1</label>
                    <Controller
                        name={'pecsf-charity-1'}
                        control={control}
                        rules={{
                            validate: { required: v => pool || !!v }
                        }}
                        render={({ field, fieldState: {invalid, error} }) => (
                            <>
                                <Dropdown
                                    disabled={pool || !selectedRegion1}
                                    id={field.name}
                                    inputId={field.name}
                                    value={field.value || ''}
                                    filter
                                    onChange={(e) => field.onChange(e.target.value)}
                                    aria-describedby={`pecsf-charity-1-options-help`}
                                    options={filteredCharities1}
                                    optionValue={'id'}
                                    optionLabel={'label'}
                                    className={classNames("w-full md:w-26rem", {"p-invalid": error})}
                                    placeholder={ pool && selectedRegion1
                                        ?  'Select a regional charity' : 'Select a region to view available charities'}
                                />
                                { invalid && <p className="error">Please select a charity</p> }
                            </>
                        )} />
                </div>
                <div className={'col-12 form-field-container'}>
                    <label htmlFor={'pecsf-region-2'}>PECSF Region 2</label>
                    <Controller
                        name={'pecsf-region-2'}
                        control={control}
                        render={({ field, fieldState: {invalid} }) => (
                            <>
                                <Dropdown
                                    disabled={pool}
                                    id={field.name}
                                    inputId={field.name}
                                    value={field.value}
                                    filter
                                    onChange={(e) => {
                                        setSelectedRegion2(e.target.value)
                                        field.onChange(e.target.value)
                                    }}
                                    aria-describedby={`pecsf-region-2-options-help`}
                                    options={regions}
                                    optionValue={'name'}
                                    optionLabel={'name'}
                                    className={classNames("w-full md:w-26rem", {"p-invalid": invalid})}
                                    placeholder={'Select the second PECSF region (optional)'}
                                />
                            </>
                        )} />
                </div>
                <div className={'col-12 form-field-container'}>
                    <label htmlFor={'pecsf-charity-2'}>PECSF Charity 2</label>
                    <Controller
                        name={'pecsf-charity-2'}
                        control={control}
                        rules={{
                            validate: { required: v => pool || !selectedRegion2 || !!v }
                        }}
                        render={({ field, fieldState: {invalid, error} }) => (
                            <>
                                <Dropdown
                                    disabled={pool || !selectedRegion2}
                                    id={field.name}
                                    inputId={field.name}
                                    value={field.value || ''}
                                    filter
                                    onChange={(e) => field.onChange(e.target.value)}
                                    aria-describedby={`pecsf-charity-2-options-help`}
                                    options={filteredCharities2}
                                    optionValue={'id'}
                                    optionLabel={'label'}
                                    className={classNames("w-full md:w-26rem", {"p-invalid": error})}
                                    placeholder={ !pool && selectedRegion1
                                        ?  'Select a regional charity' : 'Select a region to view available charities'}
                                />
                                { invalid && <p className="error">Please select a charity</p> }
                            </>
                        )} />
                </div>
            </div>
        </div>
    </>
}
