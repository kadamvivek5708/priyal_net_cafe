import React, { useState } from 'react';
import { X } from 'lucide-react';

export const TagsInput = ({ label, id, value = [], onChange, placeholder, error }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed) {
        // Prevent duplicates if desired, or just add it
        if (!value.includes(trimmed)) {
          onChange([...value, trimmed]);
        }
        setInputValue('');
      }
    }
  };

  const removeTag = (indexToRemove) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      
      <div className="border border-gray-300 rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 p-2 flex flex-wrap gap-2">
        {value.map((tag, index) => (
          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-1.5 inline-flex items-center justify-center text-blue-400 hover:text-blue-600 dark:text-blue-300 dark:hover:text-white focus:outline-none"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        
        <input
          id={id}
          type="text"
          className="flex-1 min-w-[120px] outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400"
          placeholder={value.length === 0 ? placeholder : ""}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">Press Enter to add a tag.</p>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};