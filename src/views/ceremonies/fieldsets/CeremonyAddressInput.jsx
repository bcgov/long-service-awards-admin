/*!
 * Contact Information fieldset component
 * File: CeremonyAddressInput.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import { Controller, useFormContext, useWatch } from "react-hook-form";
import classNames from "classnames";
import { matchers } from "@/services/validation.services.js";
import { InputMask } from "primereact/inputmask";
import { Panel } from "primereact/panel";
import AddressInput from "@/views/recipients/fieldsets/AddressInput.jsx";
import { Tag } from "primereact/tag";
import { useEffect, useState } from "react";
import FieldsetHeader from "@/components/common/FieldsetHeader.jsx";

export default function CeremonyAddressInput({ validate }) {
  const { control, getValues } = useFormContext();
  const [complete, setComplete] = useState(false);

  // validate fieldset
  useEffect(() => {
    setComplete(validate(getValues()) || false);
  }, [useWatch()]);

  return (
    <Panel
      collapsed
      toggleable
      className={"mb-3"}
      headerTemplate={FieldsetHeader("Ceremony Address", complete)}
    >
      <AddressInput id={"address"} label={"Venue"} />
    </Panel>
  );
}
