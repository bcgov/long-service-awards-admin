/*!
 * Edit Recipient Record
 * File: RecipientEdit.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import {useNavigate, useParams} from "react-router-dom";
import PageHeader from "@/components/common/PageHeader.jsx";
import {useStatus} from "@/providers/status.provider.jsx";
import FormContext from "@/components/common/FormContext";
import MilestoneInput from "@/views/recipients/fieldsets/MilestoneInput.jsx";
import {useAPI} from "@/providers/api.provider.jsx";
import ProfileInput from "@/views/recipients/fieldsets/ProfileInput.jsx";
import PersonalContactInput from "@/views/recipients/fieldsets/PersonalContactInput.jsx";
import OfficeContactInput from "@/views/recipients/fieldsets/OfficeContactInput.jsx";
import AwardInput from "@/views/recipients/fieldsets/AwardInput.jsx";
import SupervisorContactInput from "@/views/recipients/fieldsets/SupervisorContactInput.jsx";
import ConfirmationInput from "@/views/recipients/fieldsets/ConfirmationInput.jsx";
import CeremonyInput from "@/views/recipients/fieldsets/CeremonyInput.jsx";
import AdminInput from "@/views/recipients/fieldsets/AdminInput";
import {useUser} from "@/providers/user.provider.jsx";
import BCGEUInput from "@/views/recipients/fieldsets/BCGEUInput.jsx";
import RetirementInput from "@/views/recipients/fieldsets/RetirementInput.jsx";
import RegistrationOptionsInput from "@/views/recipients/fieldsets/RegistrationOptionsInput.jsx";
import validate, {validators} from "@/services/validation.services.js";
import ConfirmationEmails from "@/views/recipients/fieldsets/ConfirmationEmails";
import {useState} from "react";

/**
 * Inherited model component
 */

export default function RecipientEdit() {

    const status = useStatus();
    const api = useAPI();
    const user = useUser();
    const {role} = user || {};
    const isAdmin = ['super-administrator', 'administrator'].includes(role && role.name);
    const navigate = useNavigate();
    const { id } = useParams() || {};

    const [submitted, setSubmitted] = useState(false);

    // create new registration
    const _handleDelete = async (id) => {
        try {
            const [error, result] = await api.removeRecipient(id);
            if (error) status.setMessage({message: "Error: Could Not Delete Recipient Record", severity: "danger"});
            else status.setMessage({message: "Recipient Record Deleted!", severity: "success"});
            if (!error && result) return result;
        } catch (error) {
            status.clear();
            status.setMessage({message: "Error: Could Not Create New Recipient Record", severity: "danger"});
        }
    }

    // save registration data
    const _handleSave = async (data) => {
        console.log('Save:', data)
        try {
            status.setMessage('save');
            const [error, result] = await api.saveRecipient(data);
            if (error) status.setMessage('saveError');
            else status.setMessage('saveSuccess');
            if (!error && result) {
                setSubmitted(true);
                return result;
            }
        } catch (error) {
            status.setMessage('saveError');
        }
    };

    // cancel edits
    const _handleCancel = async () => {
        navigate('/recipients')
    }

    // set default recipient form values
    const defaults = {
        employee_number: "",
        organization: "",
        division: "",
        branch: "",
        service: {
            cycle: 2023,
            service_years: "",
            milestone: "",
            qualifying_year: "",
            confirmed: false,
            survey_opt_in: false,
            previous_registration: false,
            previous_award: false,
            ceremony_opt_out: false,
            awards: {
                award: {
                    id: "",
                    vendor: "",
                    type: "",
                    milestone: "",
                    label: "",
                    description: ""
                },
                selections: []
            }
        },
        bcgeu: false,
        retirement: false,
        retirement_date: null,
        contact: {
            first_name: "",
            last_name: "",
            office_email: "",
            office_phone: "",
            personal_phone: "",
            personal_email: "",
            personal_address: {
                pobox: "",
                street1: "",
                street2: "",
                postal_code: "",
                community: "",
                province: "British Columbia",
                country: "Canada",
            },
            office_address: {
                pobox: "",
                street1: "",
                street2: "",
                postal_code: "",
                community: "",
                province: "British Columbia",
                country: "Canada",
            }
        },
        supervisor: {
            first_name: "",
            last_name: "",
            office_email: "",
            office_phone: "",
            office_address: {
                pobox: "",
                street1: "",
                street2: "",
                postal_code: "",
                community: "",
                province: "British Columbia",
                country: "Canada",
            },
        },
    };

    // define recipient fieldset validation checks
    const fieldsetValidators = {
        milestone: (data) => {
            const {service} = data || {};
            return validate([
                {key: "service_years", validators: [validators.required]},
                {key: "milestone", validators: [validators.required]},
                {key: "qualifying_year", validators: [validators.required]}
            ], service);
        },
        profile: (data) => {
            const {contact} = data || {};
            return validate([
                {key: "first_name", validators: [validators.required]},
                {key: "last_name", validators: [validators.required]},
                {key: "office_email", validators: [validators.required, validators.email]},
                {key: "personal_email", validators: [validators.email]},
                {key: "office_phone",  validators: [validators.phone]},
            ], contact) && validate([
                {key: "employee_number", validators: [validators.required, validators.employeeNumber]},
                {key: "organization", validators: [validators.required]},
                {key: "division", validators: [validators.required]},
                {key: "branch", validators: [validators.required]},
            ], data);
        },
        personalContact: (data) => {
            const {contact} = data || {};
            const {personal_address} = contact || {};
            return validate([
                {key: "personal_phone", validators: [validators.phone]},
            ], contact) && validate([
                { key: "street1", validators: [validators.required] },
                { key: "community", validators: [validators.required] },
                { key: "province", validators: [validators.required] },
                { key: "postal_code", validators: [validators.required, validators.postal_code] },
            ], personal_address);
        },
        officeContact: (data) => {
            const {contact} = data || {};
            const {office_address} = contact || {};
            return validate([
                {key: "office_phone", validators: [validators.phone]},
            ], contact) && validate([
                { key: "street1", validators: [validators.required] },
                { key: "community", validators: [validators.required] },
                { key: "province", validators: [validators.required] },
                { key: "postal_code", validators: [validators.required, validators.postal_code] },
            ], office_address);
        },
        // awards: (data) => {
        //     const { service } = data || {};
        //     const { awards } = service || {};
        //     const { selections, award } = awards || {};
        //     const { id, options } = award || {};
        //     // validate award exists (no options) or award options match schema
        //     // - filter selections by selected award
        //     // - check that each option has a corresponding selection
        //     return (award || {}).hasOwnProperty('id') && award.id
        //         && ((options || []).length === 0
        //             || (selections || [])
        //                 .filter(({award_option}) => award_option.award === id)
        //                 .every(({award_option}) => {
        //                     return !!(options || []).find(({award, type}) =>
        //                         (award_option || {}).hasOwnProperty('type')
        //                         && award_option.type === type)
        //                 }));
        // },
        supervisor: (data) => {
            const { supervisor } = data || {};
            const { office_address } = supervisor || {};
            return validate([
                {key: "first_name", validators: [validators.required]},
                {key: "last_name", validators: [validators.required]},
                {key: "office_email", validators: [validators.required, validators.email]},
            ], supervisor) && validate([
                { key: "street1", validators: [validators.required] },
                { key: "community", validators: [validators.required] },
                { key: "province", validators: [validators.required] },
                { key: "postal_code", validators: [validators.required, validators.postal_code] },
            ], office_address);
        },
        confirmation: (data) => {
            const { service } = data || {};
            const { confirmed } = service || {};
            return !!confirmed;
        },
    };

    // loader for recipient record data
    const _loader = async () => {
        const { result } = await api.getRecipient(id) || {};
        return result;
    };

    return <>
        <PageHeader heading="Register Recipient" />
        <FormContext
            defaults={defaults}
            loader={_loader}
            save={_handleSave}
            remove={_handleDelete}
            cancel={_handleCancel}
            blocked={false}
            validate={fieldsetValidators.confirmation}
        >
            {
                isAdmin && <AdminInput/>
            }
            <MilestoneInput validate={fieldsetValidators.milestone} threshold={25} />
            <ProfileInput validate={fieldsetValidators.profile} />
            <RegistrationOptionsInput />
            <BCGEUInput />
            <RetirementInput />
            <CeremonyInput />
            <PersonalContactInput validate={fieldsetValidators.personalContact} />
            <OfficeContactInput validate={fieldsetValidators.officeContact} />
            <AwardInput save={_handleSave} />
            <SupervisorContactInput validate={fieldsetValidators.supervisor} />
            <ConfirmationInput validate={fieldsetValidators} />
            <ConfirmationEmails visible={submitted} />
        </FormContext>
    </>
}