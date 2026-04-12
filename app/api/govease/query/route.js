import { NextResponse } from "next/server";
import { processQuery } from "../../../../lib/transformers.js";
import prisma from "../../../../lib/prisma.js";

export async function POST(request) {
  try {
    const userId = request.headers.get("x-user-id") || "anonymous";
    const { question, audio } = await request.json();

    let text = question;
    if (audio) {
      console.log("Audio transcription requested");
      text = "Transcribed from audio"; // TODO: implement full whisper
    }

    const words = text.split(" ").filter((w) => w.length > 2);

    const services = await prisma.govService.findMany({
      where: {
        OR: words.map((word) => ({
          name: {
            contains: word,
            mode: "insensitive",
          },
        })),
      },
      take: 5,
    });

    const serviceNames = services.map((s) => s.name).join(" | ");

    let context = "";

    if (services.length > 0) {
      context = services
        .map(
          (service) => `
${JSON.stringify(service.steps)}  `,
        )
        .join(". ");
    }

    const cleanText = (text) => {
      return text
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    };

    const answer = cleanText(await processQuery(text, context));

    await prisma.query.create({
      data: {
        userId,
        question: text,
        answer,
        serviceName: serviceNames || null,
      },
    });

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Query error:", error);
    return NextResponse.json({ error: "Processing error" }, { status: 500 });
  }
}
