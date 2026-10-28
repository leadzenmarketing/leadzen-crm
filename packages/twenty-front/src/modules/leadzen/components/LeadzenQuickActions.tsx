import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { LeadzenQuickCreateButton } from '@/leadzen/components/LeadzenQuickCreateButton';
import { LEADZEN_ASK_ZEN_PATH } from '@/leadzen/constants/LeadzenAskZen';
import { LEADZEN_LEAD_DESK_PATH } from '@/leadzen/constants/LeadzenLeadDesk';
import { objectMetadataItemFamilySelector } from '@/object-metadata/states/objectMetadataItemFamilySelector';
import { useIsNavigationDrawerContentExpanded } from '@/ui/navigation/navigation-drawer/hooks/useIsNavigationDrawerContentExpanded';
import { useAtomFamilySelectorValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilySelectorValue';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { styled } from '@linaria/react';
import { useNavigate } from 'react-router-dom';
import { isDefined } from 'twenty-shared/utils';
import {
  IconCalendarDue,
  IconCheckbox,
  IconPhone,
  IconSparkles,
  IconTargetArrow,
  IconUserPlus,
} from 'twenty-ui/icon';
import { Button } from 'twenty-ui/primitives/input';
import { themeCssVariables } from 'twenty-ui/theme';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  padding-right: ${themeCssVariables.spacing[2]};
`;

const StyledRow = styled.div`
  display: grid;
  gap: ${themeCssVariables.spacing[2]};
  grid-template-columns: 1fr 1fr;
`;

// Plain labels: strings missing from Twenty's compiled Lingui catalogs render as ids.
export const LeadzenQuickActions = () => {
  const isExpanded = useIsNavigationDrawerContentExpanded();
  const currentWorkspaceMember = useAtomStateValue(currentWorkspaceMemberState);
  const navigate = useNavigate();
  const activityObjectMetadataItem = useAtomFamilySelectorValue(
    objectMetadataItemFamilySelector,
    { objectName: 'salesActivity', objectNameType: 'singular' },
  );

  if (!isExpanded) {
    return null;
  }

  return (
    <StyledContainer>
      {isDefined(activityObjectMetadataItem) && (
        <Button
          startIcon={<IconCalendarDue />}
          color="accent"
          variant="outline"
          size="md"
          fullWidth
          onClick={() => navigate(LEADZEN_LEAD_DESK_PATH)}
        >
          Lead Desk
        </Button>
      )}
      <LeadzenQuickCreateButton
        objectNameSingular="person"
        label="New Lead"
        Icon={IconUserPlus}
        isPrimary
      />
      <LeadzenQuickCreateButton
        objectNameSingular="salesActivity"
        label="Log Call / Visit"
        Icon={IconPhone}
        getRecordInput={() => ({
          doneById: currentWorkspaceMember?.id,
          doneAt: new Date().toISOString(),
        })}
      />
      <StyledRow>
        <LeadzenQuickCreateButton
          objectNameSingular="opportunity"
          label="Deal"
          Icon={IconTargetArrow}
        />
        <LeadzenQuickCreateButton
          objectNameSingular="task"
          label="Task"
          Icon={IconCheckbox}
        />
      </StyledRow>
      <Button
        startIcon={<IconSparkles />}
        variant="ghost"
        size="md"
        fullWidth
        onClick={() => navigate(LEADZEN_ASK_ZEN_PATH)}
      >
        Ask Zen (help)
      </Button>
    </StyledContainer>
  );
};
