/*!
 * Award data view
 * File: AwardView.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import {Panel} from "primereact/panel";
import fallbackImg from "@/assets/images/bclogo.jpg";
import {Link} from "react-router-dom";

/**
 * Recipient Profile Details
 */

export default function AwardView({data}) {

  const {
    type,
    label,
    milestone,
    description,
    vendor,
    image_url
  } = data || {};

  return <Panel className={'mb-2 mt-2'} header={'Award'} toggleable>
    <div className={'container'}>
      <div className={'grid'}>
        <div className={'col-6'}>Award type</div>
        <div className={'col-6'}>{type || '-'}</div>
        <div className={'col-6'}>Milestone</div>
        <div className={'col-6'}>{milestone || '-'}</div>
        <div className={'col-6'}>Label</div>
        <div className={'col-6'}>{label || '-'}</div>
        <div className={'col-12'}>Description</div>
        <div className={'surface-hover col-12'}>{description || ' '}</div>
        <div className={'col-6'}>Vendor</div>
        <div className={'col-6'}>{vendor || '-'}</div>
        <div className={'col-6'}>Image</div>
        <div className={'col-12'}>
          <a
              target={'_blank'}
              href={`${import.meta.env.LSA_APPS_MAIN_SITE_URL}/${image_url}`}
              title={image_url || 'URL n/a'}
          >
            <img
                className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
                src={`${import.meta.env.LSA_APPS_MAIN_SITE_URL}/${image_url}`}
                onError={(e) => (e.target.src = fallbackImg)}
                alt={label}
            />
          </a>
        </div>
      </div>
    </div>
  </Panel>
}
