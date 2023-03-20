/*!
 * User Edit fieldset component
 * File: UserEdit.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import React, { useEffect, useState} from "react";
import { Controller, useFormContext } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import {matchers} from "@/services/validation.services.js";
import {Panel} from "primereact/panel";
import {useAPI} from "@/providers/api.provider.jsx";
import classNames from 'classnames';
import {MultiSelect} from "primereact/multiselect";
import {BlockUI} from "primereact/blockui";
import {useUser} from "@/providers/user.provider.jsx";
import {Dropdown} from "primereact/dropdown";

/**
 * User Profile Information
 * @returns {JSX.Element}
 */

export default function UserEdit() {
    const { control, setValue, getValues, resetField } = useFormContext();
    const api = useAPI();
    const user = useUser();
    // is the current user editing themselves?
    const isSelfEdit = getValues('id') === user.id;
    const [organizations, setOrganizations] = useState([]);
    const [roles, setRoles] = useState([]);
    const [currentOrganizations, setCurrentOrganizations] = useState([]);
    const [currentRole, setCurrentRole] = useState(null);
    const isAdmin = ['super-administrator', 'administrator'].includes(currentRole)

    // update local states
    useEffect(() => {
        api.getOrganizations().then(setOrganizations).catch(console.error);
        api.getUserRoles().then(setRoles).catch(console.error);
        const filteredOrgs = (getValues('organizations') || []).map(({organization}) => organization.id);
        const {name} = getValues('role');
        setCurrentRole(name);
        setCurrentOrganizations(filteredOrgs)
    }, []);

    // update form state
    useEffect(() => {
        const userID = getValues('id');
        console.log(currentOrganizations, currentRole)
        // reset fields to trigger isDirty flag
        resetField('role');
        resetField('organizations');
        setValue(
            'organizations',
            (currentOrganizations || []).map(orgName => {return {user: userID, organization: orgName}})
        );
        setValue('role.name',  currentRole);
    }, [currentOrganizations, currentRole]);

    // Note: To fix error handling to make sure naming convention works
    return <Panel className={'mb-3'} header={<>User Profile</>}>
        <div className="container">
            <div className="grid">
                <div className={'col-12 form-field-container'}>
                    <label htmlFor={'first_name'}>First Name</label>
                    <Controller
                        name={'first_name'}
                        control={control}
                        rules={{ required: "First name is required." }}
                        render={({ field, fieldState: {invalid, error} }) => (
                            <>
                                <InputText
                                    id={field.name}
                                    value={field.value || ''}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    className={classNames('w-full', {"p-invalid": error})}
                                    aria-describedby={`first_name-help`}
                                    placeholder={`First name`}
                                />
                                { invalid && <p className="error">{error.message}</p> }
                            </>
                        )}
                    />

                </div>
                <div className="col-12 form-field-container">
                    <label htmlFor={'last_name'}>Last Name</label>
                    <Controller
                        name={'last_name'}
                        control={control}
                        rules={{ required: "Last name is required." }}
                        render={({ field, fieldState: {invalid, error} }) => (
                            <>
                                <InputText
                                    id={field.name}
                                    value={field.value || ''}
                                    className={classNames('w-full', {"p-invalid": error})}
                                    aria-describedby={`last_name-help`}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    placeholder={`Last name`}
                                />
                                { invalid && <p className="error">{error.message}</p> }
                            </>
                        )}
                    />
                </div>
                <div className="col-12 form-field-container">
                    <label htmlFor={`email`}>
                        Government Email Address (If retired, enter preferred email address)
                    </label>
                    <Controller
                        name={'email'}
                        control={control}
                        rules={{
                            required: "Government email is required.",
                            pattern: {
                                value: matchers.govEmail,
                                message: "Invalid email address (e.g., example@gov.bc.ca)",
                            },
                        }}
                        render={({ field, fieldState: {invalid, error} }) => (
                            <>
                                <InputText
                                    id={field.name}
                                    value={field.value || ''}
                                    className={classNames('w-full', {"p-invalid": error})}
                                    aria-describedby={`government-email-help`}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    placeholder={`Government email address`}
                                />
                                { invalid && <p className="error">{error.message}</p> }</>
                        )}
                    />
                </div>
                <div className="col-12 form-field-container">
                    <BlockUI blocked={isAdmin}>
                        <label htmlFor={`organizations`}>Ministries/Organizations</label>
                        <MultiSelect
                            id={'organizations'}
                            value={(organizations || []).length === 0 ? [] : currentOrganizations || ''}
                            display={"chip"}
                            aria-describedby={`organization-help`}
                            disabled={(organizations || []).length === 0}
                            onChange={(e) => {
                                setCurrentOrganizations(e.target.value);
                            }}
                            options={organizations}
                            optionLabel="name"
                            optionValue="id"
                            filter
                            showClear
                            placeholder={(organizations || []).length === 0
                                ? 'Loading...' : (isAdmin ? "Not Applicable" : "Select organization(s)")}
                            className={classNames('w-full')}
                        />
                    </BlockUI>
                </div>
                <div className="col-12 form-field-container">
                    <BlockUI blocked={isSelfEdit}>
                        <Controller
                            name={'role.name'}
                            control={control}
                            rules={{
                                required: "User role is required.",
                            }}
                            render={({ field, fieldState: {invalid, error} }) => (
                                <>
                                    <label htmlFor={`role`}>Role</label>
                                    <Dropdown
                                        id={'role.name'}
                                        value={(roles || []).length === 0 ? [] : currentRole || ''}
                                        aria-describedby={`roles-help`}
                                        disabled={(roles || []).length === 0}
                                        onChange={(e) => {
                                            setCurrentRole(e.target.value);
                                        }}
                                        options={roles}
                                        optionLabel="label"
                                        optionValue="name"
                                        placeholder={(roles || []).length === 0 ? 'Loading...' : "Select User Role"}
                                        className={classNames('w-full')}
                                    />
                                    { invalid && <p className="error">{error.message}</p> }
                                </>
                            )}
                        />
                    </BlockUI>
                </div>
            </div>
        </div>
    </Panel>;
}
