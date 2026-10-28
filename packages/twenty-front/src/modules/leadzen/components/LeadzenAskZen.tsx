import { LazyMarkdownRenderer } from '@/ai/components/LazyMarkdownRenderer';
import {
  LEADZEN_ASK_ZEN_MAX_CHARS,
  LEADZEN_ASK_ZEN_MAX_TURNS,
  LEADZEN_ASK_ZEN_SUGGESTIONS,
} from '@/leadzen/constants/LeadzenAskZen';
import { type LeadzenAskZenMessage } from '@/leadzen/types/LeadzenAskZenMessage';
import { getLeadzenConnectUrl } from '@/leadzen/utils/getLeadzenConnectUrl';
import { styled } from '@linaria/react';
import { isNonEmptyString } from '@sniptt/guards';
import { type KeyboardEvent, useRef, useState } from 'react';
import { isDefined } from 'twenty-shared/utils';
import { IconSend } from 'twenty-ui/icon';
import { Button, Textarea } from 'twenty-ui/primitives/input';
import { themeCssVariables } from 'twenty-ui/theme';

const StyledChat = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0 auto;
  max-width: 720px;
  width: 100%;
`;

const StyledMessages = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[3]};
  overflow-y: auto;
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledIntro = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  display: flex;
  flex-direction: column;
  font-size: ${themeCssVariables.font.size.md};
  gap: ${themeCssVariables.spacing[3]};
`;

const StyledSuggestions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledUserMessage = styled.div`
  align-self: flex-end;
  background: var(--lz-nav-active-background);
  border-radius: ${themeCssVariables.border.radius.md};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  max-width: 85%;
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  white-space: pre-wrap;
`;

const StyledZenMessage = styled.div`
  align-self: flex-start;
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  max-width: 90%;
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[3]};
`;

const StyledNote = styled.div<{ isError?: boolean }>`
  color: ${({ isError }) =>
    isError
      ? themeCssVariables.font.color.danger
      : themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
`;

const StyledComposer = styled.div`
  border-top: 1px solid ${themeCssVariables.border.color.medium};
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[4]};
`;

const StyledComposerRow = styled.div`
  align-items: flex-end;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledTextareaWrapper = styled.div`
  flex: 1;
`;

type LeadzenAskZenReply = {
  answer?: string;
  error?: string;
  left?: number;
};

export const LeadzenAskZen = () => {
  const [messages, setMessages] = useState<LeadzenAskZenMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [questionsLeft, setQuestionsLeft] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToEnd = () =>
    window.requestAnimationFrame(() =>
      messagesEndRef.current?.scrollIntoView({ block: 'end' }),
    );

  const askZen = async (question: string) => {
    const text = question.trim().slice(0, LEADZEN_ASK_ZEN_MAX_CHARS);
    if (!isNonEmptyString(text) || isSending) {
      return;
    }
    const conversation: LeadzenAskZenMessage[] = [
      ...messages,
      { role: 'user', text },
    ];
    setMessages(conversation);
    setDraft('');
    setErrorMessage(null);
    setIsSending(true);
    scrollToEnd();
    try {
      const response = await fetch(`${getLeadzenConnectUrl()}/help`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversation.slice(-LEADZEN_ASK_ZEN_MAX_TURNS),
        }),
      });
      const reply = (await response.json()) as LeadzenAskZenReply;
      if (!response.ok || !isNonEmptyString(reply.answer)) {
        setErrorMessage(
          reply.error ?? 'Zen can’t answer right now. Try again in a minute.',
        );
        return;
      }
      setMessages([...conversation, { role: 'assistant', text: reply.answer }]);
      setQuestionsLeft(reply.left ?? null);
    } catch {
      setErrorMessage('Zen can’t be reached. Check the connection and try again.');
    } finally {
      setIsSending(false);
      scrollToEnd();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void askZen(draft);
    }
  };

  return (
    <StyledChat>
      <StyledMessages>
        {messages.length === 0 && (
          <StyledIntro>
            Hi! I’m Zen. Ask me how to do anything in Leadzen CRM, in English,
            Kannada, Tamil, Telugu or Hindi.
            <StyledSuggestions>
              {LEADZEN_ASK_ZEN_SUGGESTIONS.map((suggestion) => (
                <Button
                  key={suggestion}
                  size="sm"
                  variant="outline"
                  onClick={() => void askZen(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </StyledSuggestions>
          </StyledIntro>
        )}
        {messages.map((message, index) =>
          message.role === 'user' ? (
            <StyledUserMessage key={index}>{message.text}</StyledUserMessage>
          ) : (
            <StyledZenMessage key={index}>
              <LazyMarkdownRenderer text={message.text} noImage />
            </StyledZenMessage>
          ),
        )}
        {isSending && <StyledNote>Zen is thinking…</StyledNote>}
        {isDefined(errorMessage) && (
          <StyledNote isError>{errorMessage}</StyledNote>
        )}
        <div ref={messagesEndRef} />
      </StyledMessages>
      <StyledComposer>
        <StyledComposerRow>
          <StyledTextareaWrapper>
            <Textarea
              value={draft}
              onValueChange={(value) => setDraft(value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask how to do something…"
              maxLength={LEADZEN_ASK_ZEN_MAX_CHARS}
              autoResize
              maxRows={5}
              rows={1}
            />
          </StyledTextareaWrapper>
          <Button
            color="accent"
            variant="solid"
            startIcon={<IconSend />}
            loading={isSending}
            disabled={!isNonEmptyString(draft.trim())}
            onClick={() => void askZen(draft)}
          >
            Ask
          </Button>
        </StyledComposerRow>
        <StyledNote>
          Zen only knows how the CRM works and can’t see your leads. Don’t type
          customer names or numbers here.
          {isDefined(questionsLeft) && ` ${questionsLeft} questions left today.`}
        </StyledNote>
      </StyledComposer>
    </StyledChat>
  );
};
