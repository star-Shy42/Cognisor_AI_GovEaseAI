'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import "leaflet/dist/leaflet.css"; // Required for map styles
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.MapContainer })), { ssr: false, loading: () => <p>Map loading...</p> });

const TileLayer = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.TileLayer })), { ssr: false });

const Marker = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.Marker })), { ssr: false });

export default function OfficeForm({ form, setForm, editingId, onCancel, onSubmit }) {
  const [position, setPosition] = useState(editingId ? [form.lat || 23.8103, form.lng || 90.4125] : [23.8103, 90.4125]);
  
  useEffect(() => {
    import('leaflet').then((L) => {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
    });
  }, []);
  const [newService, setNewService] = useState('');

  const servicesList = form.services || [];

  const addService = () => {
    if (!newService.trim()) return;
    const newServices = [...servicesList, newService.trim()];
    setForm({ ...form, services: newServices });
    setNewService('');
  };

  const removeService = (index) => {
    const newServices = servicesList.filter((_, i) => i !== index);
    setForm({ ...form, services: newServices });
  };

  // Update form lat/lng when position changes
  const handlePositionChange = useCallback((newPos) => {
    setPosition(newPos);
    setForm({ ...form, lat: newPos[0], lng: newPos[1] });
  }, [form, setForm]);

  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const onClick = (e) => handlePositionChange(e.latlng);
    map.on('click', onClick);
    return () => {
      map.off('click', onClick);
    };
  }, [handlePositionChange]);

  return (
    <form onSubmit={onSubmit} className="bg-white p-6 rounded-2xl shadow-xl mb-8 space-y-6">
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {editingId ? 'Edit Office' : 'New Office'}
        </h2>
        {editingId && (
          <button 
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-xl font-medium transition-all shadow-md"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-800">Office Name *</label>
          <input 
            required
            placeholder="Dhaka City Corporation" 
            value={form.name || ''} 
            onChange={(e) => setForm({...form, name: e.target.value})}
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-800">Address (optional)</label>
          <input 
            placeholder="Gulshan, Dhaka" 
            value={form.address || ''} 
            onChange={(e) => setForm({...form, address: e.target.value})}
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Interactive Map */}
      <div className="col-span-full">
        <label className="block text-xl font-bold mb-4 text-gray-800">📍 Location on Map</label>
        <div className="border-2 border-indigo-200 rounded-2xl overflow-hidden shadow-xl bg-indigo-50 p-4">
          <div style={{ height: "400px", width: "100%" }}>
            <MapContainer center={position} zoom={12} style={{ height: "100%", width: "100%" }} ref={mapRef}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {position && <Marker 
                position={position} 
                draggable 
                eventHandlers={{
                  dragend: (e) => {
                    const newPos = e.target.getLatLng();
                    handlePositionChange([newPos.lat, newPos.lng]);
                  }
                }}
              />}
            </MapContainer>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            💡 Click map or drag marker to set location
          </p>
          <div className="mt-3 p-3 bg-gray-50 rounded-xl font-mono text-sm text-center">
            📊 Current: {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </div>
        </div>
      </div>

      {/* Services */}
      <div>
        <label className="block text-xl font-bold mb-4 text-gray-800">🏛️ Available Services</label>
        <div className="p-6 border-2 border-dashed border-indigo-200 rounded-2xl bg-indigo-50 mb-4">
          <div className="flex gap-3">
            <input 
              placeholder="e.g. Birth Certificate" 
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
              className="flex-1 p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={addService}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
            >
              + Add Service
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {servicesList.map((service, index) => (
            <div key={index} className="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl shadow-sm hover:shadow-md transition-all justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-500 text-white rounded-2xl font-bold flex items-center justify-center mr-4 text-sm shadow-lg">
                  🏛️
                </div>
                <span className="font-semibold text-gray-800 flex-1">{service}</span>
              </div>
              <button
                type="button"
                onClick={() => removeService(index)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-xl transition-all font-bold text-xl shadow-sm hover:shadow-md ml-4"
              >
                ✕
              </button>
            </div>
          ))}
          {servicesList.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-indigo-200 rounded-2xl bg-indigo-50">
              <p className="text-gray-500 font-medium">No services added yet</p>
            </div>
          )}
        </div>
      </div>

      <button 
        type="submit" 
        className="w-full h-14 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white text-xl font-bold rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300"
      >
        {editingId ? '💾 Update Office' : '📍 Create Office'}
      </button>
    </form>
  );
}
