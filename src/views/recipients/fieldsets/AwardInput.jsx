/*!
 * Award Input fieldset component
 * File: AwardInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import {useEffect, useState} from "react";
import {useFormContext, useWatch} from "react-hook-form";
import {Dialog} from "primereact/dialog";
import AwardOptionsInput from "@/views/recipients/fieldsets/AwardOptionsInput.jsx";
import {DataView, DataViewLayoutOptions} from "primereact/dataview";
import {Skeleton} from "primereact/skeleton";
import fallbackImg from "@/assets/images/bclogo.jpg";
import {Button} from "primereact/button";
import classNames from "classnames";
import {useAPI} from "@/providers/api.provider.jsx";
import {useStatus} from "@/providers/status.provider.jsx";
import {Panel} from "primereact/panel";
import {Message} from "primereact/message";
import {Tag} from "primereact/tag";


/**
 * Award selection reusable component.
 * @returns years of service, current milestone, qualifying year, prior milestones,
 */

export default function AwardInput({save=()=>{}}) {

    // get context / hooks
    const { setValue, getValues, control, formState: {isLoading} } = useFormContext();
    const status = useStatus();
    const api = useAPI();
    const [complete, setComplete] = useState(false);

    // get form control / current selection data
    const currentMilestone = useWatch({control, name: "service.milestone",});
    const currentServiceID = useWatch({control, name: "service.id",});
    const currentAward = useWatch({control, name: "service.awards.award",}) || {};

    // define local states
    const [confirmedAward, setConfirmedAward] = useState({});
    const [showAwards, setShowAwards] = useState(false);
    const [selectedAward, setSelectedAward] = useState(null);
    const [layout, setLayout] = useState("list");
    const [galleryItems, setGalleryItems] = useState([]);

    // validate fieldset
    const validation = () => {
        const { awards } = getValues('service') || {};
        const { selections, award } = awards || {};
        const { id, options } = award || {};
        // validate award exists (no options) or award options match schema
        // - filter selections by selected award
        // - check that each option has a corresponding selection
        setComplete((award || {}).hasOwnProperty('id') && award.id
            && (options.length === 0
                || (selections || [])
                    .filter(({award_option}) => award_option.award === id)
                    .every(({award_option}) => {
                        return !!(options || []).find(({award, type}) =>
                            (award_option || {}).hasOwnProperty('type')
                            && award_option.type === type)
                    })));
    };
    useEffect(() => validation, [getValues('service')]);


    /**
     * Load awards
     * */

    useEffect(() => {
        api.getAwards().then(setGalleryItems).catch(console.error);
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
        await save(getValues());
        status.setMessage('confirmAward')
    };

    /**
     * Dataview header
     * */

    const header = () => {
        return (
            <div className={'grid'}>
                <div className={'col-6'}>List of Available Awards</div>
                <div className={'col-6'} style={{textAlign: "right"}}>
                    <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)}/>
                </div>
            </div>
        );
    };

    /**
     * List loading placeholder
     * */

    const SkeletonList = () => {
        return (
            <div className="col-12">
                <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                    <Skeleton className="w-9 sm:w-16rem xl:w-10rem shadow-2 h-6rem block xl:block mx-auto border-round" />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <Skeleton className="w-8rem border-round h-2rem" />
                            <Skeleton className="w-6rem border-round h-1rem" />
                            <div className="flex align-items-center gap-3">
                                <Skeleton className="w-6rem border-round h-1rem" />
                                <Skeleton className="w-3rem border-round h-1rem" />
                            </div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <Skeleton className="w-4rem border-round h-2rem" />
                            <Skeleton shape="circle" className="w-3rem h-3rem" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    /**
     * Grid loading placeholder
     * */

    const SkeletonGrid = () => {
        return (
            <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2">
                <div className="p-4 border-1 surface-border surface-card border-round">
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                        <Skeleton className="w-6rem border-round h-1rem" />
                        <Skeleton className="w-3rem border-round h-1rem" />
                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <Skeleton className="w-9 shadow-2 border-round h-10rem" />
                        <Skeleton className="w-8rem border-round h-2rem" />
                        <Skeleton className="w-6rem border-round h-1rem" />
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <Skeleton className="w-4rem border-round h-2rem" />
                        <Skeleton shape="circle" className="w-3rem h-3rem" />
                    </div>
                </div>
            </div>
        );
    };

    /**
     * Select item from list display
     * */

    const listItem = (item) => {
        return <div className="col-12">
            <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                <img
                    className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
                    src={`${import.meta.env.LSA_APPS_MAIN_SITE_URL}/${item.image_url}`}
                    onError={(e) => (e.target.src = fallbackImg)}
                    alt={item.label}
                />
                <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                    <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                        <div className="text-2xl font-bold text-900">{item.label}</div>
                        <div style={{textAlign: 'left'}}>{item.description}</div>
                        <div className="flex align-items-center gap-3">
                            <span className="flex align-items-center gap-2">
                                <i className="pi pi-tag"></i>
                                <span className="font-semibold">{item.type}</span>
                                <i className="pi pi-calendar"></i>
                                <span className="font-semibold">Milestone {item.milestone}</span>
                            </span>
                        </div>
                    </div>
                    <div className="flex sm:flex-column align-content-start sm:align-items-end gap-3 sm:gap-2">
                        <Button
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
                    </div>
                </div>
            </div>
        </div>
    };

    /**
     * Select item from grid display
     * */

    const gridItem = (item) => {
        return <div className="col-4 sm:col-6 md:col-4 lg:col-4 xl:col-4 p-2">
            <div className="p-4 border-1 surface-border surface-card border-round">
                <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                    <div className="flex align-items-center gap-2">
                        <i className="pi pi-tag"></i>
                        <span className="font-semibold">{item.type.toUpperCase()}</span>
                    </div>
                    <Button
                        className={`w-95 ${
                            currentAward && item.id === currentAward.id
                            || confirmedAward && item.id === confirmedAward.id
                                ? 'p-button-success' : ''}`}
                        onClick={(e) => {selectAward(e, item)}}
                    >
                        {
                            currentAward && item.id === currentAward.id
                            || item.id === confirmedAward.id ? "Selected" : "Select Award"}
                    </Button>
                </div>
                <div className="flex flex-column align-items-center gap-3 py-5">
                    <img
                        className="w-9 shadow-2 border-round"
                        src={`${import.meta.env.LSA_APPS_MAIN_SITE_URL}/${item.image_url}`}
                        onError={(e) => (e.target.src = fallbackImg)}
                        alt={item.label}
                    />
                    <div className="text-2xl font-bold">{item.label}</div>
                </div>
                <div>
                    <div style={{textAlign: 'left'}}>{item.description}</div>
                </div>
            </div>
        </div>
    };

    return <Panel
        onClick={validation}
        collapsed={!currentAward || isLoading}
        toggleable
        className={'mb-3'}
        header={<>Award Selection {complete && <Tag severity={'success'} value={'Complete'} /> } </>}
    >
        {
            currentMilestone < 25 && <Message
                className={'w-full mb-3 mt-3'}
                severity="warn"
                text="Recipient has a milestone that is less than 25 years."
            />
        }
        <Button
            className={'m-1'}
            onClick={(e)=> {
                e.preventDefault();
                setShowAwards(true)}}
        >Select Award</Button>
        <Button
            className={'m-1 p-button-danger'}
            onClick={(e)=> {
                e.preventDefault();
                clearAward()}}
        >Clear Award</Button>
        {
            currentAward && currentAward.hasOwnProperty('id') && listItem(currentAward)
        }
        <Dialog
            header={"Select an Award"}
            visible={showAwards}
            onHide={()=>setShowAwards(false)}
            maximizable
            modal
            style={{ minWidth: "fit-content", width: "50vw" }}
        >
            <div className={`award-selection-form`}>
                <div
                    className={classNames(
                        "gallery-display-items",
                        { "grid-view-dataview": layout === "grid" },
                        { "list-view-dataview": layout === "list" }
                    )}
                >
                    <div className="card">
                        {
                            galleryItems.length > 0 ?
                                <DataView
                                    value={galleryItems}
                                    layout={layout}
                                    header={header()}
                                    itemTemplate={layout === "list" ? listItem : gridItem}
                                    rows={9}
                                />
                                : <DataView
                                    value={[...Array(6).keys()]}
                                    header={header()}
                                    itemTemplate={layout === "list" ? SkeletonList : SkeletonGrid}
                                    layout={layout}
                                />
                        }
                    </div>
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
