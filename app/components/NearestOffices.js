'use client';

import { useState } from 'react';
import { getLocations } from '../../services/govease.js';

export default function NearestOffices({ className = '', token, onClose }) {
  const [locations, setLocations] = useState([]);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLat(pos.coords.latitude.toFixed(7));
        setLng(pos.coords.longitude.toFixed(7));
      },
      err => console.log('Geolocation denied')
    );
  };

  const handleLocations = async () => {
    if (!lat || !lng) {
      alert('Enter coordinates or enable location');
      return;
    }
    setLocationLoading(true);
    try {
      const data = await getLocations(token, lat, lng);
      setLocations(data);
    } catch (err) {
      alert(err.message);
    }
    setLocationLoading(false);
  };

  return (
    <div className={`p-0 ${className}`}>
      <div className="bg-white/70 backdrop-blur p-8 rounded-t-3xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6">📍 Nearest Government Offices</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-10 p-1 bg-gray-50 rounded-xl">
        <input
          placeholder="Latitude (23.81)"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          className="p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 font-mono"
        />
        <input
          placeholder="Longitude (90.41)"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          className="p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 font-mono"
        />
        <div className="flex gap-2">
          <button 
            onClick={getUserLocation}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all text-sm"
          >
            📱 My Location
          </button>
          <button 
            onClick={handleLocations}
            disabled={!lat || !lng || locationLoading}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-8 rounded-xl font-bold shadow-xl hover:shadow-2xl disabled:opacity-50 transition-all font-mono text-lg"
          >
            {locationLoading ? 'Searching...' : '🔍 Find Offices'}
          </button>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {locations.map((loc, i) => (
          <div key={i} className="bg-gradient-to-br from-indigo-50 to-blue-50 p-10 rounded-2xl border-2 border-indigo-200 shadow-lg hover:shadow-xl transition-all">
            <h4 className="font-black text-2xl mb-2 text-indigo-900">{loc.name}</h4>
            <p className="text-indigo-700 text-xl font-semibold mb-2">{loc.services.join(', ')}</p>
            <p className="text-lg text-gray-600 mb-3">📏 {(loc.distance).toFixed(1)} km away</p>
            <p className="text-lg text-gray-500 mb-4">{loc.address}</p>
          </div>
        ))}
      </div>
      {!locations.length && lat && lng && (
        <div className="text-center py-12 text-gray-500">
          No nearby offices found. Try different coordinates or add more offices in admin.
        </div>
      )}
      {!lat && !lng && (
        <div className="text-center py-12 text-gray-500">
          Enter coordinates or click My Location to find offices near you.
        </div>
      )}
      </div>
    </div>
  );
}


