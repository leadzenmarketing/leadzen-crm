import { type I18n } from '@lingui/core';
import { Column, Container, Row } from 'react-email';
import { Link } from 'src/components/Link';
import { ShadowText } from 'src/components/ShadowText';
import { LEADZEN_EMAIL_BRANDING } from 'src/constants/LeadzenBranding';

const footerContainerStyle = {
  marginTop: '12px',
};

type FooterProps = {
  i18n: I18n;
};

export const Footer = ({ i18n }: FooterProps) => {
  return (
    <Container style={footerContainerStyle}>
      <Row>
        <Column>
          <ShadowText>
            <Link
              href={LEADZEN_EMAIL_BRANDING.sourceCodeUrl}
              value={i18n._('Leadzen CRM')}
              aria-label={i18n._('Visit the Leadzen CRM repository')}
            />
          </ShadowText>
        </Column>
        <Column>
          <ShadowText>
            <Link
              href={LEADZEN_EMAIL_BRANDING.poweredByUrl}
              value={i18n._('Powered by Twenty')}
              aria-label={i18n._("Visit Twenty's website")}
            />
          </ShadowText>
        </Column>
      </Row>
      <ShadowText>
        <>
          {i18n._('Leadzen Marketing')}
          <br />
          {i18n._('Bengaluru, India')}
        </>
      </ShadowText>
    </Container>
  );
};
