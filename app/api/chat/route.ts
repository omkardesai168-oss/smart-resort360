import { NextRequest, NextResponse } from "next/server";
import { AIService } from "@/lib/ai/AIService";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();
    const response = await AIService.chat(messages, context);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ content: "I'm having trouble connecting. Please try again.", isDemo: true }, { status: 500 });
  }
}
