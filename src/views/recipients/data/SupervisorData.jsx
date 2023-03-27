/*!
 * Recipient Supervisor Data
 * File: SupervisorData.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import {Panel} from "primereact/panel";
import {convertPhone} from "@/services/utils.services.js";

/**
 * Model data display component
 */

export default function SupervisorData({data}) {

  const {supervisor} = data || {};
  const { first_name, last_name, office_phone, office_email, office_address } = supervisor || {}

  return <Panel className={'mb-2 mt-2'} header={'Supervisor Contact Details'} toggleable>
    <div className={'container'}>
      <div className={'grid'}>
        <div className={'col-6'}>First Name</div>
        <div className={'col-6'}>{first_name || '-'}</div>
        <div className={'col-6'}>Last Name</div>
        <div className={'col-6'}>{last_name || '-'}</div>
        <div className={'col-6'}>Government Email Address</div>
        <div className={'col-6'}>{office_email || '-'}</div>
        <div className={'col-6'}>Phone Number</div>
        <div className={'col-6'}>{convertPhone(office_phone) || '-'}</div>
        <div className={'col-12'}>
          <Panel className={'mb-2 mt-2'} header={'Office Address'} toggleable>
            <div className={'container'}>
              <div className={'grid'}>
                {
                    office_address && office_address.pobox
                    && <><div className={'col-6'}>P.O. Box</div>
                      <div className={'col-6'}>{office_address && office_address.pobox || '-'}</div></>
                }
                <div className={'col-6'}>Street Address</div>
                <div className={'col-6'}>
                  <div>{office_address && office_address.street1 || '-'}</div>
                  <div>{office_address && office_address.street2 || ''}</div>
                </div>
                <div className={'col-6'}>Community or City</div>
                <div className={'col-6'}>{office_address && office_address.community || '-'}</div>
                <div className={'col-6'}>Province</div>
                <div className={'col-6'}>{office_address && office_address.province || '-'}</div>
                <div className={'col-6'}>Country</div>
                <div className={'col-6'}>{office_address && office_address.country || '-'}</div>
                <div className={'col-6'}>Postal Code</div>
                <div className={'col-6'}>{office_address && office_address.postal_code || '-'}</div>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  </Panel>
}
