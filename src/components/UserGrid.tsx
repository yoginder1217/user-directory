"use client";

import { UserProfile } from "@/types/index";
import Image from "next/image";

interface UserGridProps {
  users: UserProfile[];
  onUserSelect: (user: UserProfile) => void;
  selectedUserId?: string;
}

export default function UserGrid({
  users,
  onUserSelect,
  selectedUserId
}: UserGridProps) {
  if (users.length === 0) {
    return null;
  }

  return (
    <>
      {users.map((user) => (
        <div
          key={user.id}
          onClick={() => onUserSelect(user)}
          className={`cursor-pointer rounded-xl border-2 transition-all overflow-hidden hover:shadow-lg ${
            selectedUserId === user.id
              ? "border-blue-600 bg-blue-50 shadow-md"
              : "border-gray-200 bg-white hover:border-blue-400"
          }`}
        >
          <div className="p-6 text-center">
            {/* User Image */}
            <div className="mb-4 flex justify-center">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200">
                <img
                  src={user.image || `https://via.placeholder.com/100?text=${user.name.charAt(0)}`}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* User Info */}
            <h3 className="font-bold text-lg text-gray-900 mb-1">{user.name}</h3>
            <p className="text-xs font-semibold text-blue-600 uppercase mb-2">
              {user.role === "teacher" ? "Professor" : user.role === "staff" ? "Staff" : "Student"}
            </p>
            <p className="text-sm text-gray-600 mb-2">{user.department}</p>
            <p className="text-xs text-gray-500">{user.yearOrPosition}</p>

            {/* Location Badge */}
            {user.location && (
              <div className="mt-3 inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-700">
                📍 {user.location}
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
