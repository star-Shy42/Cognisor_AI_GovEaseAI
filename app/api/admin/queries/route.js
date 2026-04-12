import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma.js';

export async function GET() {
  try {
    const queries = await prisma.query.findMany({
      include: { 
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(queries);
  } catch (error) {
    console.error('Queries error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

