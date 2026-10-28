import { LeadzenAskZen } from '@/leadzen/components/LeadzenAskZen';
import { PageCardHeader } from '@/ui/layout/page/components/PageCardHeader';
import { PageCardLayout } from '@/ui/layout/page/components/PageCardLayout';
import { PageTitle } from '@/ui/utilities/page-title/components/PageTitle';
import { IconSparkles } from 'twenty-ui/icon';
import { useTheme } from 'twenty-ui/theme';

export const AskZenPage = () => {
  const theme = useTheme();

  return (
    <>
      <PageTitle title="Ask Zen" />
      <PageCardLayout
        header={
          <PageCardHeader
            icon={
              <IconSparkles
                size={theme.icon.size.md}
                stroke={theme.icon.stroke.sm}
              />
            }
            title="Ask Zen"
          />
        }
      >
        <LeadzenAskZen />
      </PageCardLayout>
    </>
  );
};
