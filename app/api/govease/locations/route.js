import { NextResponse } from 'next/server';

import prisma from '../../../../lib/prisma.js';

import haversine from 'haversine-distance'


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat'));
  const lng = parseFloat(searchParams.get('lng'));

  if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
  }

  // Fetch from DB, calc distance, filter/sort
  const offices = await prisma.office.findMany({
   take: 100
  })
  const nearby = offices
    .map(office => ({
      name: office.name,
      address: office.address,
      services: office.services,
      lat: office.lat,
      lng: office.lng,
      distance: haversine({ latitude: lat, longitude: lng }, { latitude: office.lat, longitude: office.lng })/1000
    }))
    .sort((a, b) => a.distance - b.distance)

  return NextResponse.json(nearby);

}
