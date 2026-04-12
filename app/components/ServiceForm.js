'use client';

import { useState } from 'react';
import FormFieldManager from './FormFieldManager.js';

export default function ServiceForm({ form, setForm, editingId, onCancel, onSubmit }) {
  const [newStep, setNewStep] = useState('');
  const [newDoc, setNewDoc] = useState('');

  // Clean split and filter for display
  const getCleanList = (value) => {
    if (!value) return [];
    return value.split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0 && s !== '[]' && s !== '');
  };

  const steps = getCleanList(form.steps);
  const documents = getCleanList(form.documents);

  const addStep = () => {
    if (!newStep.trim()) return;
    const currentSteps = getCleanList(form.steps);
    const newStepsValue = currentSteps.length ? `${form.steps || ''}\n${newStep.trim()}` : newStep.trim();
    setForm({ ...form, steps: newStepsValue });
    setNewStep('');
  };

  const removeStep = (index) => {
    const cleanSteps = getCleanList(form.steps);
    if (index < cleanSteps.length) {
      const stepLines = (form.steps || '').split('\n');
      stepLines.splice(index, 1);
      const newValue = stepLines.join('\n').trim();
      setForm({ ...form, steps: newValue || '' });
    }
  };

  const addDoc = () => {
    if (!newDoc.trim()) return;
    const currentDocs = getCleanList(form.documents);
    const newDocsValue = currentDocs.length ? `${form.documents || ''}\n${newDoc.trim()}` : newDoc.trim();
    setForm({ ...form, documents: newDocsValue });
    setNewDoc('');
  };

  const removeDoc = (index) => {
    const cleanDocs = getCleanList(form.documents);
    if (index < cleanDocs.length) {
      const docLines = (form.documents || '').split('\n');
      docLines.splice(index, 1);
      const newValue = docLines.join('\n').trim();
      setForm({ ...form, documents: newValue || '' });
    }
  };

  return (
    <form onSubmit={onSubmit} className="bg-white p-6 rounded-2xl shadow-xl mb-8 space-y-6">
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          {editingId ? 'Edit Service' : 'New Service'}
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

      {/* Name & Description */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-800">Service Name *</label>
          <input 
            required
            placeholder="Birth Certificate Application" 
            value={form.name} 
            onChange={(e) => setForm({...form, name: e.target.value})}
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-800">Description</label>
          <input 
            placeholder="Brief description (optional)" 
            value={form.description} 
            onChange={(e) => setForm({...form, description: e.target.value})}
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Steps */}
      <div>
        <label className="block text-xl font-bold mb-4 text-gray-800">📋 Process Steps</label>
        <div className="p-6 border-2 border-dashed border-emerald-200 rounded-2xl bg-emerald-50 mb-4">
          <div className="flex gap-3">
            <input 
              placeholder="e.g. Visit Union Parishad..." 
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addStep())}
              className="flex-1 p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={addStep}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
            >
              + Add Step
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl shadow-sm hover:shadow-md transition-all justify-between">
              <div className="flex items-center">
                <span className="w-10 h-10 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center mr-4 text-sm shadow-lg">
                  {index + 1}
                </span>
                <span className="font-medium text-gray-800 flex-1">{step}</span>
              </div>
              <button
                type="button"
                onClick={() => removeStep(index)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-xl transition-all font-bold text-xl shadow-sm hover:shadow-md ml-4"
              >
                ✕
              </button>
            </div>
          ))}
          {steps.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-emerald-200 rounded-2xl bg-emerald-50">
              <p className="text-gray-500 font-medium">No steps added yet - add above!</p>
            </div>
          )}
        </div>
      </div>

      {/* Documents */}
      <div>
        <label className="block text-xl font-bold mb-4 text-gray-800">📄 Required Documents</label>
        <div className="p-6 border-2 border-dashed border-orange-200 rounded-2xl bg-orange-50 mb-4">
          <div className="flex gap-3">
            <input 
              placeholder="e.g. NID copy, Birth certificate" 
              value={newDoc}
              onChange={(e) => setNewDoc(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDoc())}
              className="flex-1 p-4 border border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500"
            />
            <button
              type="button"
              onClick={addDoc}
              className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all whitespace-nowrap"
            >
              + Add Doc
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {documents.map((doc, index) => (
            <div key={index} className="flex items-center p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl shadow-sm hover:shadow-md transition-all justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-500 text-white rounded-xl font-bold flex items-center justify-center mr-4 text-sm shadow-lg">
                  📄
                </div>
                <span className="font-semibold text-gray-800 flex-1">{doc}</span>
              </div>
              <button
                type="button"
                onClick={() => removeDoc(index)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-xl transition-all font-bold text-xl shadow-sm hover:shadow-md ml-4"
              >
                ✕
              </button>
            </div>
          ))}
          {documents.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-orange-200 rounded-2xl bg-orange-50">
              <p className="text-gray-500 font-medium">No documents added yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <FormFieldManager 
        formFields={form.formFields || '{}'} 
        setFormFields={(newFields) => setForm({...form, formFields: JSON.stringify(newFields)})}
      />

      <button 
        type="submit" 
        className="w-full h-14 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white text-xl font-bold rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all duration-300"
      >
        {editingId ? '💾 Update Service' : '✨ Create Service'}
      </button>
    </form>
  );
}

