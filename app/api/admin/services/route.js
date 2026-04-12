import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma.js';

export async function GET(request) {
  try {
    // Log headers for debug
    console.log('GET /api/admin/services');
    
    const services = await prisma.govService.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        steps: true,
        documents: true,
        formFields: true,
        createdAt: true
      }
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Server error', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    console.log('POST /api/admin/services:', data);
    
    const documentsArray = data.documents ? data.documents.split('\n').filter(d => d.trim()).map(d => d.trim()) : [];
    const service = await prisma.govService.create({ 
      data: {
        name: data.name,
        description: data.description || null,
        steps: data.steps || '',
        documents: documentsArray,
        formFields: data.formFields || '{}'
      }
    });
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
  try {
    const { id, ...data } = await request.json();
    console.log('PUT /api/admin/services:', id, data);
    
    const documentsArray = data.documents ? data.documents.split('\n').filter(d => d.trim()).map(d => d.trim()) : [];
    const service = await prisma.govService.update({ 
      where: { id },
      data: {
        name: data.name,
        description: data.description || null,
        steps: data.steps || '',
        documents: documentsArray,
        formFields: data.formFields || '{}'
      }
    });
    return NextResponse.json(service);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    console.log('DELETE /api/admin/services:', id);
    
    await prisma.govService.delete({ where: { id } });
    return NextResponse.json({ message: 'Service deleted' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
