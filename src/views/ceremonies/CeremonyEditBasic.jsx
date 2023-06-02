/*!
 * Ceremony Edit fieldset component
 * File: CeremonyEditBasic.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import AddressInput from "@/views/recipients/fieldsets/AddressInput.jsx";
import CeremonyDetailsInput from "./fieldsets/CeremonyDetailsInput";
import { Fragment } from "react";

/**
 * Model data edit component
 * @returns {JSX.Element}
 */

export default function CeremonyEditBasic() {
  return (
    <Fragment>
      <CeremonyDetailsInput />
      <AddressInput id={"address"} label={"Venue"} />
    </Fragment>
  );
}
