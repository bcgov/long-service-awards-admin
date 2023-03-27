/*!
 * Award Input fieldset component
 * File: AwardInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import {Fragment, useEffect, useState} from "react";
import {useFormContext, useWatch} from "react-hook-form";
import {Dialog} from "primereact/dialog";
import AwardOptionsInput from "@/views/recipients/fieldsets/AwardOptionsInput.jsx";
import fallbackImg from "@/assets/images/bclogo.jpg";
import {Button} from "primereact/button";
import {useAPI} from "@/providers/api.provider.jsx";
import {Panel} from "primereact/panel";
import {Message} from "primereact/message";
import {FilterMatchMode} from "primereact/api";
import {InputText} from "primereact/inputtext";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Dropdown} from "primereact/dropdown";
import {Toolbar} from "primereact/toolbar";
import AwardData from "@/views/recipients/data/AwardData";
import FieldsetHeader from "@/components/common/FieldsetHeader.jsx";


/**
 * Award selection reusable component.
 * @returns years of service, current milestone, qualifying year, prior milestones,
 */

export default function AwardInput() {

    // get context / hooks
    const { setValue, getValues, control, formState: {isLoading} } = useFormContext();
    const api = useAPI();

    // get form control / current selection data
    const currentMilestone = useWatch({control, name: "service.milestone",});
    const currentServiceID = useWatch({control, name: "service.id",});
    const currentAward = useWatch({control, name: "service.awards.award",}) || {};

    // define local states
    const [milestones, setMilestones] = useState([]);
    const [confirmedAward, setConfirmedAward] = useState({});
    const [showAwards, setShowAwards] = useState(false);
    const [selectedAward, setSelectedAward] = useState(null);
    const [items, setItems] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        milestone: { value: null, matchMode: FilterMatchMode.EQUALS }
    });

    // define award filterable fields
    const globalFields = ['type', 'milestone', 'label', 'description', 'name']

    // set global filter change
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    // set milestone filter change
    const onMilestoneFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['milestone'].value = value;
        setFilters(_filters);
    };

    /**
     * Load active awards only for registrations
     * */

    useEffect(() => {
        api.getActiveAwards().then(setItems).catch(console.error);
        api.getMilestones().then(setMilestones).catch(console.error)
    }, []);

    /**
     * Select an award to view
     **/

    const selectAward = (e, award) => {
        e.preventDefault();
        setSelectedAward(award);
    };

    /**
     * Deselect and award
     **/

    const deselectAward = () => {
        setSelectedAward(null);
        setShowAwards(false);
    };

    /**
     * Clear award selection
     **/

    const clearAward = () => {
        setSelectedAward(null);
        setShowAwards(false);
        setConfirmedAward({})
        setValue('service.awards', {});
    };

    /**
     * Confirm award and options selection. Ready to save to database.
     * @param selectedOptions
     **/

    const confirmAward = async (selectedOptions) => {
        setConfirmedAward(selectedAward);
        // update form data: Award + Options
        setValue('service.id', currentServiceID);
        setValue('service.awards.award', selectedAward);
        setValue('service.awards.selections', selectedOptions);
        deselectAward();
        // await save(getValues());
        // status.setMessage('confirmAward')
    };

    /**
     * Dataview header
     * */

    const header = () => {
        return (
            <Toolbar
                left={
                    <Fragment><Dropdown
                        value={filters.milestone.value}
                        options={(milestones || []).filter(({name}) => name >= 25)}
                        optionLabel={'label'}
                        optionValue={'name'}
                        onChange={onMilestoneFilterChange}
                        placeholder={'Filter by Milestone'}
                    />
                    </Fragment>
                }
                right={
                    <Fragment><span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Keyword Search"
                    />
                </span>
                    </Fragment>}

            />
        );
    };

    return <Panel
        collapsed={!currentAward || isLoading}
        toggleable
        className={'mb-3'}
        headerTemplate={FieldsetHeader('Award')}
    >
        {
            currentMilestone < 25 && <Message
                className={'w-full mb-3 mt-3'}
                severity="warn"
                text="Recipient has a milestone that is less than 25 years."
            />
        }
        {
            !currentMilestone && <Message
                className={'w-full mb-3 mt-3'}
                severity="warn"
                text="Please select a milestone before selecting an award"
            />
        }
        <Toolbar
            left={
                <Fragment><Button
                    disabled={!currentMilestone}
                    className={'m-1'}
                    onClick={(e)=> {
                        e.preventDefault();
                        setShowAwards(true)}}
                >Select Award</Button>
                </Fragment>
            }
            right={
                <Fragment><Button
                    icon={'pi pi-trash'}
                    className={'m-1 p-button-danger'}
                    onClick={(e)=> {
                        e.preventDefault();
                        clearAward()}}
                />
                </Fragment>}

        />
        {
            currentAward && currentAward.hasOwnProperty('id') && <AwardData data={getValues()} />
        }
        <Dialog
            header={"Select an Award"}
            visible={showAwards}
            onHide={()=>setShowAwards(false)}
            maximizable
            modal
            style={{ minWidth: "fit-content", width: "70vw" }}
        >
            <div className={`award-selection-form`}>
                <div className="card">
                    {
                        (items || []).length > 0 &&
                        <DataTable
                            value={items}
                            dataKey={'id'}
                            rowClassName="m-0 p-0"
                            stripedRows
                            filters={filters}
                            filterDisplay="row"
                            globalFilterFields={globalFields}
                            tableStyle={{ minHeight: '70vh' }}
                            header={header}
                            scrollable
                            scrollHeight="60vh"
                        >
                            <Column
                                className={'p-1'}
                                body={(item) => {
                                    return <Button
                                        className={
                                            currentAward && item.id === currentAward.id
                                            || confirmedAward && item.id === confirmedAward.id
                                                ? 'p-button-success' : ''}
                                        onClick={(e) => {selectAward(e, item)}}
                                    >
                                        {
                                            currentAward && item.id === currentAward.id
                                            || item.id === confirmedAward.id ? "Selected" : "Select"}
                                    </Button>
                                }}
                            />
                            <Column
                                className={'p-1'}
                                body={(item) => {
                                    return <><img
                                        className="w-9 shadow-2 border-round"
                                        src={item.image_url}
                                        onError={(e) => (e.target.src = fallbackImg)}
                                        alt={item.label}
                                    />
                                    </>
                                }}
                            />
                            <Column
                                className={'p-1'}
                                header={"Label"}
                                body={(item) => {
                                    return <div>{item.label}</div>
                                }}
                            />
                            <Column
                                className={'p-1'}
                                header={"Type"}
                                body={(item) => {
                                    return <div className="flex align-items-center gap-2">
                                        <i className="pi pi-tag"></i>
                                        <span className="font-semibold">{item.type.toUpperCase()}</span>
                                    </div>
                                }}
                            />
                            <Column
                                className={'p-1'}
                                header={"Milestone"}
                                body={(item) => {
                                    return <div>{item.milestone}</div>
                                }}
                            />
                        </DataTable>
                    }
                </div>
            </div>
        </Dialog>
        <Dialog
            header={selectedAward ? selectedAward.label : 'Select Award'}
            visible={!!selectedAward}
            onHide={deselectAward}
            maximizable
            modal
            style={{ minWidth: "fit-content", width: "50vw" }}
        >
            <AwardOptionsInput
                regControl={control}
                award={selectedAward}
                cancel={deselectAward}
                confirm={confirmAward}
            />
        </Dialog>
    </Panel>;
}
