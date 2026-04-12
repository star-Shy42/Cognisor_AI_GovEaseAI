'use client';

import { useState } from 'react';

export default function FormFieldManager({ formFields, setFormFields }) {
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('string');

  const fieldTypes = ['string', 'number', 'date', 'email', 'phone', 'textarea'];

  let fields = {};
  if (formFields) {
    try {
      if (typeof formFields === 'string') {
        fields = formFields.trim() ? JSON.parse(formFields) : {};
      } else {
        fields = formFields;
      }
    } catch (e) {
      console.warn('Invalid formFields JSON, using empty object');
      fields = {};
    }
  }

  const addField = () => {
    if (!newFieldName.trim()) return;
    setFormFields({ ...fields, [newFieldName.trim()]: newFieldType });
    setNewFieldName('');
    setNewFieldType('string');
  };

  const deleteField = (fieldName) => {
    const updatedFields = { ...fields };
    delete updatedFields[fieldName];
    setFormFields(updatedFields);
  };

  const updateFieldType = (fieldName, type) => {
    setFormFields({ ...fields, [fieldName]: type });
  };

  return (
    <div className="space-y-4">
      <label className="block text-lg font-bold mb-3 text-gray-800">Form Fields</label>
      
      {/* Add New Field */}
      <div className="p-4 border-2 border-dashed border-purple-200 rounded-xl bg-purple-50">
        <div className="flex gap-3 flex-wrap">
          <input 
            placeholder="Field name (e.g. father_name)" 
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
            className="flex-1 min-w-[200px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
          />
          <select 
            value={newFieldType}
            onChange={(e) => setNewFieldType(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
          >
            {fieldTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={addField}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-lg transition-all whitespace-nowrap"
          >
            + Add Field
          </button>
        </div>
      </div>

      {/* Fields List */}
      <div className="space-y-3">
        {Object.entries(fields).length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
            <p className="text-gray-500 font-medium text-lg">No form fields yet. Add fields above for AI auto-fill!</p>
          </div>
        ) : (
          Object.entries(fields).map(([fieldName, fieldType]) => (
            <div key={fieldName} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-purple-600 text-white rounded-xl font-bold flex items-center justify-center text-sm shadow-lg flex-shrink-0">
                  {fieldName.slice(0,2).toUpperCase()}
                </div>
                <div>
                  <span className="font-semibold text-gray-900">{fieldName}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <select 
                  value={fieldType}
                  onChange={(e) => updateFieldType(fieldName, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 bg-white"
                >
                  {fieldTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => deleteField(fieldName)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-xl transition-all font-bold text-xl shadow-sm"
                  title="Delete field"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

