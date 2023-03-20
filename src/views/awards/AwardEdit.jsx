/*!
 * Award Edit fieldset component
 * File: AwardEdit.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import {useEffect, useState} from "react";
import { Controller, useFormContext } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import {Panel} from "primereact/panel";
import classNames from 'classnames';
import {Dropdown} from "primereact/dropdown";
import {InputTextarea} from "primereact/inputtextarea";
import {useAPI} from "@/providers/api.provider.jsx";
import fallbackImg from "@/assets/images/bclogo.jpg";

/**
 * User Profile Information
 * @returns {JSX.Element}
 */

export default function AwardEdit() {

    const api = useAPI();
    const { control, getValues } = useFormContext();
    const [milestones, setMilestones] = useState([]);
    const awardTypes = [
        {name: 'stationary', label: 'Stationary'},
        {name: 'clock', label: 'Clock'},
        {name: 'watch', label: 'Watch'},
        {name: 'earrings', label: 'Earrings'},
        {name: 'luggage', label: 'Luggage'},
        {name: 'print', label: 'Print'},
        {name: 'necklace', label: 'Necklace'},
        {name: 'pecsf', label: 'PECSF'},
        {name: 'other', label: 'Other'},
        {name: 'bracelet', label: 'Bracelet'},
        {name: 'pottery', label: 'Pottery'}
    ];

    // - previous service pins only available to select organizations
    useEffect(() => {
        api.getMilestones().then(setMilestones).catch(console.error);
    }, []);

    return <Panel className={'mb-3'} header={<>Award</>}>
        <div className="container">
            <div className="grid">
                <div className={'col-12 form-field-container'}>
                    <label htmlFor={'type'}>Award Type</label>
                    <Controller
                        name={'type'}
                        control={control}
                        rules={{
                            required: "Award type is required.",
                        }}
                        render={({ field, fieldState: {invalid, error} }) => (
                            <>
                                <Dropdown
                                    className={classNames({"p-invalid": error})}
                                    id={field.name}
                                    inputId={field.name}
                                    value={field.value || ''}
                                    onChange={(e) => {
                                        field.onChange(e.value);
                                    }}
                                    aria-describedby={`award-type-help`}
                                    options={awardTypes}
                                    optionLabel="label"
                                    optionValue="name"
                                    placeholder={'Select the milestone for this award'}
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
                                    className={classNames('w-full', {"p-invalid": error})}
                                    aria-describedby={`award-label-help`}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    placeholder={`Enter a label for this award`}
                                />
                                { invalid && <p className="error">{error.message}</p> }
                            </>
                        )}
                    />
                </div>
                <div className={"col-12 form-field-container"}>
                    <label htmlFor={'service.milestone'}>Award Milestone</label>
                    <Controller
                        name={`milestone`}
                        control={control}
                        rules={{required: { value: true, message: "Milestone is required."}}}
                        render={({ field, fieldState: {invalid, error} }) => (
                            <>
                                <Dropdown
                                    className={classNames({"p-invalid": error})}
                                    id={field.name}
                                    inputId={field.name}
                                    value={field.value || ''}
                                    onChange={(e) => {
                                        field.onChange(e.value);
                                    }}
                                    aria-describedby={`milestone-help`}
                                    options={(milestones || []).filter(opt => opt['name'] >= 25).reverse() || []}
                                    optionLabel="label"
                                    optionValue="name"
                                    placeholder={'Select the milestone for this award'}
                                />
                                { invalid && <p className="error">{error.message}</p> }
                            </>
                        )}
                    />
                </div>
                <div className="col-12 form-field-container">
                    <label htmlFor={`description`}>
                        Award Description
                    </label>
                    <Controller
                        name={'description'}
                        control={control}
                        rules={{
                            required: "Description is required."
                        }}
                        render={({ field, fieldState: {invalid, error} }) => (
                            <>
                                <InputTextarea
                                    autoResize
                                    id={field.name}
                                    value={field.value || ''}
                                    className={classNames('w-full', {"p-invalid": error})}
                                    aria-describedby={`award-description-help`}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    placeholder={`Enter a description for this award`}
                                />
                                <small>Separate paragraphs with the code <strong>\n\n</strong>.</small>
                                { invalid && <p className="error">{error.message}</p> }
                            </>
                        )}
                    />
                </div>
                <div className="col-12 form-field-container">
                    <label htmlFor={'vendor'}>Vendor Code</label>
                    <Controller
                        name={'vendor'}
                        control={control}
                        render={({ field, fieldState: {invalid, error} }) => (
                            <>
                                <InputText
                                    id={field.name}
                                    value={field.value || ''}
                                    maxLength={64}
                                    className={classNames('w-full', {"p-invalid": error})}
                                    aria-describedby={`award-vendor-help`}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    placeholder={`Enter a vendor code for this award`}
                                />
                                { invalid && <p className="error">{error.message}</p> }
                            </>
                        )}
                    />
                </div>
                <div className="col-12 form-field-container">
                    <label htmlFor={'image_url'}>Image PATH
                        <div>
                            <a
                                target={'_blank'}
                                href={`${import.meta.env.LSA_APPS_MAIN_SITE_URL}/${getValues('image_url')}`}
                            >
                                <small>{import.meta.env.LSA_APPS_MAIN_SITE_URL}/{getValues('image_url')}</small>
                            </a>
                        </div>
                    </label>
                    <Controller
                        name={'image_url'}
                        control={control}
                        render={({ field, fieldState: {invalid, error} }) => (
                            <>
                                <InputText
                                    id={field.name}
                                    value={field.value || ''}
                                    className={classNames('w-full', {"p-invalid": error})}
                                    aria-describedby={`award-image-help`}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    placeholder={`Enter the image url for this award`}
                                />
                                { invalid && <p className="error">{error.message}</p> }
                                <a
                                target={'_blank'}
                                href={`${import.meta.env.LSA_APPS_MAIN_SITE_URL}/${getValues('image_url')}`}
                                >
                                    <img
                                    className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
                                    src={`${import.meta.env.LSA_APPS_MAIN_SITE_URL}/${getValues('image_url')}`}
                                    onError={(e) => (e.target.src = fallbackImg)}
                                    alt={'Image Thumbnail'}
                                    />
                                </a>
                            </>
                        )}
                    />
                </div>
            </div>
        </div>
    </Panel>;
}
