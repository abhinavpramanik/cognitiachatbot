import { GoogleGenAI } from "@google/genai";
import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    const { chatId, prompt } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!chatId || !prompt) {
      return NextResponse.json(
        { success: false, message: "chatId and prompt are required" },
        { status: 400 }
      );
    }

    await connectDB();
    const data = await Chat.findOne({ userId, _id: chatId });

    if (!data) {
      return NextResponse.json(
        { success: false, message: "Chat not found" },
        { status: 404 }
      );
    }

    const userMessage = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
    };

    data.messages.push(userMessage);

    // ✅ Correct Gemini API call
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const aiContent = response?.text || "No response generated.";

    const aiMessage = {
      role: "assistant",
      content: aiContent,
      timestamp: Date.now(),
    };

    data.messages.push(aiMessage);
    await data.save();

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || String(error) },
      { status: 500 }
    );
  }
}
