"use client";

import { UserProfile } from "@/types/index";

interface UserListProps {
  users: UserProfile[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export default function UserList({ users, selectedId, onSelect }: UserListProps) {
  return (
    <section className="mb-4 border-b border-gray-200 pb-4">
      <h2 className="mb-2 text-base font-semibold text-gray-900">
        Directory
      </h2>
      <div className="max-h-64 overflow-auto rounded border border-gray-200 bg-gray-50">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 font-semibold text-gray-700">Name</th>
              <th className="px-3 py-2 font-semibold text-gray-700">Role</th>
              <th className="px-3 py-2 font-semibold text-gray-700">
                Department
              </th>
              <th className="px-3 py-2 font-semibold text-gray-700">
                Year / Position
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className={`cursor-pointer border-t hover:bg-blue-50 ${
                  selectedId === u.id ? "bg-blue-100" : ""
                }`}
                onClick={() => onSelect(u.id)}
              >
                <td className="px-3 py-2 text-blue-800">{u.name}</td>
                <td className="px-3 py-2 capitalize text-gray-800">
                  {u.role}
                </td>
                <td className="px-3 py-2 text-gray-800">
                  {u.department}
                </td>
                <td className="px-3 py-2 text-gray-800">
                  {u.yearOrPosition}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-3 py-4 text-center text-gray-500"
                >
                  No users found. Try a different search term.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
