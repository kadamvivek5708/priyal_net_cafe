import React, { useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";

export const SeatDetailsEditor = ({ value = [], onChange, error }) => {
  // Ensure at least one row exists
  useEffect(() => {
    if (value.length === 0) {
      onChange([{ post: "", seats: "" }]);
    }
  }, []);

  const addRow = () => {
    onChange([...value, { post: "", seats: "" }]);
  };

  const removeRow = (index) => {
    if (value.length > 1) {
      onChange(value.filter((_, i) => i !== index));
    }
  };

  const updateRow = (index, field, val) => {
    const updated = [...value];
    updated[index][field] = val;
    onChange(updated);
  };

  return (
    <div className="space-y-3 w-full">
      <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">
        जागांचा तपशील *
      </label>

      <div className="space-y-3">
        {value.map((row, index) => (
          <div
            key={index}
            className="
              grid grid-cols-12 gap-3 p-3
              bg-white dark:bg-gray-900 
              border border-gray-200 dark:border-gray-700 
              rounded-lg
            "
          >
            {/* पद नाव */}
            <div className="col-span-12 sm:col-span-6">
              <label className="text-xs text-gray-500 dark:text-gray-400">पद</label>
              <input
                type="text"
                value={row.post}
                onChange={(e) => updateRow(index, "post", e.target.value)}
                placeholder="उदा. जूनियर क्लर्क"
                className="
                  w-full px-3 py-2 border rounded-md 
                  bg-gray-50 dark:bg-gray-800
                  border-gray-300 dark:border-gray-600
                  text-sm dark:text-white
                "
              />
            </div>

            {/* जागा संख्या */}
            <div className="col-span-10 sm:col-span-5">
              <label className="text-xs text-gray-500 dark:text-gray-400">जागा</label>
              <input
                type="number"
                value={row.seats}
                onChange={(e) => updateRow(index, "seats", e.target.value)}
                placeholder="0"
                className="
                  w-full px-3 py-2 border rounded-md 
                  bg-gray-50 dark:bg-gray-800
                  border-gray-300 dark:border-gray-600
                  text-sm dark:text-white
                "
              />
            </div>

            {/* Delete Button – PERFECT POSITIONING */}
            <div
              className="
                col-span-2 flex items-end justify-end 
                sm:col-span-1 sm:flex sm:items-center sm:justify-end
              "
            >
              <button
                type="button"
                disabled={value.length <= 1}
                onClick={() => removeRow(index)}
                className="
                  p-2 rounded-md bg-red-100 text-red-600 
                  hover:bg-red-200 disabled:opacity-40
                  dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50
                "
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Row Button */}
      <div className="pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={addRow}
          className="text-blue-600 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-900/30"
        >
          <Plus size={16} className="mr-2" /> Add Row
        </Button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
