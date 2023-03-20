/*!
 * Recipient Award Data
 * File: AwardData.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import {Panel} from "primereact/panel";

/**
 * Recipient Profile Details
 */

export default function AwardData({data}) {

    const {service} = data || {};
    const { awards } = service || {};
    const { award, selections } = awards || {};
    const { options } = award || {};

    return <Panel className={'mb-2 mt-2'} header={'Recipient Awards'} toggleable>
        <div className={'container'}>
            <div className={'grid'}>
                <div className={'col-6'}>Name</div>
                <div className={'col-6'}>{award && award.label || '-'}</div>
                <div className={'col-6'}>Description</div>
                <div className={'col-6'}>{award && award.description || '-'}</div>
                {
                    (options || []).length > 0 && <div className={'col-12'}>
                        <div className={'font-bold mb-3'}>Options</div>
                        <div className={'container'}>
                            {
                                (options || []).map(({id, customizable}) => {
                                    const {pecsf_charity, custom_value, award_option} = selections
                                        .find(selection => {
                                            // match award option ID to selection ID
                                            const {award_option} = selection || {};
                                            return award_option.id === id;
                                        }) || {};
                                    const { label, description} = award_option || {};
                                    return <div key={`award-option-${id}`}>
                                        {
                                            pecsf_charity && label &&
                                            <div className={'grid'}>
                                                <div className={'col-6'}>{label}</div>
                                                <div className={'col-6'}>
                                                    {pecsf_charity.label} ({pecsf_charity.region})
                                                </div>
                                            </div>
                                        }
                                        {
                                            !pecsf_charity && !customizable && label && description &&
                                            <div className={'grid'}>
                                                <div className={'col-6'}>{label || '-'}</div>
                                                <div className={'col-6'}>{description || '-'}</div>

                                            </div>
                                        }
                                        {
                                            !pecsf_charity && customizable && description && custom_value &&
                                            <div className={'grid'}>
                                                <div className={'col-6'}>{description || '-'}</div>
                                                <div className={'col-6'}>{custom_value || '-'}</div>
                                            </div>
                                        }
                                    </div>
                                })
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    </Panel>
}
