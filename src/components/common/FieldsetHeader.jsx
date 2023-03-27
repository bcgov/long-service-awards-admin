/*!
 * Fieldset panel header template
 * File: FieldsetHeader.jsx
 * Copyright(c) 2023 Government of British Columbia
 * Version 2.0
 * MIT Licensed
 */

import {Chip} from "primereact/chip";

function FieldsetHeader(title, complete) {
    return (options) => {
            const toggleIcon = options.collapsed ? 'pi pi-chevron-down' : 'pi pi-chevron-up';
            const className = `${options.className} justify-content-between`;
            const titleClassName = `${options.titleClassName} ml-2`;

            return (
                <div className={className}>
                    <div>
                        <button className={options.togglerClassName} onClick={options.onTogglerClick}>
                            <span className={toggleIcon}></span>
                        </button>
                        <span className={titleClassName}>{title}</span>
                    </div>
                    {
                        complete == null
                            ? <Chip label="Optional" />
                            : complete
                                ? <Chip icon={'pi pi-check'} label="Complete" />
                                : <Chip icon={'pi pi-exclamation-circle'} label="Required" />
                    }
                </div>
            );
        }
}

export default FieldsetHeader;