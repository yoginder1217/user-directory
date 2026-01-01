"use client";

import { UserProfile } from "@/types/index";

interface UserDetailProps {
  user?: UserProfile;
}

export default function UserDetail({ user }: UserDetailProps) {
  if (!user) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8 text-white">
        <div className="flex items-start gap-6">
          <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
            <img
              src={user.image || `https://via.placeholder.com/150?text=${user.name.charAt(0)}`}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 pt-2">
            <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold capitalize">
                {user.role === "teacher" ? "Professor" : user.role}
              </span>
              <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm">
                {user.department}
              </span>
            </div>
            <p className="text-white/90 text-sm">{user.yearOrPosition}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8 space-y-8">
        {/* Contact Info */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📞</span> Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Email</p>
              <a
                href={`mailto:${user.email}`}
                className="text-blue-600 hover:text-blue-700 font-semibold break-all"
              >
                {user.email}
              </a>
            </div>
            {user.phone && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Phone</p>
                <a
                  href={`tel:${user.phone}`}
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  {user.phone}
                </a>
              </div>
            )}
            {user.location && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Location</p>
                <p className="text-gray-900 font-semibold">{user.location}</p>
              </div>
            )}
          </div>
        </section>

        {/* Summary */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📖</span> About
          </h2>
          <p className="text-gray-700 leading-relaxed">{user.summary}</p>
        </section>

        {/* Skills */}
        {user.skills.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🛠️</span> Skills & Expertise
            </h2>
            <div className="flex flex-wrap gap-3">
              {user.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {user.projects.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🚀</span> Projects ({user.projects.length})
            </h2>
            <ul className="space-y-3">
              {user.projects.map((project, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg"
                >
                  <span className="text-blue-600 font-bold mt-1">→</span>
                  <span className="text-gray-800 font-semibold">{project}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Publications */}
        {user.publications && user.publications.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📚</span> Publications ({user.publications.length})
            </h2>
            <ol className="space-y-3">
              {user.publications.map((pub, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400"
                >
                  <span className="text-orange-600 font-bold text-lg min-w-[2rem]">{idx + 1}.</span>
                  <span className="text-gray-800 font-semibold pt-1">{pub}</span>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>
    </div>
  );
}
