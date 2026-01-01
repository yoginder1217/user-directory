"use client";

import { useState, useEffect } from "react";

interface FiltersProps {
  filters: {
    department: string;
    role: string;
    alpha: string;
  };
  onFilterChange: (filters: any) => void;
}

const DEPARTMENTS = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Electronics",
  "Economics",
  "IT Services"
];

const ROLES = ["student", "teacher", "staff"];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Filters({ filters, onFilterChange }: FiltersProps) {
  const [expanded, setExpanded] = useState({
    department: true,
    role: true,
    alpha: true
  });

  const handleDepartmentChange = (dept: string) => {
    onFilterChange({
      ...filters,
      department: filters.department === dept ? "" : dept
    });
  };

  const handleRoleChange = (r: string) => {
    onFilterChange({
      ...filters,
      role: filters.role === r ? "" : r
    });
  };

  const handleAlphaChange = (a: string) => {
    onFilterChange({
      ...filters,
      alpha: filters.alpha === a ? "" : a
    });
  };

  const handleClearAll = () => {
    onFilterChange({
      department: "",
      role: "",
      alpha: ""
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-900">Filters</h3>
        {(filters.department || filters.role || filters.alpha) && (
          <button
            onClick={handleClearAll}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Department Filter */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() =>
            setExpanded({
              ...expanded,
              department: !expanded.department
            })
          }
          className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 font-semibold text-gray-900"
        >
          <span>Department</span>
          <span className={`transform transition-transform ${expanded.department ? "rotate-180" : ""}`}>
            ▼
          </span>
        </button>
        {expanded.department && (
          <div className="p-3 space-y-2 bg-white">
            {DEPARTMENTS.map((dept) => (
              <label key={dept} className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 p-2 rounded">
                <input
                  type="checkbox"
                  checked={filters.department === dept}
                  onChange={() => handleDepartmentChange(dept)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                />
                <span className="text-sm text-gray-700">{dept}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Role Filter */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() =>
            setExpanded({
              ...expanded,
              role: !expanded.role
            })
          }
          className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 font-semibold text-gray-900"
        >
          <span>Role</span>
          <span className={`transform transition-transform ${expanded.role ? "rotate-180" : ""}`}>
            ▼
          </span>
        </button>
        {expanded.role && (
          <div className="p-3 space-y-2 bg-white">
            {ROLES.map((r) => (
              <label key={r} className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 p-2 rounded capitalize">
                <input
                  type="checkbox"
                  checked={filters.role === r}
                  onChange={() => handleRoleChange(r)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                />
                <span className="text-sm text-gray-700">{r}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Alphabetical Filter */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() =>
            setExpanded({
              ...expanded,
              alpha: !expanded.alpha
            })
          }
          className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 font-semibold text-gray-900"
        >
          <span>Alphabetical</span>
          <span className={`transform transition-transform ${expanded.alpha ? "rotate-180" : ""}`}>
            ▼
          </span>
        </button>
        {expanded.alpha && (
          <div className="p-3 grid grid-cols-7 gap-1 bg-white">
            {ALPHABET.map((letter) => (
              <button
                key={letter}
                onClick={() => handleAlphaChange(letter)}
                className={`py-2 px-1 rounded text-xs font-semibold transition-all ${
                  filters.alpha === letter
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
