import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const SeatDetailsEditor = ({ value = [], onChange, error }) => {
  // Ensure there is at least one row to start if empty
  React.useEffect(() => {
    if (value.length === 0) {
      onChange([{ post: '', seats: '' }]);
    }
  }, []);

  const handleAddRow = () => {
    onChange([...value, { post: '', seats: '' }]);
  };

  const handleRemoveRow = (index) => {
    // Prevent removing the last remaining row if you want to enforce at least one
    if (value.length > 1) {
      onChange(value.filter((_, i) => i !== index));
    }
  };

  const handleChange = (index, field, newVal) => {
    const updated = value.map((row, i) => {
      if (i === index) {
        return { ...row, [field]: newVal };
      }
      return row;
    });
    onChange(updated);
  };

  return (
    <div className="w-full space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Seat Details *
      </label>
      
      <div className="overflow-hidden border border-gray-300 dark:border-gray-700 rounded-md">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Post Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-32">Seats</th>
              <th className="px-4 py-2 w-16"></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {value.map((row, index) => (
              <tr key={index}>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    placeholder="e.g. Junior Clerk"
                    className="w-full border-0 p-1 bg-transparent focus:ring-0 text-sm dark:text-white placeholder-gray-400 focus:outline-none"
                    value={row.post}
                    onChange={(e) => handleChange(index, 'post', e.target.value)}
                    required
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full border-0 p-1 bg-transparent focus:ring-0 text-sm dark:text-white placeholder-gray-400 focus:outline-none"
                    value={row.seats}
                    onChange={(e) => handleChange(index, 'seats', e.target.value)}
                    required
                  />
                </td>
                <td className="px-4 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(index)}
                    className="text-red-500 hover:text-red-700 disabled:opacity-30 flex items-center justify-center"
                    disabled={value.length <= 1}
                    title="Remove row"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-t border-gray-200 dark:border-gray-700">
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={handleAddRow} 
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <Plus size={16} className="mr-2" /> Add Row
          </Button>
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};