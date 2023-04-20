/*!
 * Recipient Award Data
 * File: AwardData.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import {Panel} from "primereact/panel";
import parse from "html-react-parser";
import {useEffect, useState} from "react";
import {useAPI} from "@/providers/api.provider.jsx";

/**
 * Model data display component
 */

export default function AwardData({data, currentCycle}) {

    // get current milestone service selection
    const {services, service} = data || {};
    // - service is the current selected service milestone
    // - services contains all previous and current service milestones
    const currentService = service || (services || []).find(srv => srv.cycle === currentCycle);
    const { awards } = currentService || {};
    const { award, selections } = awards || {};

    const api = useAPI();

    const [pecsfCharities, setPecsfCharities] = useState(null);

    const lookupPecsfCharity = (id) => {
        const charity = (pecsfCharities || []).find(charity => charity.id === id);
        return typeof charity ? `${charity.label} (${charity.region})` : 'Not Found';
    }

    /**
     * Get requested PECSF charity
     * */

    useEffect(() => {
        api.getPecsfCharities().then(setPecsfCharities).catch(console.error);
    }, []);

    return <Panel className={'mb-2 mt-2'} header={'Recipient Awards'} toggleable>
        <div className={'container'}>
            <div className={'grid'}>
                <div className={'col-6'}>Name</div>
                <div className={'col-6'}>{award && award.label || '-'}</div>
                <div className={'col-6'}>Description</div>
                <div className={'col-6'}>{award && parse(award.description || '-') || '-'}</div>
                {
                    (selections || []).length > 0 && <div className={'col-12'}>
                        <div className={'font-bold mb-3'}>Options</div>
                        <div className={'container'}>
                            {
                                (selections || []).map(({pecsf_charity, custom_value, award_option}, index) => {
                                    const { type, label, description, customizable} = award_option || {};
                                    return <div key={`award-option-${index}`}>
                                        {
                                            pecsfCharities && type === 'pecsf-charity' && label &&
                                            <div className={'grid'}>
                                                <div className={'col-6'}>{label}</div>
                                                <div className={'col-6'}>
                                                    {
                                                        pecsf_charity.hasOwnProperty('label') && pecsf_charity.hasOwnProperty('region')
                                                            ? `${pecsf_charity.label} (${pecsf_charity.region})`
                                                            : lookupPecsfCharity(pecsf_charity)}
                                                </div>
                                            </div>
                                        }
                                        {
                                            type === 'pecsf-charity' && !pecsf_charity &&
                                            <div className={'grid'}>
                                                <div className={'col-6'}>{label}</div>
                                                <div className={'col-6'}>Donation Pool</div>
                                            </div>
                                        }
                                        {
                                            type !== 'pecsf-charity' && !customizable && label && description &&
                                            <div className={'grid'}>
                                                <div className={'col-6'}>{label || '-'}</div>
                                                <div className={'col-6'}>{description || '-'}</div>

                                            </div>
                                        }
                                        {
                                            type !== 'pecsf-charity' && customizable && description && custom_value &&
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
