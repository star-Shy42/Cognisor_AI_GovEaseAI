'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../providers.js';
import ServiceForm from '../components/ServiceForm.js';
import ServiceTable from '../components/ServiceTable.js';
import QueryTable from '../components/QueryTable.js';
import { getServices, createService, updateService, deleteService, getQueries } from '../../services/admin.js';

export default function Admin() {
  const { user, logout } = useAuth();
  const [services, setServices] = useState([]);
  const [queries, setQueries] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', steps: '', documents: '', formFields: '{}' });
  const [editingId, setEditingId] = useState(null);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingQueries, setLoadingQueries] = useState(true);
  const [activeTab, setActiveTab] = useState('services'); // 'services' or 'queries'

  useEffect(() => {
    
    if (user) {
      loadServices();
      loadQueries();
    }
  }, [user]);

  const loadServices = async () => {
    try {
      setLoadingServices(true);
      const token = localStorage.getItem('token');
      const data = await getServices(token);
      setServices(data);
    } catch (error) {
      console.error('Load services error:', error);
    } finally {
      setLoadingServices(false);
    }
  };

  const loadQueries = async () => {
    try {
      setLoadingQueries(true);
      const token = localStorage.getItem('token');
      const data = await getQueries(token);
      setQueries(data);
    } catch (error) {
      console.error('Load queries error:', error);
    } finally {
      setLoadingQueries(false);
    }
  };

  const handleEdit = (service) => {
    setForm({
      name: service.name,
      description: service.description || '',
      steps: JSON.stringify(service.steps) || '',
      documents: service.documents.join('\\n') || '',
      formFields: service.formFields || '{}'
    });
    setEditingId(service.id);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this service permanently?')) return;
    try {
      const token = localStorage.getItem('token');
      await deleteService(id, token);
      loadServices();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete service');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingId) {
        await updateService(editingId, form, token);
      } else {
        await createService(form, token);
      }
      loadServices();
      setEditingId(null);
      setForm({ name: '', description: '', steps: '', documents: '', formFields: '{}' });
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save service. Please check form data.');
    }
  };

  if (!user) return <div className="flex items-center justify-center min-h-screen">
    <div className="text-xl text-gray-500">Loading...</div>
  </div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent drop-shadow-lg">
              Admin Dashboard
            </h1>
            <p className="text-xl text-gray-600 mt-2">Manage government services & view AI queries</p>
          </div>
          <button 
            onClick={logout} 
            className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:from-red-600 hover:to-red-700 transition-all transform hover:-translate-y-1"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-2xl shadow-lg p-1 mb-8">
          <button 
            className={`px-8 py-4 font-bold rounded-xl transition-all ${activeTab === 'services' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('services')}
          >
            Services ({services.length})
          </button>
          <button 
            className={`px-8 py-4 font-bold rounded-xl transition-all ${activeTab === 'queries' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('queries')}
          >
            Queries ({queries.length})
          </button>
        </div>

        {activeTab === 'services' && (
          <>
            <ServiceForm 
              form={form} 
              setForm={setForm} 
              editingId={editingId}
              onCancel={() => {
                setEditingId(null);
                setForm({ name: '', description: '', steps: '', documents: '', formFields: '{}' });
              }}
              onSubmit={handleSubmit}
            />
            {loadingServices ? (
              <div className="text-center py-12">Loading services...</div>
            ) : (
              <ServiceTable 
                services={services}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </>
        )}

        {activeTab === 'queries' && (
          <>
            <div className="text-center py-12">
              <button 
                onClick={loadQueries}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl"
                disabled={loadingQueries}
              >
                {loadingQueries ? 'Loading...' : 'Refresh Queries'}
              </button>
            </div>
            {loadingQueries ? (
              <div className="text-center py-12">Loading queries...</div>
            ) : (
              <QueryTable queries={queries} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

