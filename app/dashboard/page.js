'use client';

import { useState, useEffect } from 'react';
import NearestOffices from '../components/NearestOffices.js';
import { useAuth } from '../providers.js';
import { getServices, submitQuery, fillForm, getLocations } from '../../services/govease.js';
import Link from 'next/link';

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const [services, setServices] = useState([]);
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [formData, setFormData] = useState({});
  const [filledForm, setFilledForm] = useState(null);
  const [formFields, setFormFields] = useState({});
  const [locations, setLocations] = useState([]);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [isNearestModalOpen, setIsNearestModalOpen] = useState(false);

  useEffect(() => {
    fetchServices();
    getUserLocation();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await getServices(token);
      setServices(data || []);
    } catch (err) {
      console.error(err);
      setServices([]);
    }
  };

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLat(pos.coords.latitude.toFixed(7));
        setLng(pos.coords.longitude.toFixed(7));
      },
      err => console.log('Geolocation denied')
    );
  };

  const handleServiceChange = (e) => {
    const serviceName = e.target.value;
    setSelectedService(serviceName);
    setFormData({});
    setFilledForm(null);
    
    const selected = services.find(s => s.name === serviceName);
    if (selected?.formFields) {
      try {
        const fields = typeof selected.formFields === 'string' ? JSON.parse(selected.formFields) : selected.formFields;
        setFormFields(fields);
        // Pre-fill common fields
        setFormData({
          name: '',
          father_name: '',
          ...Object.fromEntries(Object.keys(fields).map(key => [key, '']))
        });
      } catch {
        setFormFields({});
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuery = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await submitQuery(token, query);
      setAnswer(data.answer);
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  const handleFillForm = async (e) => {
    e.preventDefault();
    if (!selectedService || Object.keys(formData).length === 0) return;
    try {
      const data = await fillForm(token, selectedService, formData);
      setFilledForm(data.filledForm);
    } catch (err) {
      alert(err.message);
    }
  };



  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link href="/login" className="bg-blue-600 text-white px-8 py-4 rounded-xl text-xl font-bold hover:bg-blue-700">
          Login to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
          Dashboard - Welcome, {user.name || user.email}
        </h1>
      </header>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Q&A */}
        <div className="bg-white/70 backdrop-blur p-8 rounded-3xl shadow-xl">
          <h2 className="text-2xl font-bold mb-6">🤖 AI Government Assistant</h2>
          <form onSubmit={handleQuery} className="space-y-4">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything e.g. 'How to apply for birth certificate in Dhaka?'"
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 resize-vertical h-32 font-sans"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 shadow-xl hover:shadow-2xl transition-all"
            >
              {loading ? 'AI Thinking...' : 'Get Answer with AI'}
            </button>
          </form>
          {answer && (
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-l-4 border-emerald-500 shadow-lg">
              <h3 className="font-bold text-lg mb-3 text-emerald-900">✅ AI Answer:</h3>
              <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">{answer}</p>
            </div>
          )}
        </div>

        {/* Dynamic Form Fill */}
        <div className="space-y-6">
          <div className="bg-white/70 backdrop-blur p-8 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-bold mb-4">📋 Quick Services</h2>
            <select
              value={selectedService}
              onChange={handleServiceChange}
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 text-lg"
            >
              <option value="">Select Service</option>
              {services.map((s) => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
            {Object.keys(formFields).length > 0 && (
              <p className="text-sm text-green-600 mt-2">Form has {Object.keys(formFields).length} fields ✓</p>
            )}
          </div>

          {selectedService && Object.keys(formFields).length > 0 && (
            <div className="bg-white/70 backdrop-blur p-8 rounded-3xl shadow-xl">
              <h3 className="text-xl font-bold mb-6">✨ Fill Service Form</h3>
              <form onSubmit={handleFillForm} className="space-y-3">
                {Object.entries(formFields).map(([fieldName, fieldType]) => (
                  <div key={fieldName}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {fieldName.replace(/_/g, ' ')}
                    </label>
                    <input
                      name={fieldName}
                      type={fieldType === 'textarea' ? 'textarea' : fieldType}
                      placeholder={`Enter ${fieldName.replace(/_/g, ' ')}`}
                      value={formData[fieldName] || ''}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      rows={fieldType === 'textarea' ? 3 : 1}
                    />
                  </div>
                ))}
                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:from-orange-600 hover:to-red-600 mt-4"
                >
                  🎯 AI Auto Complete Form
                </button>
              </form>
              {filledForm && (
                <div className="mt-6 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border-2 border-orange-200">
                  <h4 className="font-bold text-lg mb-3 text-orange-900">📄 AI Completed Form:</h4>
                  <pre className="bg-white p-4 rounded-xl overflow-auto text-sm border font-mono max-h-96">
                    {JSON.stringify(filledForm, null, 2)}
                  </pre>
                  <p className="text-xs text-orange-600 mt-2 text-center font-medium">
                    ⚠️ Verify AI-generated data before submission
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur p-8 rounded-3xl shadow-xl mt-12 text-center">
        <button
          onClick={() => setIsNearestModalOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-8 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:from-indigo-700 hover:to-purple-700 transition-all text-lg mx-auto"
        >
          📍 Find Nearest Offices
        </button>
      </div>

      {/* Nearest Offices Modal */}
      {isNearestModalOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsNearestModalOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl max-w-6xl max-h-[90vh] w-full overflow-hidden border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold">📍 Nearest Government Offices</h2>
                <button
                  onClick={() => setIsNearestModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold p-2 hover:bg-gray-200 rounded-xl transition-all"
                >
                  ×
                </button>
              </div>
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <NearestOffices 
                  token={token} 
                  className="max-h-full"
                  onClose={() => setIsNearestModalOpen(false)}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

