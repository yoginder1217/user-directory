"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch: (value: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState("");

  return (
    <form
      className="mb-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(value);
      }}
    >
      <div className="relative">
        <input
          type="text"
          placeholder="Search by name, email, or skills..."
          className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            setValue(v);
            if (v.trim() === "") onSearch("");
          }}
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </div>
      </div>
    </form>
  );
}
