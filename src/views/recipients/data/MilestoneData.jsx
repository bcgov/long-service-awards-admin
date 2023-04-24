/*!
 * Recipient Milestone Selection Data
 * File: MilestoneData.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import {Panel} from "primereact/panel";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";

/**
 * Recipient Milestone Data view
 */

export default function MilestoneData({data, currentCycle}) {

    const {services, retirement, retirement_date} = data || {};
    // get current milestone service selection
    const currentService = (services || []).find(srv => srv.cycle === currentCycle);
    const {
        milestone='-',
        qualifying_year,
        service_years,
        ceremony_opt_out,
        previous_registration,
        previous_award,
        cycle
    } = currentService || {};
    const retirementDate = retirement_date ? new Date(retirement_date) : null;

    return <>
        <Panel className={'mb-2 mt-2'} header={'Current Milestone'} toggleable>
            <div className={'container'}>
                <div className={'grid'}>
                    <div className={'col-6'}>Years of Service</div>
                    <div className={'col-6'}>{service_years || '-'}</div>
                    <div className={'col-6'}>Current Milestone</div>
                    <div className={'col-6'}>{milestone || '-'}</div>
                    <div className={'col-6'}>Current Cycle</div>
                    <div className={'col-6'}>{cycle || '-'}</div>
                    <div className={'col-6'}>Qualifying Year</div>
                    <div className={'col-6'}>{qualifying_year || '-'}</div>
                    {
                        service_years && <>
                            <div className={'col-6'}>To receive award only and not attend ceremony</div>
                            <div className={'col-6'}>{ceremony_opt_out ? 'Yes' : 'No'}</div>
                            <div className={'col-6'}>
                                Registered previously but unable to attend ceremony
                            </div>
                            <div className={'col-6'}>{previous_registration ? 'Yes' : 'No'}</div>
                        </>
                    }
                    {
                        service_years && previous_registration && <>
                            <div className={'col-6'}>Has received award</div>
                            <div className={'col-6'}>{previous_award ? 'Yes' : 'No'}</div>
                        </>
                    }
                    {
                        service_years && <>
                            <div className={'col-6'}>Retiring This Year</div>
                            <div className={'col-6'}>{retirement ? 'Yes' : 'No'}</div>
                        </>
                    }
                    {
                        retirement && <>
                            <div className={'col-6'}>Retirement Date</div>
                            <div className={'col-6'}>
                                {retirementDate ? retirementDate.toLocaleDateString() : 'Unknown'}
                            </div>
                        </>
                    }
                </div>
            </div>
        </Panel>
        <Panel className={'mb-2 mt-2'} header={'Milestones'} toggleable>
            <DataTable sortField={'milestone'} sortOrder={-1} className={'w-full'} value={services}>
                <Column field="service_years" header="YoS"></Column>
                <Column sortField={'milestone'} field="milestone" header="Milestone"></Column>
                <Column field="cycle" header="Cycle"></Column>
                <Column field="qualifying_year" header="Qualifying"></Column>
            </DataTable>
        </Panel>
    </>
}
