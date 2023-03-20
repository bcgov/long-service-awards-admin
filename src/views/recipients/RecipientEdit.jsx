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
import validate, {validators} from "@/services/validation.services.js";


/**
 * Panel Header for common component management in registration flow
 */

export default function RecipientEdit() {

    const status = useStatus();
    const api = useAPI();
    const navigate = useNavigate();
    const { id } = useParams() || {};

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
        try {
            status.setMessage('save');
            const [error, result] = await api.saveRecipient(data);
            if (error) status.setMessage('saveError');
            else status.setMessage('saveSuccess');
            if (!error && result) return result;
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
    }

    // loader for recipient record data
    const _loader = async () => {
        const { result } = await api.getRecipient(id) || {};
        return result;
    };

    return <>
        <PageHeader heading="Edit Recipient Record" />
        <FormContext
            defaults={defaults}
            loader={_loader}
            save={_handleSave}
            remove={_handleDelete}
            cancel={_handleCancel}
            blocked={false}
        >
            <AdminInput />
            <MilestoneInput />
            <ProfileInput />
            <PersonalContactInput  />
            <OfficeContactInput />
            <CeremonyInput />
            <AwardInput save={_handleSave} />
            <SupervisorContactInput />
            <ConfirmationInput />
        </FormContext>
    </>
}