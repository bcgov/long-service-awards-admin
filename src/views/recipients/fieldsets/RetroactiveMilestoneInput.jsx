/*!
 * Retroactive Milestone Input fieldset
 * File: RetroactiveMilestoneInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import React, {useEffect, useState} from "react";
import {useFormContext, useWatch} from "react-hook-form";
import {Panel} from "primereact/panel";
import {MultiSelect} from "primereact/multiselect";
import {useAPI} from "@/providers/api.provider.jsx";
import FieldsetHeader from "@/components/common/FieldsetHeader.jsx";

/**
 * Milestones reusable component.
 * @returns {JSX.Element} years of service, current milestone, qualifying year, prior milestones
 */

export default function RetroactiveMilestoneInput() {

    const api = useAPI();

    // load form data
    const { setValue, formState: {isLoading} } = useFormContext();

    // set local states
    const [retroactiveEligible, setRetroactiveEligible] = useState(false);
    const [retroactiveMilestones, setRetroactiveMilestones] = useState(null);
    const [currentRetroactive, setCurrentRetroactive] = useState(null);
    const [organizations, setOrganizations] = useState(null);
    const [milestones, setMilestones] = useState(null);
    const currentService = useWatch({name: 'service'});
    const currentServices = useWatch({name: 'services'});
    const currentMilestone = useWatch({name: 'service.milestone'});
    const selectedOrg = useWatch({name: 'organization'});

    // update milestones / qualifying years
    useEffect(() => {
        api.getMilestones().then(setMilestones).catch(console.error);
        api.getOrganizations().then(setOrganizations).catch(console.error);
    }, []);

    // update retroactive milestones
    const updateRetroactivePins = (value) => {
        setCurrentRetroactive(value);
        const currentCycle = currentService.cycle;
        // set retroactive
        setValue('services', (value || []).map(milestone => {
            // estimate previous cycle
            const previousCycle = parseInt(currentCycle) - (parseInt(currentMilestone) - parseInt(milestone));

            // set the service selection based on an estimate of the previous cycle
            // - use the current qualifying year to indicate when the recipient requested the pin
            // - NOTE that the data model permits recipients can register for only one milestone per cycle
            return {
                cycle: previousCycle,
                milestone: milestone,
                service_years: currentService.service_years,
                qualifying_year: currentService.qualifying_year
            }
        }) );
    }

    // is this employee's organization eligible for retroactive milestones?
    // - unclaimed service pins only available to select organizations
    useEffect(() => {
        setRetroactiveEligible((organizations || []).some(org =>
            selectedOrg
            && selectedOrg.hasOwnProperty('id')
            && org.id === selectedOrg.id
            && org.previous_service_pins));
    }, [selectedOrg, organizations]);

    // initialize available retroactive milestones based on current milestone selection
    // - org must allow retroactive service pins
    // - available milestones must be less than the current milestone selection
    useEffect(() => {
        // set eligible milestones for selected organization
        setRetroactiveMilestones((milestones || []).filter(milestone =>
            retroactiveEligible &&
            currentMilestone &&
            parseInt(milestone.name) < currentMilestone &&
            parseInt(milestone.name) < 25
            )
        );
    }, [currentMilestone, retroactiveEligible, milestones]);

    // initialize recipient's currently selected retroactive milestones
    useEffect(() => {
        // re/set current retroactive service pin selections
        if ((retroactiveMilestones || []).length > 0)
            setCurrentRetroactive((currentServices || [])
                .filter(service => currentMilestone && parseInt(service.milestone) !== parseInt(currentMilestone))
                .map(service => service.milestone));
    }, [retroactiveMilestones]);

    return <Panel
            collapsed={isLoading}
            toggleable
            className={'mb-3'}
            headerTemplate={FieldsetHeader('Retroactive Milestones')}
        >
        <div className="container">
            <div className="grid">
                <div className="col-12 form-field-container">
                    <label htmlFor={`retroactive-milestones`}>Prior Unclaimed Milestone(s)</label>
                    <MultiSelect
                        disabled={!retroactiveEligible}
                        id={'retroactive-milestones'}
                        display="chip"
                        value={currentRetroactive || ''}
                        onChange={(e) => {
                            updateRetroactivePins(e.target.value);
                        }}
                        aria-describedby={'retroactive-milestones-help'}
                        options={retroactiveMilestones || []}
                        optionLabel="label"
                        optionValue="name"
                        placeholder={
                            !!retroactiveEligible
                                ? 'Select any retroactive milestones.'
                                : 'Organization not eligible for unclaimed service pins'}
                    />

                </div>
            </div>
        </div>
    </Panel>;
}
