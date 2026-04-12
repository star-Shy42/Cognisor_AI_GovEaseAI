import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma.js';

export async function GET() {
  try {
    const services = await prisma.govService.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        steps: true,
        documents: true,
        formFields: true
      }
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

