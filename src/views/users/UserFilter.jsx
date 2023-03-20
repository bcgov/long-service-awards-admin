/*!
 * LSA.Admin.Components.RecipientsSFiule
 * File: RecipientsSort.jsx
 * Copyright(c) 2023 Government of British Columbia
 * Version 2.0
 * MIT Licensed
 */

import React, {useEffect, useState} from 'react';
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import {MultiSelect} from "primereact/multiselect";
import {useAPI} from "@/providers/api.provider.jsx";
import {InputSwitch} from "primereact/inputswitch";

function UserFilter({data, confirm, cancel}) {
    const api = useAPI();
    const [loading, setLoading] = useState(false);

    console.log(data)

    // init filter settings
    const [organizations, setOrganizations]= useState([]);
    const [milestones, setMilestones]= useState([]);
    const [filters, setFilters]= useState(data || {});
    const schema = {
        global: {
            label: 'Global'
        },
        status: {
            label: 'Status'
        },
        first_name: {
            label: 'First Name',
            input: 'text'
        },
        last_name: {
            label: 'Last Name',
            input: 'text'
        },
        employee_number: {
            label: 'Employee Number',
            input: 'text'
        },
        organization: {
            label: 'Organizations',
            input: 'multiselect',
            valueKey: 'id',
            labelKey: 'name',
            options: organizations,
        },
        cycle: {
            label: 'LSA Cycle'
        },
        milestones: {
            label: 'Milestones',
            input: 'multiselect',
            valueKey: 'name',
            labelKey: 'label',
            options: milestones
        },
        qualifying_year: {
            label: 'Qualifying Year'
        },
        ceremony: {
            label: 'Ceremony',
        },
        confirmed: {
            label: 'Confirmed',
            input: 'switch'
        },
        updated_at: {
            label: 'Last Updated Date'
        },
        created_at: {
            label: 'Created Date'
        },
    };

    // init filters data
    useEffect( () => {
        setFilters(data)
        setLoading(true);
        api.getOrganizations()
            .then(setOrganizations)
            .catch(console.error)
            .finally(() => setLoading(false));
        api.getMilestones()
            .then(setMilestones)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return <>
        {
            Object.entries(filters).map(([key, filterValue]) => {
                const {
                    label='',
                    input='',
                    options=[],
                    valueKey='',
                    labelKey='' } = schema.hasOwnProperty(key) ? schema[key] : {};
                return (
                    <div key={`recipient-filter-${key}`} className="w-85 flex justify-content-between px-3">
                        {
                            input === 'text' && <>
                            <label className={'m-3'} htmlFor={'sortBy'}>Filter By {label}</label>
                            <InputText
                                id={'sortBy'}
                                value={String(filterValue || '')}
                                onChange={(e) => {
                                    setFilters({...filters, ...{[key]: e.target.value}})
                                }}
                                className={'m-3'}
                                aria-describedby={`sortBy-help`}
                                placeholder={`Enter filter value`}
                            />
                            </>
                        }
                        {
                            input === 'select' && <>
                            <label className={'m-3'} htmlFor={'sortBy'}>Filter By {label}</label>
                            <Dropdown
                                disabled={options.length === 0 || loading}
                                value={filterValue}
                                className={'m-3 w-full'}
                                filter
                                onChange={(e) => {
                                    setFilters({...filters, ...{[key]: e.target.value}})
                                }}
                                aria-describedby={`organization-help`}
                                options={organizations || []}
                                optionLabel={labelKey}
                                optionValue={valueKey}
                                placeholder={loading ? 'Loading...' : "Select filter value"}
                            />
                            </>
                        }
                        {
                            input === 'multiselect' && <>
                            <label className={'m-3'} htmlFor={'sortBy'}>Filter By {label}</label>
                            <MultiSelect
                                display={"chip"}
                                disabled={options.length === 0 || loading}
                                value={options.length === 0 ? [] : filterValue || []}
                                onChange={(e) => {
                                    setFilters({...filters, ...{[key]: e.value}})
                                }}
                                options={options}
                                optionLabel={labelKey}
                                optionValue={valueKey}
                                filter
                                showClear
                                showSelectAll
                                placeholder={options.length === 0 ? 'Loading...' : "Select filter value(s)"}
                                className="m-3 w-full"
                            />
                            </>
                        }
                        {
                            input === 'switch' && <>
                                <label className={'m-3'} htmlFor={'sortBy'}>Filter By {label}</label>
                                <InputSwitch
                                    checked={!!filterValue}
                                    onChange={(e) => {
                                        setFilters({...filters, ...{[key]: e.value}})
                                    }}
                                />
                            </>
                        }
                </div>
                )
            })
        }
        <div className="text-center">
            <Button
                icon="pi pi-filter"
                label="Apply Filter"
                className="p-button-success m-2"
                autoFocus
                onClick={() => {confirm(filters)}}
            />
            <Button
                icon="pi pi-times"
                label="Cancel"
                className="p-button-text m-2"
                onClick={cancel}
            />
        </div>
    </>
}

export default UserFilter;