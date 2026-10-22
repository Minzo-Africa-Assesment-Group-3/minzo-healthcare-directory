"use client";

import { createContext, type ReactNode, useContext } from "react";

import { ChatAssistant } from "./chat-assistant";

interface AssistantContextValue {
  enabled: boolean;
}

const AssistantContext = createContext<AssistantContextValue>({
  enabled: true,
});

export function AssistantProvider({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <AssistantContext.Provider value={{ enabled: true }}>
      {children}
      <ChatAssistant />
    </AssistantContext.Provider>
  );
}

export function useAssistant(): AssistantContextValue {
  return useContext(AssistantContext);
}
