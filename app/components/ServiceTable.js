'use client';

export default function ServiceTable({ services, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Description</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s.id} className="border-b hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">{s.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{s.description}</td>
              <td className="px-6 py-4 text-sm font-medium">
                <button 
                  onClick={() => onEdit(s)}
                  className="text-blue-600 hover:text-blue-900 mr-4 font-medium transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDelete(s.id)}
                  className="text-red-600 hover:text-red-900 font-medium transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

