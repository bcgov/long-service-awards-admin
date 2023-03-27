/*!
 * User Profile Data
 * File: UserData.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import {Panel} from "primereact/panel";
import {Tag} from "primereact/tag";

/**
 * Model data display component
 */

export default function UserView({data}) {

  const {
    first_name,
    last_name,
    email,
    idir,
    created_at,
    updated_at,
    role,
    organizations=[]
  } = data || {};

  const updatedData = updated_at ? new Date(updated_at) : null;
  const createdDate = created_at ? new Date(created_at) : null;

  return <Panel className={'mb-2 mt-2'} header={'User Profile'} toggleable>
    <div className={'container'}>
      <div className={'grid'}>
        <div className={'col-6'}>First Name</div>
        <div className={'col-6'}>{first_name || '-'}</div>
        <div className={'col-6'}>Last Name</div>
        <div className={'col-6'}>{last_name || '-'}</div>
        <div className={'col-6'}>IDIR</div>
        <div className={'col-6'}>{idir || '-'}</div>
        <div className={'col-6'}>Email</div>
        <div className={'col-6'}>{email || '-'}</div>
        <div className={'col-6'}>Organizations</div>
        <div className={'col-6'}>
          {
            (organizations || []).length > 0
              ? (organizations || []).map(({organization}) => <Tag
                    className={'m-1'}
                    severity={'info'}
                    key={organization.abbreviation}
                    value={<>
                      {organization.name || '-'} {organization.abbreviation ? `(${organization.abbreviation})` : ''}
                    </>} />
                )
              : <Tag value={'n/a'} />
          }
        </div>
        <div className={'col-6'}>Role</div>
        <div className={'col-6'}>{role.label}</div>
        <div className={'col-6'}>Last Updated</div>
        <div className={'col-6'}>
          {updatedData ? updatedData.toLocaleString() : '-'}
        </div>
        <div className={'col-6'}>Date Created</div>
        <div className={'col-6'}>
          {createdDate ? createdDate.toLocaleString() : '-'}
        </div>
      </div>
    </div>
  </Panel>
}
