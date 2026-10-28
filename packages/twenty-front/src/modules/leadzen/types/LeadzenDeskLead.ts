export type LeadzenDeskLead = {
  id: string;
  createdAt: string;
  name?: { firstName?: string | null; lastName?: string | null } | null;
  phones?: {
    primaryPhoneNumber?: string | null;
    primaryPhoneCallingCode?: string | null;
  } | null;
  leadStatus?: string | null;
  temperature?: string | null;
  followUpDate?: string | null;
  requirement?: string | null;
  city?: string | null;
};
