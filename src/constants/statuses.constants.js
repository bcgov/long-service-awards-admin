export const ceremonyStatuses = {
  assigned: {
    label: "Assigned",
    severity: "info",
    description: "Attendee was assigned to the ceremony.",
  },
  expired: {
    label: "Expired",
    severity: "danger",
    description: "The invitation has expired",
  },
  invited: {
    label: "Invited",
    severity: "primary",
    description: "Attendee was invited to the ceremony.",
  },
  attending: {
    label: "Attending",
    severity: "success",
    description: "Attendee is attending the ceremony.",
  },
  notassigned: {
    label: "Not Assigned",
    severity: "secondary",
    description: "Attendee has not been the ceremony.",
  },
  declined: {
    label: "Declined",
    severity: "danger",
    description: "Recipient declined to attend the ceremony.",
  },
};
