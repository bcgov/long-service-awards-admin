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

export default function AwardView({data}) {

  const {
    type,
    label,
    milestone,
    description,
    short_code,
    image_url,
    active,
    options,
  } = data || {};

  return <Panel className={'mb-2 mt-2'} header={'Award'} toggleable>
    <div className={'container'}>
      <div className={'grid'}>
        <div className={'col-6'}>Award type</div>
        <div className={'col-6'}>{String(type).toUpperCase() || '-'}</div>
        <div className={'col-6'}>Active</div>
        <div className={'col-6'}>{active ? 'Yes' : 'No'}</div>
        <div className={'col-6'}>Shortcode</div>
        <div className={'col-6'}>{short_code || '-'}</div>
        <div className={'col-6'}>Milestone</div>
        <div className={'col-6'}>{milestone || '-'}</div>
        <div className={'col-6'}>Label</div>
        <div className={'col-6'}>{label || '-'}</div>
        <div className={'col-12'}>Description</div>
        <div className={'surface-hover col-12'}>{parse(description || '')}</div>
        <div className={'col-12'}>Image</div>
        <div className={'col-12'}>
          <a
              target={'_blank'}
              href={image_url}
              title={image_url || 'URL n/a'}
          >
            <img
                className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
                src={image_url || '/'}
                onError={(e) => (e.target.src = fallbackImg)}
                alt={label}
            />
          </a>
        </div>
        <div className={'col-12'}>Options</div>
        <div className={'m-2 col-12'}>{
          (options || []).map(option => {
            return <div className={'grid border-1 m-1'} key={option.id}>
              <div className={'col-6'}>Type</div>
              <div className={'col-6'}>{option.type}</div>
              <div className={'col-6'}>Name</div>
              <div className={'col-6'}>{option.name}</div>
              <div className={'col-6'}>Label</div>
              <div className={'col-6'}>{option.label}</div>
              <div className={'col-6'}>Value</div>
              <div className={'col-6'}>{option.value}</div>
              <div className={'col-6'}>Description</div>
              <div className={'col-6'}>{parse(option.description || '-')}</div>
              <div className={'col-6'}>Customizable</div>
              <div className={'col-6'}>{option.customizable ? 'Yes' : 'No'}</div>
            </div>
          })
        }</div>
      </div>
    </div>
  </Panel>
}
