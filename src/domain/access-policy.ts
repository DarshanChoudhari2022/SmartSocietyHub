export function isCommitteeRole(role: string) {
  return ["chairman", "secretary", "treasurer", "COMMITTEE_MEMBER", "CHAIRMAN", "ACCOUNTANT"].includes(role);
}

export function isStaffRole(role: string) {
  return ["guard", "watchman", "SECURITY", "STAFF", "vendor_staff", "facility_manager"].includes(role);
}

export function canManageOccupancy(role: string) {
  return isCommitteeRole(role);
}

export function canViewUnitOccupancy(role: string, relationshipType?: string | null) {
  if (isCommitteeRole(role) || isStaffRole(role)) return true;
  return ["OWNER", "TENANT", "CO_OWNER", "FAMILY_MEMBER"].includes(relationshipType || "");
}

export function canReceiveInvoice(relationshipType: string, billingResponsibility: string) {
  if (billingResponsibility === "OWNER") return ["OWNER", "CO_OWNER"].includes(relationshipType);
  if (billingResponsibility === "TENANT") return relationshipType === "TENANT";
  return ["OWNER", "CO_OWNER", "TENANT"].includes(relationshipType);
}
