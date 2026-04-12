import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma.js';
const { processQuery } = require('../../../../lib/transformers.js');

export async function POST(request) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { serviceName, basicInfo } = await request.json();
    if (!serviceName || !basicInfo) {
      return NextResponse.json({ error: 'Service name and basic info required' }, { status: 400 });
    }

    // Fetch service formFields
    const service = await prisma.govService.findFirst({
      where: { name: serviceName },
      select: { formFields: true }
    });

    if (!service || !service.formFields) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    let formSchema;
    try {
      formSchema = typeof service.formFields === 'string' ? JSON.parse(service.formFields) : service.formFields;
    } catch {
      return NextResponse.json({ error: 'Invalid form schema' }, { status: 400 });
    }

    // Use QA pipeline for form context
    const fieldsList = Object.keys(formSchema).join(', ');
    const context = `Fill form for ${serviceName}. Schema: ${fieldsList}. Basic: ${JSON.stringify(basicInfo)}`;
    const aiSuggestion = await processQuery('Generate JSON form fill', context);
    
    let filledForm;
    try {
      // Parse AI response as JSON
      const jsonMatch = aiSuggestion.match(/\{[\s\S]*\}/);
      filledForm = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch {
      // Fallback
      filledForm = { ...basicInfo };
      Object.keys(formSchema).forEach(key => {
        if (!(key in filledForm)) {
          filledForm[key] = `AI-filled: ${key}`;
        }
      });
    }

    return NextResponse.json({ filledForm });
  } catch (error) {
    console.error('Form fill error:', error);
    return NextResponse.json({ error: 'Form fill failed' }, { status: 500 });
  }
}

