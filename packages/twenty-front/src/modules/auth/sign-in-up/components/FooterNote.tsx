import { styled } from '@linaria/react';
import { Trans } from '@lingui/react/macro';

import { useWorkspaceBypass } from '@/auth/sign-in-up/hooks/useWorkspaceBypass';
import { useIsCurrentLocationOnAWorkspace } from '@/domain-manager/hooks/useIsCurrentLocationOnAWorkspace';
import { LEADZEN_BRANDING } from '@/leadzen/constants/LeadzenBranding';
import { ONBOARDING_CONTENT_BLOCK_WIDTH } from '@/onboarding/constants/OnboardingContentBlockWidth';
import { themeCssVariables } from 'twenty-ui/theme';

const StyledCopyContainer = styled.div`
  align-items: center;
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  line-height: 1.4;
  max-width: ${ONBOARDING_CONTENT_BLOCK_WIDTH}px;
  text-align: center;

  & > a {
    color: ${themeCssVariables.font.color.tertiary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const StyledLinksContainer = styled.div`
  align-items: center;
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  flex-wrap: nowrap;
  font-size: ${themeCssVariables.font.size.sm};
  gap: ${themeCssVariables.spacing[2]};
  justify-content: center;
  max-width: 100%;
  text-align: center;
  white-space: nowrap;

  & > a,
  & > button {
    background: none;
    border: none;
    color: ${themeCssVariables.font.color.tertiary};
    cursor: pointer;
    font: inherit;
    padding: 0;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const StyledSeparator = styled.span`
  color: ${themeCssVariables.font.color.tertiary};
`;

type FooterNoteProps = {
  secondaryAgreement?: 'privacyPolicy' | 'dataProcessingAgreement';
};

export const FooterNote = ({
  secondaryAgreement = 'privacyPolicy',
}: FooterNoteProps) => {
  const { isOnAWorkspace } = useIsCurrentLocationOnAWorkspace();

  const { shouldOfferBypass, shouldUseBypass, enableBypass } =
    useWorkspaceBypass();

  if (!isOnAWorkspace) {
    return (
      <StyledCopyContainer>
        <Trans>By using Leadzen CRM, you agree to the</Trans>{' '}
        <a
          href={LEADZEN_BRANDING.termsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Trans>Terms of Service</Trans>
        </a>{' '}
        <Trans>and</Trans>{' '}
        {secondaryAgreement === 'dataProcessingAgreement' ? (
          <a
            href={LEADZEN_BRANDING.privacyUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Trans>Data Processing Agreement</Trans>
          </a>
        ) : (
          <a
            href={LEADZEN_BRANDING.privacyUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Trans>Privacy Policy</Trans>
          </a>
        )}
        .{' '}
        <Trans>Powered by</Trans>{' '}
        <a
          href={LEADZEN_BRANDING.poweredByUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Twenty
        </a>{' '}
        (
        <a
          href={LEADZEN_BRANDING.sourceCodeUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Trans>source code</Trans>
        </a>
        ).
      </StyledCopyContainer>
    );
  }

  return (
    <StyledLinksContainer>
      {shouldOfferBypass && !shouldUseBypass && (
        <>
          <button type="button" onClick={enableBypass}>
            <Trans>Bypass SSO</Trans>
          </button>
          <StyledSeparator>•</StyledSeparator>
        </>
      )}
      <a
        href={LEADZEN_BRANDING.privacyUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Trans>Privacy Policy</Trans>
      </a>
      <StyledSeparator>•</StyledSeparator>
      <a
        href={LEADZEN_BRANDING.termsUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Trans>Terms of Service</Trans>
      </a>
      <StyledSeparator>•</StyledSeparator>
      <a
        href={LEADZEN_BRANDING.poweredByUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Trans>Powered by Twenty</Trans>
      </a>
    </StyledLinksContainer>
  );
};
