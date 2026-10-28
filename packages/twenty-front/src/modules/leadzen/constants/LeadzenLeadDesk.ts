// Values match the Leadzen client-setup scripts; Leadzen Connect moves the lead after an outcome.
export const LEADZEN_LEAD_DESK_PATH = '/desk';

export const LEADZEN_OPEN_LEAD_STATUSES = [
  'NEW_LEAD',
  'ATTEMPTED',
  'CONTACTED',
  'CONTACT_LATER',
  'QUALIFIED',
];

export const LEADZEN_DESK_OUTCOMES = [
  { value: 'NO_ANSWER', label: 'No answer' },
  { value: 'CALL_BACK', label: 'Call back' },
  { value: 'CONNECTED', label: 'Connected' },
  { value: 'INTERESTED', label: 'Interested' },
  { value: 'NOT_INTERESTED', label: 'Not interested' },
  { value: 'BOOKED', label: 'Booked' },
] as const;

export const LEADZEN_DESK_REQUIRED_PERSON_FIELDS = [
  'leadStatus',
  'leadOwner',
  'followUpDate',
];

export const LEADZEN_DESK_OPTIONAL_PERSON_FIELDS = [
  'temperature',
  'requirement',
  'city',
];
