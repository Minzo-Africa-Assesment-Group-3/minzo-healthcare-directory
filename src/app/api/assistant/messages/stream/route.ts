import { NextRequest, NextResponse } from "next/server";

import { SESSION_COOKIE } from "@/lib/session";

export const dynamic = "force-dynamic";

interface ConversationMessage {
  content: string;
  role: "assistant" | "user";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isConversationMessage(value: unknown): value is ConversationMessage {
  return (
    isRecord(value) &&
    typeof value.content === "string" &&
    (value.role === "assistant" || value.role === "user")
  );
}

function readHistory(value: unknown): ConversationMessage[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  return value
    .filter(isConversationMessage)
    .filter((message) => message.content.trim().length > 0)
    .slice(-20)
    .map((message) => ({
      content: message.content.trim().slice(0, 5_000),
      role: message.role,
    }));
}

export async function POST(request: NextRequest): Promise<Response> {
  const serviceUrl = process.env.ASSISTANT_URL?.replace(/\/$/, "");
  const serviceKey =
    process.env.ASSISTANT_SERVICE_API_KEY ??
    process.env.ASSITANT_SERVICE_API_KEY;

  if (!serviceUrl || !serviceKey) {
    return NextResponse.json(
      { message: "The chat assistant is not configured." },
      { status: 503 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "A JSON request body is required." },
      { status: 400 },
    );
  }

  if (!isRecord(body) || typeof body.message !== "string") {
    return NextResponse.json(
      { message: "A chat message is required." },
      { status: 400 },
    );
  }

  const message = body.message.trim();

  if (message.length === 0 || message.length > 5_000) {
    return NextResponse.json(
      { message: "Your message must be between 1 and 5,000 characters." },
      { status: 400 },
    );
  }

  const headers = new Headers({
    "Content-Type": "application/json",
    "X-Service-Key": serviceKey,
  });
  const accessToken = request.cookies.get(SESSION_COOKIE)?.value;

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const payload: {
    conversation_id?: string;
    history?: ConversationMessage[];
    message: string;
  } = { message };

  if (
    typeof body.conversationId === "string" &&
    body.conversationId.trim().length > 0
  ) {
    payload.conversation_id = body.conversationId.trim().slice(0, 128);
  }

  const history = readHistory(body.history);

  if (history !== undefined) {
    payload.history = history;
  }

  try {
    const upstreamResponse = await fetch(
      `${serviceUrl}/v1/assistant/messages/stream`,
      {
        body: JSON.stringify(payload),
        cache: "no-store",
        headers,
        method: "POST",
        signal: request.signal,
      },
    );

    if (!upstreamResponse.ok || !upstreamResponse.body) {
      return NextResponse.json(
        { message: "The chat assistant is temporarily unavailable." },
        { status: upstreamResponse.status || 502 },
      );
    }

    return new Response(upstreamResponse.body, {
      headers: {
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "Content-Type": "text/event-stream; charset=utf-8",
        "X-Accel-Buffering": "no",
      },
      status: upstreamResponse.status,
    });
  } catch {
    return NextResponse.json(
      { message: "The chat assistant is temporarily unavailable." },
      { status: 502 },
    );
  }
}
