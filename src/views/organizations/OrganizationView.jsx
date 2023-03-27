/*!
 * Award data view
 * File: AwardView.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import {Panel} from "primereact/panel";
import fallbackImg from "@/assets/images/bclogo.jpg";
import parse from 'html-react-parser';

/**
 * Model data display component
 */

export default function OrganizationView({data}) {

  const {
    name,
    abbreviation,
    previous_service_pins,
    active
  } = data || {};

  return <Panel className={'mb-2 mt-2'} header={'Ministries/Organizations'} toggleable>
    <div className={'container'}>
      <div className={'grid'}>
        <div className={'col-6'}>Name</div>
        <div className={'col-6'}>{name || '-'}</div>
        <div className={'col-6'}>Abbreviation</div>
        <div className={'col-6'}>{abbreviation || '-'}</div>
        <div className={'col-6'}>Retroactive Pins Permitted</div>
        <div className={'col-6'}>{previous_service_pins ? 'Yes' : 'No'}</div>
        <div className={'col-6'}>Active</div>
        <div className={'col-6'}>{active ? 'Yes' : 'No'}</div>
      </div>
    </div>
  </Panel>
}
