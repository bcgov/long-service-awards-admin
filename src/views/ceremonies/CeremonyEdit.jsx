/*!
 * Edit Ceremony Record
 * File: CeremonyEdit.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */
import {useState} from "react";
import {useAPI} from "@/providers/api.provider.jsx";
import {useNavigate, useParams} from "react-router-dom";

import {useStatus} from "@/providers/status.provider.jsx";
import {useUser} from "@/providers/user.provider.jsx";

import validate, {validators} from "@/services/validation.services.js";

import PageHeader from "@/components/common/PageHeader.jsx";
import FormContext from "@/components/common/FormContext";

//Fieldsets
import CeremonyDetailsInput from "@/views/ceremonies/fieldsets/CeremonyDetailsInput.jsx";
import AddressInput from "@/views/recipients/fieldsets/AddressInput.jsx";

/**
 * Inherited model component
 */

export default function CeremonyEdit() {

    const status = useStatus();
    const api = useAPI();
    const user = useUser();
    const {role} = user || {};
    const navigate = useNavigate();
    const { id } = useParams() || {};

    const [submitted, setSubmitted] = useState(false);

    // create new registration
    const _handleDelete = async (id) => {
        try {
            const [error, result] = await api.removeCeremony(id);
            if (error) status.setMessage({message: "Error: Could Not Delete Ceremony Record", severity: "danger"});
            else status.setMessage({message: "Ceremony Record Deleted!", severity: "success"});
            if (!error && result) return result;
        } catch (error) {
            status.clear();
            status.setMessage({message: "Error: Could Not Create New Ceremony Record", severity: "danger"});
        }
    }

    // save registration data
    const _handleSave = async (data) => {
        console.log('Save:', data)
        try {
            status.setMessage('save');
            const [error, result] = await api.saveCeremony(data);
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
        navigate('/ceremonies')
    }

    // set default ceremony form values
    const defaults = {
        
        ceremony_address: {
            pobox: "",
            street1: "",
            street2: "",
            postal_code: "",
            community: "",
            province: "British Columbia",
            country: "Canada",
        },
    };

    // define recipient fieldset validation checks
    const fieldsetValidators = {
        ceremonyAddress: (data) => {
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
        confirmation: (data) => {
            return true;
        }
    };

    // loader for ceremony record data
    const _loader = async () => {
        const { result } = await api.getCeremony(id) || {};
        return result;
    };

    return <>
        <PageHeader heading="Create Ceremony" />
        <FormContext
            defaults={defaults}
            loader={_loader}
            save={_handleSave}
            remove={_handleDelete}
            cancel={_handleCancel}
            blocked={false}
            validate={fieldsetValidators.confirmation}
        >
            <CeremonyDetailsInput />
            <AddressInput validate={fieldsetValidators.ceremonyAddress} />
        </FormContext>
    </>
}