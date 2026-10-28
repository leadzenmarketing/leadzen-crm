import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { LeadzenAskZen } from '@/leadzen/components/LeadzenAskZen';
import { RootStackingContextZIndices } from '@/ui/layout/constants/RootStackingContextZIndices';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { styled } from '@linaria/react';
import { useState } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { IconSparkles, IconX } from 'twenty-ui/icon';
import { Button } from 'twenty-ui/primitives/input';
import { themeCssVariables } from 'twenty-ui/theme';
import { useIsMobile } from 'twenty-ui/utilities';

const StyledLauncher = styled.button<{ isMobile: boolean }>`
  align-items: center;
  background: ${themeCssVariables.color.orange};
  border: none;
  border-radius: 999px;
  bottom: ${({ isMobile }) => (isMobile ? '88px' : '16px')};
  box-shadow: ${themeCssVariables.boxShadow.strong};
  color: ${themeCssVariables.font.color.inverted};
  cursor: pointer;
  display: flex;
  font-family: inherit;
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  gap: ${themeCssVariables.spacing[2]};
  left: ${({ isMobile }) => (isMobile ? 'auto' : '16px')};
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
  position: fixed;
  right: ${({ isMobile }) => (isMobile ? '16px' : 'auto')};
  z-index: ${RootStackingContextZIndices.MobileNavigationBar};
`;

const StyledPanel = styled.div<{ isMobile: boolean; isOpen: boolean }>`
  background: ${themeCssVariables.background.primary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${({ isMobile }) =>
    isMobile ? '0' : themeCssVariables.border.radius.md};
  bottom: ${({ isMobile }) => (isMobile ? '0' : '72px')};
  box-shadow: ${themeCssVariables.boxShadow.strong};
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  flex-direction: column;
  height: ${({ isMobile }) =>
    isMobile ? '100dvh' : 'min(620px, calc(100dvh - 96px))'};
  left: ${({ isMobile }) => (isMobile ? '0' : '16px')};
  overflow: hidden;
  position: fixed;
  width: ${({ isMobile }) => (isMobile ? '100vw' : '400px')};
  z-index: ${RootStackingContextZIndices.MobileNavigationBar};
`;

const StyledHeader = styled.div`
  align-items: center;
  border-bottom: 1px solid ${themeCssVariables.border.color.medium};
  display: flex;
  justify-content: space-between;
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
`;

const StyledTitle = styled.div`
  color: ${themeCssVariables.font.color.primary};
  display: flex;
  flex-direction: column;
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.semiBold};
`;

const StyledSubtitle = styled.span`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.regular};
`;

const StyledBody = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
`;

export const LeadzenAskZenWidget = () => {
  const isMobile = useIsMobile();
  const currentWorkspaceMember = useAtomStateValue(currentWorkspaceMemberState);
  const [isOpen, setIsOpen] = useState(false);
  // Mounted on first open and then only hidden, so closing keeps the conversation.
  const [hasOpened, setHasOpened] = useState(false);

  if (!isDefined(currentWorkspaceMember)) {
    return null;
  }

  const toggle = () => {
    setHasOpened(true);
    setIsOpen(!isOpen);
  };

  return (
    <>
      {hasOpened && (
        <StyledPanel isMobile={isMobile} isOpen={isOpen} role="dialog" aria-label="Ask Zen">
          <StyledHeader>
            <StyledTitle>
              Zen
              <StyledSubtitle>Leadzen CRM help</StyledSubtitle>
            </StyledTitle>
            <Button
              size="sm"
              variant="ghost"
              startIcon={<IconX />}
              aria-label="Close"
              onClick={() => setIsOpen(false)}
            />
          </StyledHeader>
          <StyledBody>
            <LeadzenAskZen />
          </StyledBody>
        </StyledPanel>
      )}
      {!(isMobile && isOpen) && (
        <StyledLauncher isMobile={isMobile} onClick={toggle} aria-expanded={isOpen}>
          {isOpen ? <IconX size={18} /> : <IconSparkles size={18} />}
          {isOpen ? 'Close' : 'Ask Zen'}
        </StyledLauncher>
      )}
    </>
  );
};
