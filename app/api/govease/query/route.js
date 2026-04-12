import { NextResponse } from 'next/server';
import { processQuery } from '../../../../lib/transformers.js';
import prisma from '../../../../lib/prisma.js';

export async function POST(request) {
  try {
    const userId = request.headers.get('x-user-id') || 'anonymous';
    const { question, audio } = await request.json();

    let text = question;
    if (audio) {
      console.log('Audio transcription requested');
      text = 'Transcribed from audio'; // TODO: implement full whisper
    }

    // Match to service
    const serviceMatch = await prisma.govService.findFirst({
      where: {
        name: {
          contains: text.toLowerCase(),
          mode: 'insensitive'
        }
      }
    });

    let answer;
    if (serviceMatch) {
      const context = `Name: ${serviceMatch.name}
Description: ${serviceMatch.description || ''}
Steps: ${JSON.stringify(serviceMatch.steps)}
Documents: ${JSON.stringify(serviceMatch.documents)}`;
      answer = await processQuery(question, context);
    } else {
      answer = await processQuery(question);
    }

    // Save query
    await prisma.query.create({
      data: {
        userId,
        question: text,
        answer,
        serviceName: serviceMatch?.name || null
      }
    });

    return NextResponse.json({ answer, service: serviceMatch?.name });
  } catch (error) {
    console.error('Query error:', error);
    return NextResponse.json({ error: 'Processing error' }, { status: 500 });
  }
}

