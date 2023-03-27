/*!
 * Milestone Input fieldset
 * File: MilestoneInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import {useEffect, useState} from "react";
import ServiceCalculator from "@/components/common/ServiceCalculator.jsx";
import {Controller, useFormContext, useWatch} from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import {Button} from "primereact/button";
import {Panel} from "primereact/panel";
import {useAPI} from "@/providers/api.provider.jsx";
import classNames from "classnames";
import FieldsetHeader from "@/components/common/FieldsetHeader.jsx";

/**
 * Milestones reusable component.
 * @param {object} props
 * @returns {JSX.Element} years of service, current milestone, qualifying year, prior milestones
 */

export default function MilestoneInput({ validate, threshold=5 }) {

    // load contexts / hooks
    const api = useAPI();

    // load form data
    const {
        control,
        setValue,
        getValues,
        clearErrors,
        resetField
    } = useFormContext();

    // set local states
    const [milestones, setMilestones] = useState([]);
    const [qualifyingYears, setQualifyingYears] = useState([]);
    const [calculatorButton, setCalculatorButton] = useState(false);
    const [calculatorDropdown, setCalculatorDropdown] = useState(false);
    const [complete, setComplete] = useState(false);

    // watch milestones and service years
    const currentMilestone = useWatch('service.milestone');
    const currentServiceYears = useWatch('service.service_years');

    // update milestones / qualifying years
    useEffect(() => {
        api.getMilestones().then(setMilestones).catch(console.error);
        api.getQualifyingYears().then(setQualifyingYears).catch(console.error);
    }, []);

    // auto-validate fieldset
    useEffect(() => {
        setComplete(validate(getValues()) || false);
    }, [useWatch()]);

    // Handle years of service change and update fields in state
    const onYearsOfServiceChange = () => {
        resetField(`service.milestone`, { defaultValue: "" });
        resetField(`service.prior_milestones`, { defaultValue: [] });
        resetField(`service.qualifying_year`, { defaultValue: "" });
    };

    // toggle service calculator
    const toggleCalculator = (e) => {
        e.preventDefault();
        setCalculatorButton(!calculatorButton);
        setCalculatorDropdown(!calculatorDropdown);
    };

    // update total service years form value
    const setTotalYears = (newValue) => {
        if (newValue !== 0) {
            setValue(`service.service_years`, newValue);
            clearErrors(`service.service_years`);
            onYearsOfServiceChange();
        }
    };

    return <Panel
        collapsed
        toggleable
        className={'mb-3'}
        headerTemplate={FieldsetHeader('Milestone', complete)}
        >
        <div className="container">
            <div className="grid">
                <div className={'col-12 form-field-container'}>
                    <label htmlFor={'service_years'}>
                        Enter recipient's total BCPS years of service
                    </label>
                    <Controller
                        name={`service.service_years`}
                        control={control}
                        rules={{
                            required: "Enter the number of BCPS service years.",
                            min: { value: 5, message: "Must be at least 5 years."}
                        }}
                        render={({ field, fieldState: { error} }) => (
                            <>
                                <div className="p-inputgroup">
                                    <InputNumber
                                        min={0}
                                        max={99}
                                        id={field.name}
                                        value={field.value || ''}
                                        onChange={(e) => {
                                            field.onChange(Math.min(e.value, 99));
                                            onYearsOfServiceChange();
                                        }}
                                        aria-describedby={`service_years-help`}
                                        className={classNames({"p-invalid": error})}
                                        placeholder={`Enter total years of service`}
                                    />
                                    <Button
                                        label={calculatorButton ? "Hide Calculator" : "Show Calculator"}
                                        onClick={toggleCalculator}
                                    />
                                </div>
                                { error && <p className="error">{error.message}</p> }
                            </>
                        )}
                    />

                </div>
                <div className={'col-12 form-field-container'}>
                    {
                        calculatorDropdown &&
                        <ServiceCalculator formSubmit={(newValue) => setTotalYears(newValue)} />
                    }
                </div>
                <div className={"col-12 form-field-container"}>
                    <label htmlFor={'service.milestone'}>
                        Recipient's Milestone Year
                    </label>
                    <Controller
                        name={`service.milestone`}
                        control={control}
                        rules={{required: { value: true, message: "Milestone selection is required."}}}
                        render={({ field, fieldState: {invalid, error} }) => (
                            <>
                                <Dropdown
                                    className={classNames({"p-invalid": error})}
                                    disabled={!currentServiceYears}
                                    id={field.name}
                                    inputId={field.name}
                                    value={field.value || ''}
                                    onChange={(e) => {
                                        field.onChange(e.value);
                                    }}
                                    aria-describedby={`milestone-help`}
                                    options={(milestones || []).filter(
                                        opt => opt['name'] <= getValues('service.service_years')
                                            && opt['name'] >= threshold
                                    ).reverse() || []}
                                    optionLabel="label"
                                    optionValue="name"
                                    placeholder={
                                        currentServiceYears
                                            ? `Select the current milestone`
                                            : `First Enter Service Years Above`}
                                />
                                { invalid && <p className="error">{error.message}</p> }
                            </>
                        )}
                    />
                </div>
                <div className="col-12 form-field-container">
                    <label htmlFor={'qualifying_year'}>
                        In what year did the recipient reach this milestone?
                    </label>
                    <Controller
                        name={'service.qualifying_year'}
                        control={control}
                        rules={{required: "Qualifying Year is required."}}
                        render={({ field, fieldState: {invalid, error}  }) => (
                            <>
                                <Dropdown
                                    className={'w-full'}
                                    disabled={!currentServiceYears || !currentMilestone}
                                    id={field.name}
                                    value={field.value || ''}
                                    onChange={(e) => field.onChange(e.value)}
                                    aria-describedby={'qualifying_year-help'}
                                    options={qualifyingYears}
                                    optionLabel="name"
                                    optionValue="name"
                                    tooltip="Select the year that qualified for the current milestone."
                                    tooltipOptions={{ position: "top" }}
                                    placeholder={`During which year was this milestone reached?`}
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
