/*!
 * View Recipient Record
 * File: RecipientView.js
 * Copyright(c) 2023 BC Gov
 * MIT Licensed
 */

import MilestoneData from "@/views/recipients/data/MilestoneData.jsx";
import ProfileData from "@/views/recipients/data/ProfileData.jsx";
import ContactData from "@/views/recipients/data/ContactData.jsx";
import AwardData from "@/views/recipients/data/AwardData.jsx";
import SupervisorData from "@/views/recipients/data/SupervisorData.jsx";
import { Message } from "primereact/message";
import AdminData from "@/views/recipients/data/AdminData";

/**
 * Inherited model component
 */

export default function RecipientView({ data, currentCycle }) {
  const { services, status } = data || {};
  // get current milestone service selection
  const currentService = (services || []).find(
    (srv) => srv.cycle === currentCycle
  );
  const { confirmed } = currentService || {};

  return (
    <div>
      {status === "archived" ? (
        <Message
          className={"mb-3 w-full"}
          severity={"info"}
          text={"Archived Registration"}
        />
      ) : confirmed && status === "validated" ? (
        <Message
          className={"mb-3 w-full"}
          severity={"success"}
          text={"Registration Validated"}
        />
      ) : (
        <Message
          className={"mb-3 w-full"}
          severity={confirmed ? "info" : "warn"}
          text={
            confirmed ? "Registration Confirmed" : "Registration In Progress"
          }
        />
      )}
      <AdminData data={data} />
      <ProfileData data={data} />
      <MilestoneData data={data} currentCycle={currentCycle} />
      <ContactData data={data} />
      <AwardData data={data} currentCycle={currentCycle} />
      <SupervisorData data={data} />
    </div>
  );
}
