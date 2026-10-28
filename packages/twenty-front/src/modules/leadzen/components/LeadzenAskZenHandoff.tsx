import { LEADZEN_ASK_ZEN_MAX_TURNS } from '@/leadzen/constants/LeadzenAskZen';
import { useLeadzenTypingFocus } from '@/leadzen/hooks/useLeadzenTypingFocus';
import { type LeadzenAskZenMessage } from '@/leadzen/types/LeadzenAskZenMessage';
import { getLeadzenConnectUrl } from '@/leadzen/utils/getLeadzenConnectUrl';
import { styled } from '@linaria/react';
import { isNonEmptyString } from '@sniptt/guards';
import { useState } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { IconSend } from 'twenty-ui/icon';
import { Button, Input, Textarea } from 'twenty-ui/primitives/input';
import { themeCssVariables } from 'twenty-ui/theme';

const StyledCard = styled.div`
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[3]};
`;

const StyledTitle = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.semiBold};
`;

const StyledHint = styled.div<{ isError?: boolean }>`
  color: ${({ isError }) =>
    isError
      ? themeCssVariables.font.color.danger
      : themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
`;

const StyledActions = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  justify-content: flex-end;
`;

type LeadzenAskZenHandoffProps = {
  messages: LeadzenAskZenMessage[];
  onCancel: () => void;
  onSent: () => void;
};

export const LeadzenAskZenHandoff = ({
  messages,
  onCancel,
  onSent,
}: LeadzenAskZenHandoffProps) => {
  const lastQuestion =
    [...messages].reverse().find((message) => message.role === 'user')?.text ??
    '';
  const [message, setMessage] = useState(lastQuestion);
  const [phone, setPhone] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const messageFocus = useLeadzenTypingFocus();
  const phoneFocus = useLeadzenTypingFocus();

  const handleSend = async () => {
    setIsSending(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`${getLeadzenConnectUrl()}/help/human`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          phone,
          page: window.location.href,
          messages: messages.slice(-LEADZEN_ASK_ZEN_MAX_TURNS),
        }),
      });
      const reply = (await response.json()) as { error?: string };
      if (!response.ok) {
        setErrorMessage(reply.error ?? 'Couldn’t send it. Try again.');
        return;
      }
      onSent();
    } catch {
      setErrorMessage('Couldn’t send it. Check the connection and try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <StyledCard>
      <StyledTitle>Talk to the Leadzen team</StyledTitle>
      <StyledHint>
        Tell us what you need. We’ll see your chat with Zen and get back to you.
      </StyledHint>
      <Textarea
        value={message}
        onValueChange={(value) => setMessage(value)}
        onFocus={messageFocus.onFocus}
        onBlur={messageFocus.onBlur}
        placeholder="What do you need help with?"
        maxLength={2000}
        autoResize
        maxRows={6}
        rows={3}
      />
      <Input
        value={phone}
        onValueChange={(value) => setPhone(value)}
        onFocus={phoneFocus.onFocus}
        onBlur={phoneFocus.onBlur}
        placeholder="Your phone for a call back (optional)"
        type="tel"
        maxLength={20}
      />
      {isDefined(errorMessage) && (
        <StyledHint isError>{errorMessage}</StyledHint>
      )}
      <StyledActions>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="sm"
          color="accent"
          variant="solid"
          startIcon={<IconSend />}
          loading={isSending}
          disabled={!isNonEmptyString(message.trim())}
          onClick={() => void handleSend()}
        >
          Send to Leadzen
        </Button>
      </StyledActions>
    </StyledCard>
  );
};
