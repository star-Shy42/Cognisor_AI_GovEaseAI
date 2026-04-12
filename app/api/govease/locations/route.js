import { NextResponse } from 'next/server';

const MOCK_OFFICES = [
  {
    name: 'Dhaka City Corporation Office',
    services: ['Birth Certificate', 'Death Certificate'],
    distance: 0.12,
    lat: 23.7601,
    lng: 90.3940
  },
  {
    name: 'Union Parishad Gulshan',
    services: ['Birth Certificate', 'NID'],
    distance: 1.8,
    lat: 23.7500,
    lng: 90.4050
  },
  {
    name: 'Election Office Mirpur',
    services: ['NID', 'Voter Card'],
    distance: 3.2,
    lat: 23.8050,
    lng: 90.3670
  },
  {
    name: 'Passport Office Agargaon',
    services: ['Passport'],
    distance: 4.5,
    lat: 23.7630,
    lng: 90.3670
  }
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat'));
  const lng = parseFloat(searchParams.get('lng'));

  if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
  }

  // Simple distance filter (<5km) & sort
  const nearby = MOCK_OFFICES
    .map(office => ({
      ...office,
      distance: haversine(lat, lng, office.lat, office.lng)
    }))
    .filter(office => office.distance < 5)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 6);

  return NextResponse.json(nearby);
}

// Haversine distance (km)
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

