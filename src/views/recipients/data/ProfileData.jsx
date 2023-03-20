/*!
 * Recipient Profile Data
 * File: ProfileData.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import {Panel} from "primereact/panel";

/**
 * Recipient Profile Details
 */

export default function ProfileData({data}) {

  const {contact, employee_number, organization, division, branch} = data || {};
  const { first_name, last_name, office_email, personal_email } = contact || {}
  const { name, abbreviation } = organization || {}

  return <Panel className={'mb-2 mt-2'} header={'Recipient Profile'} toggleable>
    <div className={'container'}>
      <div className={'grid'}>
        <div className={'col-6'}>First Name</div>
        <div className={'col-6'}>{first_name || '-'}</div>
        <div className={'col-6'}>Last Name</div>
        <div className={'col-6'}>{last_name || '-'}</div>
        <div className={'col-6'}>Employment Number</div>
        <div className={'col-6'}>{employee_number || '-'}</div>
        <div className={'col-6'}>Organization</div>
        <div className={'col-6'}>{name || '-'} {abbreviation ? `(${abbreviation})` : ''}</div>
        <div className={'col-6'}>Division</div>
        <div className={'col-6'}>{division || '-'}</div>
        <div className={'col-6'}>Branch</div>
        <div className={'col-6'}>{branch || '-'}</div>
        <div className={'col-6'}>Government Email Address</div>
        <div className={'col-6'}>{office_email || '-'}</div>
        <div className={'col-6'}>Alternate Email Address</div>
        <div className={'col-6'}>{personal_email || '-'}</div>
      </div>
    </div>
  </Panel>
}
