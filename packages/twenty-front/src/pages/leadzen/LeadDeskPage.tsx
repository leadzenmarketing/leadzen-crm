import { LeadzenLeadDesk } from '@/leadzen/components/LeadzenLeadDesk';
import { LEADZEN_DESK_REQUIRED_PERSON_FIELDS } from '@/leadzen/constants/LeadzenLeadDesk';
import { objectMetadataItemFamilySelector } from '@/object-metadata/states/objectMetadataItemFamilySelector';
import { PageCardHeader } from '@/ui/layout/page/components/PageCardHeader';
import { PageCardLayout } from '@/ui/layout/page/components/PageCardLayout';
import { PageTitle } from '@/ui/utilities/page-title/components/PageTitle';
import { useAtomFamilySelectorValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilySelectorValue';
import { styled } from '@linaria/react';
import { useState } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { IconPhone } from 'twenty-ui/icon';
import { Button, ButtonGroup } from 'twenty-ui/primitives/input';
import { themeCssVariables, useTheme } from 'twenty-ui/theme';

const StyledScroll = styled.div`
  height: 100%;
  overflow: auto;
  width: 100%;
`;

const StyledMessage = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.md};
  padding: ${themeCssVariables.spacing[6]};
`;

export const LeadDeskPage = () => {
  const theme = useTheme();
  const [showEveryone, setShowEveryone] = useState(false);

  const personObjectMetadataItem = useAtomFamilySelectorValue(
    objectMetadataItemFamilySelector,
    { objectName: 'person', objectNameType: 'singular' },
  );
  const activityObjectMetadataItem = useAtomFamilySelectorValue(
    objectMetadataItemFamilySelector,
    { objectName: 'salesActivity', objectNameType: 'singular' },
  );

  const personFieldNames = new Set(
    personObjectMetadataItem?.fields.map((field) => field.name) ?? [],
  );
  const isSetUp =
    isDefined(personObjectMetadataItem) &&
    isDefined(activityObjectMetadataItem) &&
    LEADZEN_DESK_REQUIRED_PERSON_FIELDS.every((name) =>
      personFieldNames.has(name),
    );

  return (
    <>
      <PageTitle title="Lead Desk" />
      <PageCardLayout
        header={
          <PageCardHeader
            icon={
              <IconPhone size={theme.icon.size.md} stroke={theme.icon.stroke.sm} />
            }
            title="Lead Desk"
            actionButton={
              isSetUp && (
                <ButtonGroup size="sm">
                  <Button
                    variant={showEveryone ? 'outline' : 'soft'}
                    color={showEveryone ? 'neutral' : 'accent'}
                    onClick={() => setShowEveryone(false)}
                  >
                    Mine
                  </Button>
                  <Button
                    variant={showEveryone ? 'soft' : 'outline'}
                    color={showEveryone ? 'accent' : 'neutral'}
                    onClick={() => setShowEveryone(true)}
                  >
                    Everyone
                  </Button>
                </ButtonGroup>
              )
            }
          />
        }
      >
        <StyledScroll>
          {isSetUp && isDefined(personObjectMetadataItem) ? (
            <LeadzenLeadDesk
              personObjectMetadataItem={personObjectMetadataItem}
              showEveryone={showEveryone}
            />
          ) : (
            <StyledMessage>
              Lead Desk isn't set up in this workspace yet. Ask Leadzen to add
              the lead fields and the Activity log.
            </StyledMessage>
          )}
        </StyledScroll>
      </PageCardLayout>
    </>
  );
};
