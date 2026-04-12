'use client';

export default function QueryTable({ queries }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Question</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Service</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Answer</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
          </tr>
        </thead>
        <tbody>
          {queries.map((q) => (
            <tr key={q.id} className="border-b hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900">{q.user?.email || 'Anonymous'}</div>
                <div className="text-sm text-gray-500">{q.user?.name}</div>
              </td>
              <td className="px-6 py-4 max-w-md">
                <div className="font-medium text-gray-900">{q.question.substring(0, 100)}{q.question.length > 100 ? '...' : ''}</div>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {q.serviceName || 'General'}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 line-clamp-2">{q.answer}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(q.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {queries.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No queries yet. Users will see their AI questions here!
        </div>
      )}
    </div>
  );
}

