import { type I18n } from '@lingui/core';
import { MainText } from 'src/components/MainText';
import { SubTitle } from 'src/components/SubTitle';

type WhatIsTwentyProps = {
  i18n: I18n;
};

export const WhatIsTwenty = ({ i18n }: WhatIsTwentyProps) => {
  return (
    <>
      <SubTitle value={i18n._('What is Leadzen CRM?')} />
      <MainText>
        {i18n._(
          "It's Leadzen Marketing's CRM, built on the open-source Twenty platform, to help businesses turn leads into customers.",
        )}
      </MainText>
    </>
  );
};
