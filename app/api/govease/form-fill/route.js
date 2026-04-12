import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma.js';

// 🔥 Manual mapping function
function mapToSchema(schema, basicInfo) {
  const result = {};

  Object.keys(schema).forEach((key) => {
    result[key] = basicInfo[key] || '';
  });

  return result;
}

export async function POST(request) {
  try {
    const userId = request.headers.get('x-user-id') || 'anonymous';

    const { serviceName, basicInfo } = await request.json();

    if (!serviceName || !basicInfo) {
      return NextResponse.json(
        { error: 'Service name and basic info required' },
        { status: 400 }
      );
    }

    // ✅ Fetch service from DB
    const service = await prisma.govService.findFirst({
      where: { name: serviceName },
      select: {
        formFields: true,
      },
    });

    if (!service || !service.formFields) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    let formSchema;
    try {
      formSchema =
        typeof service.formFields === 'string'
          ? JSON.parse(service.formFields)
          : service.formFields;
    } catch {
      return NextResponse.json(
        { error: 'Invalid form schema' },
        { status: 400 }
      );
    }

    // 🔥 Manual form fill (NO AI)
    const filledForm = mapToSchema(formSchema, basicInfo);

    // ✅ Save to DB
    await prisma.query.create({
      data: {
        userId,
        question: `Manual form fill for ${serviceName}`,
        answer: JSON.stringify(filledForm),
        serviceName,
      },
    });

    return NextResponse.json({
      success: true,
      filledForm,
    });

  } catch (error) {
    console.error('Form fill error:', error);

    return NextResponse.json(
      { error: 'Form fill failed' },
      { status: 500 }
    );
  }
}

// ✅ GET একই থাকবে
export async function GET(request) {
  try {
    const userId = request.headers.get('x-user-id') || 'anonymous';
    const { searchParams } = new URL(request.url);
    const serviceName = searchParams.get('serviceName');

    const queries = await prisma.query.findMany({
      where: {
        userId,
        OR: [
          { question: { contains: 'Manual form fill' } },
          ...(serviceName ? [{ serviceName }] : []),
        ],
      },
      select: {
        id: true,
        createdAt: true,
        serviceName: true,
        answer: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const formFills = queries.map((q) => ({
      ...q,
      filledForm: (() => {
        try {
          return JSON.parse(q.answer || '{}');
        } catch {
          return {};
        }
      })(),
    }));

    return NextResponse.json({ formFills });

  } catch (error) {
    console.error('GET form-fills error:', error);

    return NextResponse.json(
      { error: 'Failed to fetch form fills' },
      { status: 500 }
    );
  }
}