"use client";

import {
  Bot,
  MessageCircle,
  RotateCcw,
  SendHorizontal,
  Square,
  X,
} from "lucide-react";
import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type ChatRole = "assistant" | "user";

interface ChatMessage {
  content: string;
  id: string;
  isGreeting?: boolean;
  isStreaming?: boolean;
  role: ChatRole;
}

interface StreamEvent {
  data: Record<string, unknown>;
  name: string;
}

const initialMessage: ChatMessage = {
  content:
    "Hello! I can help you find healthcare facilities, services, and public information in Liberia.",
  id: "welcome",
  isGreeting: true,
  role: "assistant",
};

function createMessageId(): string {
  return crypto.randomUUID();
}

function parseSseEvent(value: string): StreamEvent | null {
  const lines = value.split("\n");
  const name = lines
    .find((line) => line.startsWith("event:"))
    ?.slice("event:".length)
    .trim();
  const serializedData = lines
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice("data:".length).trim())
    .join("\n");

  if (!name || !serializedData) {
    return null;
  }

  try {
    const data: unknown = JSON.parse(serializedData);

    if (typeof data !== "object" || data === null) {
      return null;
    }

    return { data: data as Record<string, unknown>, name };
  } catch {
    return null;
  }
}

function getErrorMessage(value: unknown): string {
  if (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof value.message === "string"
  ) {
    return value.message;
  }

  return "I could not answer right now. Please try again.";
}

export function ChatAssistant(): React.JSX.Element {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messageInputRef = useRef<HTMLTextAreaElement | null>(null);
  const streamGenerationRef = useRef(0);
  const typingQueueRef = useRef(Promise.resolve());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, []);

  useEffect(() => {
    const input = messageInputRef.current;

    if (!input) {
      return;
    }

    const maximumHeight = 128;
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, maximumHeight)}px`;
    input.style.overflowY =
      input.scrollHeight > maximumHeight ? "auto" : "hidden";
  }, [input]);

  function resetConversation(): void {
    streamGenerationRef.current += 1;
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setConversationId(null);
    setInput("");
    setIsStreaming(false);
    setMessages([initialMessage]);
  }

  function appendAssistantToken(
    messageId: string,
    text: string,
    generation: number,
  ): void {
    typingQueueRef.current = typingQueueRef.current.then(
      () =>
        new Promise<void>((resolve) => {
          let characterIndex = 0;

          function revealNextCharacters(): void {
            if (streamGenerationRef.current !== generation) {
              resolve();
              return;
            }

            const nextCharacters = text.slice(characterIndex, characterIndex + 1);
            characterIndex += nextCharacters.length;

            setMessages((currentMessages) =>
              currentMessages.map((message) =>
                message.id === messageId
                  ? {
                      ...message,
                      content: `${message.content}${nextCharacters}`,
                    }
                  : message,
              ),
            );

            if (characterIndex >= text.length) {
              resolve();
              return;
            }

            window.setTimeout(revealNextCharacters, 32);
          }

          revealNextCharacters();
        }),
    );
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const content = input.trim();

    if (!content || isStreaming) {
      return;
    }

    const userMessage: ChatMessage = {
      content,
      id: createMessageId(),
      role: "user",
    };
    const assistantMessageId = createMessageId();
    const assistantMessage: ChatMessage = {
      content: "",
      id: assistantMessageId,
      isStreaming: true,
      role: "assistant",
    };
    const streamGeneration = streamGenerationRef.current;
    const history = messages
      .filter((message) => !message.isGreeting)
      .slice(-20)
      .map(({ content: messageContent, role }) => ({
        content: messageContent,
        role,
      }));
    const abortController = new AbortController();

    abortControllerRef.current = abortController;
    setInput("");
    setIsStreaming(true);
    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
      assistantMessage,
    ]);

    try {
      const response = await fetch("/api/assistant/messages/stream", {
        body: JSON.stringify({
          conversationId,
          history,
          message: content,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
        signal: abortController.signal,
      });

      if (!response.ok || !response.body) {
        const error: unknown = await response.json().catch(() => null);
        throw new Error(getErrorMessage(error));
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      function handleEvent(streamEvent: StreamEvent): void {
        if (
          (streamEvent.name === "start" || streamEvent.name === "done") &&
          typeof streamEvent.data.conversationId === "string"
        ) {
          setConversationId(streamEvent.data.conversationId);
        }

        if (
          streamEvent.name === "token" &&
          typeof streamEvent.data.text === "string"
        ) {
          appendAssistantToken(
            assistantMessageId,
            streamEvent.data.text,
            streamGeneration,
          );
        }

        if (
          streamEvent.name === "error" &&
          typeof streamEvent.data.message === "string"
        ) {
          throw new Error(streamEvent.data.message);
        }
      }

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const eventValue of events) {
          const streamEvent = parseSseEvent(eventValue);

          if (streamEvent) {
            handleEvent(streamEvent);
          }
        }
      }

      await typingQueueRef.current;

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === assistantMessageId
            ? { ...message, isStreaming: false }
            : message,
        ),
      );
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : "I could not answer right now. Please try again.";

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === assistantMessageId
            ? { ...message, content: errorMessage, isStreaming: false }
            : message,
        ),
      );
    } finally {
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }

      setIsStreaming(false);
    }
  }

  function stopStreaming(): void {
    streamGenerationRef.current += 1;
    abortControllerRef.current?.abort();
  }

  return (
    <div className="fixed bottom-5 right-4 z-50 sm:bottom-6 sm:right-6">
      {isOpen ? (
        <section
          aria-label="Minzo assistant"
          className="mb-3 flex h-[min(42rem,calc(100dvh-7rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 sm:w-100"
        >
          <header className="flex items-center justify-between bg-[#0C486D] px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-full bg-white/15">
                <Bot className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-sm font-bold">Minzo Assistant</h2>
                <p className="text-xs text-blue-100">Ask about healthcare services</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={resetConversation}
                className="rounded-md p-2 transition-colors hover:bg-white/15"
                aria-label="Start a new conversation"
                title="Start a new conversation"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-md p-2 transition-colors hover:bg-white/15"
                aria-label="Close chat"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${
                    message.role === "user"
                      ? "rounded-br-md bg-[#0C486D] text-white"
                      : `rounded-bl-md border border-slate-200 bg-white transition-colors duration-700 ${
                          message.isStreaming
                            ? "text-sky-700"
                            : "text-slate-700"
                        }`
                  }`}
                >
                  {message.content || (
                    <span className="inline-flex gap-1 py-1" aria-label="Assistant is typing">
                      <span className="size-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                      <span className="size-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                      <span className="size-1.5 animate-bounce rounded-full bg-slate-400" />
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="border-t border-slate-200 bg-white p-3">
            <label htmlFor="assistant-message" className="sr-only">
              Ask Minzo Assistant
            </label>
            <div className="flex items-end gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 focus-within:border-[#0C486D] focus-within:ring-2 focus-within:ring-[#0C486D]/15">
              <textarea
                id="assistant-message"
                ref={messageInputRef}
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                  event.currentTarget.style.height = "auto";
                  event.currentTarget.style.height = `${Math.min(
                    event.currentTarget.scrollHeight,
                    128,
                  )}px`;
                  event.currentTarget.style.overflowY =
                    event.currentTarget.scrollHeight > 128 ? "auto" : "hidden";
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="Ask about a clinic, service, or location..."
                rows={1}
                maxLength={5_000}
                disabled={isStreaming}
                className="min-h-6 flex-1 resize-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
              />
              {isStreaming ? (
                <button
                  type="button"
                  onClick={stopStreaming}
                  className="rounded-lg bg-slate-100 p-2 text-slate-700 transition-colors hover:bg-slate-200"
                  aria-label="Stop generating response"
                >
                  <Square className="size-4 fill-current" aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="rounded-lg bg-[#0C486D] p-2 text-white transition-colors hover:bg-[#0a3b5a] disabled:cursor-not-allowed disabled:opacity-45"
                  aria-label="Send message"
                >
                  <SendHorizontal className="size-4" aria-hidden="true" />
                </button>
              )}
            </div>
            <p className="mt-2 text-center text-[11px] text-slate-500">
              Minzo Assistant can make mistakes. Confirm urgent health information with a provider.
            </p>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="ml-auto flex size-14 items-center justify-center rounded-full bg-[#0C486D] text-white shadow-lg shadow-[#0C486D]/30 transition-transform hover:scale-105 hover:bg-[#0a3b5a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C486D]"
        aria-label={isOpen ? "Close chat" : "Open Minzo Assistant"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="size-6" aria-hidden="true" />
        ) : (
          <MessageCircle className="size-6" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
