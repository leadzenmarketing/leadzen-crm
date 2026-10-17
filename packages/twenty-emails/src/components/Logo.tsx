import { type I18n } from '@lingui/core';
import { Img } from 'react-email';
import { LEADZEN_EMAIL_BRANDING } from 'src/constants/LeadzenBranding';

const logoStyle = {
  marginBottom: '40px',
};

type LogoProps = {
  i18n: I18n;
};

export const Logo = ({ i18n }: LogoProps) => {
  return (
    <Img
      src={LEADZEN_EMAIL_BRANDING.logoUrl}
      alt={i18n._('Leadzen CRM logo')}
      width="40"
      height="40"
      style={logoStyle}
    />
  );
};
