/*!
 * Award Edit fieldset component
 * File: AwardEdit.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Panel } from "primereact/panel";
import { Fieldset } from "primereact/fieldset";
import classNames from "classnames";
import { Dropdown } from "primereact/dropdown";
import { useAPI } from "@/providers/api.provider.jsx";
import fallbackImg from "@/assets/images/bclogo.jpg";
import { Checkbox } from "primereact/checkbox";
import { Editor } from "primereact/editor";
import { InputNumber } from "primereact/inputnumber";
import AddressInput from "@/views/recipients/fieldsets/AddressInput.jsx";
import FieldsetHeader from "@/components/common/FieldsetHeader.jsx";
import CeremonyDetailsInput from "./fieldsets/CeremonyDetailsInput";

/**
 * Model data edit component
 * @returns {JSX.Element}
 */

export default function CeremonyEditBasic() {
  const api = useAPI();
  const { control, getValues } = useFormContext();
  const [complete, setComplete] = useState(false);

  return (
    <>
      {/* <Panel
        className={"mb-3"}
        headerTemplate={FieldsetHeader("Ceremony Address", complete)}
      > */}
      <CeremonyDetailsInput />
      <AddressInput id={"address"} label={"Venue"} />
    </>
  );
}
