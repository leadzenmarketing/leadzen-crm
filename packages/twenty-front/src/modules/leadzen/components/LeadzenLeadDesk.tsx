import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { LeadzenLeadDeskCard } from '@/leadzen/components/LeadzenLeadDeskCard';
import {
  LEADZEN_DESK_OPTIONAL_PERSON_FIELDS,
  LEADZEN_DESK_OUTCOMES,
  LEADZEN_OPEN_LEAD_STATUSES,
} from '@/leadzen/constants/LeadzenLeadDesk';
import { type LeadzenDeskLead } from '@/leadzen/types/LeadzenDeskLead';
import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { styled } from '@linaria/react';
import { isNonEmptyString } from '@sniptt/guards';
import { useMemo } from 'react';
import { type RecordGqlOperationFilter } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { themeCssVariables } from 'twenty-ui/theme';

const StyledDesk = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[6]};
  margin: 0 auto;
  max-width: 720px;
  padding: ${themeCssVariables.spacing[4]};
  width: 100%;
`;

const StyledSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledSectionTitle = styled.h2`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin: 0;
`;

const StyledNote = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
`;

const DAY_IN_MS = 24 * 60 * 60 * 1000;
// Lets Leadzen Connect apply the outcome before the list is reloaded.
const REFETCH_DELAY_MS = 1500;

const toLocalIsoDate = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');

const daysBetween = (fromIsoDate: string, toIsoDate: string) =>
  Math.round((Date.parse(toIsoDate) - Date.parse(fromIsoDate)) / DAY_IN_MS);

const formatAge = (createdAt: string) => {
  const minutes = Math.max(0, Math.round((Date.now() - Date.parse(createdAt)) / 60000));
  if (minutes < 60) {
    return `${minutes} min ago`;
  }
  const hours = Math.round(minutes / 60);
  if (hours < 24) {
    return `${hours} h ago`;
  }
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
};

type LeadzenLeadDeskProps = {
  personObjectMetadataItem: EnrichedObjectMetadataItem;
  showEveryone: boolean;
};

export const LeadzenLeadDesk = ({
  personObjectMetadataItem,
  showEveryone,
}: LeadzenLeadDeskProps) => {
  const currentWorkspaceMember = useAtomStateValue(currentWorkspaceMemberState);
  const today = toLocalIsoDate(new Date());

  const optionLabels = useMemo(() => {
    const labelsByField: Record<string, Record<string, string>> = {};
    for (const field of personObjectMetadataItem.fields) {
      if (field.name === 'leadStatus' || field.name === 'temperature') {
        labelsByField[field.name] = Object.fromEntries(
          (field.options ?? []).map((option) => [option.value, option.label]),
        );
      }
    }
    return labelsByField;
  }, [personObjectMetadataItem]);

  const recordGqlFields = useMemo(() => {
    const fieldNames = new Set(
      personObjectMetadataItem.fields.map((field) => field.name),
    );
    return {
      id: true,
      createdAt: true,
      name: true,
      phones: true,
      leadStatus: true,
      followUpDate: true,
      ...Object.fromEntries(
        LEADZEN_DESK_OPTIONAL_PERSON_FIELDS.filter((name) =>
          fieldNames.has(name),
        ).map((name) => [name, true]),
      ),
    };
  }, [personObjectMetadataItem]);

  const filter: RecordGqlOperationFilter = {
    and: [
      {
        or: [
          { leadStatus: { in: LEADZEN_OPEN_LEAD_STATUSES } },
          { leadStatus: { is: 'NULL' } },
        ],
      },
      ...(showEveryone || !isDefined(currentWorkspaceMember)
        ? []
        : [{ leadOwnerId: { eq: currentWorkspaceMember.id } }]),
    ],
  };

  const { records, loading, refetch } = useFindManyRecords<
    LeadzenDeskLead & { __typename: string }
  >({
    objectNameSingular: 'person',
    filter,
    orderBy: [{ createdAt: 'DescNullsLast' }],
    recordGqlFields,
    limit: 200,
    fetchPolicy: 'network-only',
  });

  const { createOneRecord: createActivity } = useCreateOneRecord({
    objectNameSingular: 'salesActivity',
  });

  const groups = useMemo(() => {
    const overdue: LeadzenDeskLead[] = [];
    const dueToday: LeadzenDeskLead[] = [];
    const fresh: LeadzenDeskLead[] = [];
    let later = 0;
    for (const lead of records) {
      const due = lead.followUpDate?.slice(0, 10);
      if (isNonEmptyString(due) && due < today) {
        overdue.push(lead);
      } else if (due === today) {
        dueToday.push(lead);
      } else if (!isNonEmptyString(lead.leadStatus) || lead.leadStatus === 'NEW_LEAD') {
        fresh.push(lead);
      } else {
        later += 1;
      }
    }
    overdue.sort((a, b) => (a.followUpDate ?? '').localeCompare(b.followUpDate ?? ''));
    dueToday.sort(
      (a, b) => Number(b.temperature === 'HOT') - Number(a.temperature === 'HOT'),
    );
    return { overdue, dueToday, fresh, later };
  }, [records, today]);

  const handleLogOutcome = async (
    lead: LeadzenDeskLead,
    outcome: string,
    nextFollowUp: string | null,
  ) => {
    const outcomeLabel =
      LEADZEN_DESK_OUTCOMES.find((item) => item.value === outcome)?.label ?? outcome;
    await createActivity({
      name: `${outcomeLabel} - ${lead.name?.firstName ?? 'lead'}`,
      activityType: 'CALL',
      outcome,
      leadId: lead.id,
      doneById: currentWorkspaceMember?.id,
      doneAt: new Date().toISOString(),
      nextFollowUp,
    });
    window.setTimeout(() => void refetch(), REFETCH_DELAY_MS);
  };

  const renderCards = (leads: LeadzenDeskLead[], kind: 'overdue' | 'today' | 'new') =>
    leads.map((lead) => {
      const due = lead.followUpDate?.slice(0, 10) ?? '';
      const daysLate = kind === 'overdue' ? daysBetween(due, today) : 0;
      const dueLabel =
        kind === 'overdue'
          ? `Follow-up overdue by ${daysLate} day${daysLate === 1 ? '' : 's'}`
          : kind === 'today'
            ? 'Follow-up due today'
            : `New lead · ${formatAge(lead.createdAt)}`;
      return (
        <LeadzenLeadDeskCard
          key={lead.id}
          lead={lead}
          statusLabel={
            isNonEmptyString(lead.leadStatus)
              ? optionLabels.leadStatus?.[lead.leadStatus]
              : undefined
          }
          temperatureLabel={
            isNonEmptyString(lead.temperature)
              ? optionLabels.temperature?.[lead.temperature]
              : undefined
          }
          dueLabel={dueLabel}
          isOverdue={kind === 'overdue'}
          onLogOutcome={handleLogOutcome}
        />
      );
    });

  if (loading && records.length === 0) {
    return (
      <StyledDesk>
        <StyledNote>Loading your leads…</StyledNote>
      </StyledDesk>
    );
  }

  const sections = [
    { title: 'Overdue follow-ups', leads: groups.overdue, kind: 'overdue' as const },
    { title: 'Due today', leads: groups.dueToday, kind: 'today' as const },
    { title: 'New leads', leads: groups.fresh, kind: 'new' as const },
  ];
  const isEmpty = sections.every((section) => section.leads.length === 0);

  return (
    <StyledDesk>
      {isEmpty && (
        <StyledNote>
          Nothing to do right now. New leads and today's follow-ups show up here.
        </StyledNote>
      )}
      {sections
        .filter((section) => section.leads.length > 0)
        .map((section) => (
          <StyledSection key={section.kind}>
            <StyledSectionTitle>
              {section.title} ({section.leads.length})
            </StyledSectionTitle>
            {renderCards(section.leads, section.kind)}
          </StyledSection>
        ))}
      {groups.later > 0 && (
        <StyledNote>
          {groups.later} more open lead{groups.later === 1 ? '' : 's'} with a later
          follow-up date.
        </StyledNote>
      )}
    </StyledDesk>
  );
};
