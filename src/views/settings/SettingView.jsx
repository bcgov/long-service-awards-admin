/*!
 * Global Setting data view
 * File: SettingView.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import {Panel} from "primereact/panel";

/**
 * Model data display component
 */

export default function SettingView({data}) {

  const {
    name,
    label,
    value
  } = data || {};

  return <Panel className={'mb-2 mt-2'} header={'Setting'} toggleable>
    <div className={'container'}>
      <div className={'grid'}>
        <div className={'col-6'}>Name</div>
        <div className={'col-6'}>{name || '-'}</div>
        <div className={'col-6'}>Label</div>
        <div className={'col-6'}>{label || '-'}</div>
        <div className={'col-6'}>Value</div>
        <div className={'col-6'}>{value || '-'}</div>
      </div>
    </div>
  </Panel>
}
