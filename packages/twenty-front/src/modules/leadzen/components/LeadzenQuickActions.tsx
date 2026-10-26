import { LeadzenQuickCreateButton } from '@/leadzen/components/LeadzenQuickCreateButton';
import { useIsNavigationDrawerContentExpanded } from '@/ui/navigation/navigation-drawer/hooks/useIsNavigationDrawerContentExpanded';
import { styled } from '@linaria/react';
import { IconCheckbox, IconTargetArrow, IconUserPlus } from 'twenty-ui/icon';
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

  if (!isExpanded) {
    return null;
  }

  return (
    <StyledContainer>
      <LeadzenQuickCreateButton
        objectNameSingular="person"
        label="New Lead"
        Icon={IconUserPlus}
        isPrimary
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
    </StyledContainer>
  );
};
