import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma.js';

export async function GET(request) {
  try {
    
    const offices = await prisma.office.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        lat: true,
        lng: true,
        services: true,
        createdAt: true
      }
    });
    return NextResponse.json(offices);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Server error', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    const office = await prisma.office.create({ 
      data: {
        name: data.name,
        address: data.address || null,
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lng),
        services: data.services || []
      }
    });
    return NextResponse.json(office, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request) {
  try {
    const { id, ...data } = await request.json();
    console.log('PUT /api/admin/offices:', id, data);
    
    const office = await prisma.office.update({ 
      where: { id },
      data: {
        name: data.name,
        address: data.address || null,
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lng),
        services: data.services || []
      }
    });
    return NextResponse.json(office);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    
    await prisma.office.delete({ where: { id } });
    return NextResponse.json({ message: 'Office deleted' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
