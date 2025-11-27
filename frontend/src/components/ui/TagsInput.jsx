import React, { useState } from "react";
import { X, Plus } from "lucide-react";

export const TagsInput = ({
  label,
  id,
  value = [],
  onChange,
  placeholder,
  error,
}) => {
  const [inputValue, setInputValue] = useState("");

  // Add a tag
  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (!trimmed) return;

    // Avoid duplicates
    if (!value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }

    setInputValue("");
  };

  // Handle keyboard for desktop
  const handleKeyDown = (e) => {
    if (["Enter",","].includes(e.key)) {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  // Mobile-friendly: Add on Blur
  const handleBlur = () => {
    addTag(inputValue);
  };

  // Paste Handler → supports multiple tags
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");

    const tags = pasted
      .split(/[\s,]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (tags.length > 0) {
      const uniqueTags = Array.from(new Set([...value, ...tags]));
      onChange(uniqueTags);
    }

    setInputValue("");
  };

  // Remove tag
  const removeTag = (indexToRemove) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}

      <div className="border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-800 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500 flex flex-wrap gap-2">
        {/* Existing Tags */}
        {value.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs sm:text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-1 text-blue-500 hover:text-blue-700 dark:text-blue-300"
            >
              <X size={14} />
            </button>
          </span>
        ))}

        {/* Input Field */}
        <input
          id={id}
          type="text"
          className="flex-1 min-w-20 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
          placeholder={value.length === 0 ? placeholder : ""}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onPaste={handlePaste}
        />

        {/* Add Button (Very helpful for mobile) */}
        {inputValue.trim() !== "" && (
          <button
            type="button"
            onClick={() => addTag(inputValue)}
            className="px-2 py-1 bg-blue-600 text-white rounded-md text-xs flex items-center gap-1 active:scale-95"
          >
            <Plus size={14} /> Add
          </button>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-1">
        Enter / Space / Comma / Blur to add a tag.
      </p>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
