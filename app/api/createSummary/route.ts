import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { todos } = await request.json();
  const response = await openai.createChatCompletion({
    model: "gpt-3-turbo",
    temperature: 0.8,
    n: 1,
    stream: false,
    messages: [
      {
        role: "system",
        content: "Hello, how are you?",
      },
      {
        role: "user",
        content: `I'm good, how are you?${JSON.stringify(todos)}`,
      },
    ],
  });
  const { data } = response;
  return NextResponse.json(data.choices[0].message);
}
