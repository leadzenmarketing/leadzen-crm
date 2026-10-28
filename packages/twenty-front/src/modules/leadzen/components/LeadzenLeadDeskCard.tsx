import { LEADZEN_DESK_OUTCOMES } from '@/leadzen/constants/LeadzenLeadDesk';
import { type LeadzenDeskLead } from '@/leadzen/types/LeadzenDeskLead';
import { styled } from '@linaria/react';
import { isNonEmptyString } from '@sniptt/guards';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppPath } from 'twenty-shared/types';
import { getAppPath, isDefined } from 'twenty-shared/utils';
import { IconBrandWhatsapp, IconCheck, IconPhone } from 'twenty-ui/icon';
import { Button } from 'twenty-ui/primitives/input';
import { themeCssVariables } from 'twenty-ui/theme';

const StyledCard = styled.div`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[3]};
`;

const StyledTop = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledName = styled(Link)`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.lg};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  text-decoration: none;
`;

const StyledPill = styled.span<{ isHot?: boolean }>`
  background: ${({ isHot }) =>
    isHot ? 'var(--lz-nav-active-background)' : 'transparent'};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.pill};
  color: ${({ isHot }) =>
    isHot
      ? 'var(--lz-nav-active-color)'
      : themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.xs};
  padding: 2px ${themeCssVariables.spacing[2]};
`;

const StyledDetails = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
`;

const StyledDue = styled.div<{ isOverdue: boolean }>`
  color: ${({ isOverdue }) =>
    isOverdue
      ? themeCssVariables.font.color.danger
      : themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
`;

const StyledContactRow = styled.div`
  display: grid;
  gap: ${themeCssVariables.spacing[2]};
  grid-template-columns: 1fr 1fr;
`;

const StyledOutcomes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledDateLabel = styled.label`
  align-items: center;
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  font-size: ${themeCssVariables.font.size.sm};
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledDateInput = styled.input`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-family: inherit;
  padding: ${themeCssVariables.spacing[1]};
`;

const StyledLogged = styled.div`
  align-items: center;
  color: ${themeCssVariables.color.green};
  display: flex;
  font-size: ${themeCssVariables.font.size.sm};
  gap: ${themeCssVariables.spacing[1]};
`;

const StyledError = styled.div`
  color: ${themeCssVariables.font.color.danger};
  font-size: ${themeCssVariables.font.size.sm};
`;

type LeadzenLeadDeskCardProps = {
  lead: LeadzenDeskLead;
  statusLabel?: string;
  temperatureLabel?: string;
  dueLabel: string;
  isOverdue: boolean;
  onLogOutcome: (
    lead: LeadzenDeskLead,
    outcome: string,
    nextFollowUp: string | null,
  ) => Promise<void>;
};

export const LeadzenLeadDeskCard = ({
  lead,
  statusLabel,
  temperatureLabel,
  dueLabel,
  isOverdue,
  onLogOutcome,
}: LeadzenLeadDeskCardProps) => {
  const [nextFollowUp, setNextFollowUp] = useState('');
  const [savingOutcome, setSavingOutcome] = useState<string | null>(null);
  const [loggedLabel, setLoggedLabel] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fullName =
    [lead.name?.firstName, lead.name?.lastName].filter(isNonEmptyString).join(' ') ||
    'Unnamed lead';
  const phoneNumber = lead.phones?.primaryPhoneNumber ?? '';
  const callingCode = lead.phones?.primaryPhoneCallingCode || '+91';
  const hasPhone = isNonEmptyString(phoneNumber);
  const details = [lead.requirement, lead.city].filter(isNonEmptyString);

  const handleOutcomeClick = async (outcome: string, label: string) => {
    setSavingOutcome(outcome);
    setErrorMessage(null);
    try {
      await onLogOutcome(lead, outcome, nextFollowUp || null);
      setLoggedLabel(label);
      setNextFollowUp('');
    } catch {
      setErrorMessage('Could not save. Check the connection and try again.');
    } finally {
      setSavingOutcome(null);
    }
  };

  return (
    <StyledCard>
      <StyledTop>
        <StyledName
          to={getAppPath(AppPath.RecordShowPage, {
            objectNameSingular: 'person',
            objectRecordId: lead.id,
          })}
        >
          {fullName}
        </StyledName>
        {isDefined(temperatureLabel) && (
          <StyledPill isHot={lead.temperature === 'HOT'}>
            {temperatureLabel}
          </StyledPill>
        )}
        {isDefined(statusLabel) && <StyledPill>{statusLabel}</StyledPill>}
      </StyledTop>
      {details.length > 0 && <StyledDetails>{details.join(' · ')}</StyledDetails>}
      <StyledDue isOverdue={isOverdue}>{dueLabel}</StyledDue>

      {hasPhone && (
        <StyledContactRow>
          <Button
            href={`tel:${callingCode}${phoneNumber}`}
            startIcon={<IconPhone />}
            color="accent"
            variant="solid"
            fullWidth
          >
            Call
          </Button>
          <Button
            href={`https://wa.me/${callingCode.replace('+', '')}${phoneNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<IconBrandWhatsapp />}
            color="success"
            variant="soft"
            fullWidth
          >
            WhatsApp
          </Button>
        </StyledContactRow>
      )}

      <StyledDateLabel>
        Next follow-up (optional)
        <StyledDateInput
          type="date"
          value={nextFollowUp}
          onChange={(event) => setNextFollowUp(event.target.value)}
        />
      </StyledDateLabel>
      <StyledOutcomes>
        {LEADZEN_DESK_OUTCOMES.map(({ value, label }) => (
          <Button
            key={value}
            size="sm"
            variant="outline"
            loading={savingOutcome === value}
            disabled={isDefined(savingOutcome)}
            onClick={() => handleOutcomeClick(value, label)}
          >
            {label}
          </Button>
        ))}
      </StyledOutcomes>
      {isDefined(loggedLabel) && (
        <StyledLogged>
          <IconCheck size={14} />
          Logged: {loggedLabel}
        </StyledLogged>
      )}
      {isDefined(errorMessage) && <StyledError>{errorMessage}</StyledError>}
    </StyledCard>
  );
};
