import { usePushFocusItemToFocusStack } from '@/ui/utilities/focus/hooks/usePushFocusItemToFocusStack';
import { useRemoveFocusItemFromFocusStackById } from '@/ui/utilities/focus/hooks/useRemoveFocusItemFromFocusStackById';
import { FocusComponentType } from '@/ui/utilities/focus/types/FocusComponentType';
import { useId } from 'react';

// Without this, typing "?" or other shortcut keys in a plain input triggers the CRM's global hotkeys.
export const useLeadzenTypingFocus = () => {
  const focusId = useId();
  const { pushFocusItemToFocusStack } = usePushFocusItemToFocusStack();
  const { removeFocusItemFromFocusStackById } =
    useRemoveFocusItemFromFocusStackById();

  return {
    onFocus: () =>
      pushFocusItemToFocusStack({
        focusId,
        component: { type: FocusComponentType.TEXT_AREA, instanceId: focusId },
        globalHotkeysConfig: {
          enableGlobalHotkeysConflictingWithKeyboard: false,
        },
      }),
    onBlur: () => removeFocusItemFromFocusStackById({ focusId }),
  };
};
