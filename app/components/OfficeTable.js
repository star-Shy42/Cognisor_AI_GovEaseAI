'use client';

export default function OfficeTable({ offices, onEdit, onDelete }) {
  const formatServices = (services) => services ? services.join(', ') : 'None';

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Address</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Services</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Location</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {offices.map((o) => (
            <tr key={o.id} className="border-b hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900">{o.name}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{o.address || 'N/A'}</td>
              <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                <div className="line-clamp-2">{formatServices(o.services)}</div>
              </td>
              <td className="px-6 py-4 text-sm font-mono text-gray-600">{o.lat.toFixed(4)}, {o.lng.toFixed(4)}</td>
              <td className="px-6 py-4 text-sm font-medium">
                <button 
                  onClick={() => onEdit(o)}
                  className="text-blue-600 hover:text-blue-900 mr-4 font-medium transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDelete(o.id)}
                  className="text-red-600 hover:text-red-900 font-medium transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {offices.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No offices. Add via form above!
        </div>
      )}
    </div>
  );
}
