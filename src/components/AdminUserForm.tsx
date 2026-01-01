"use client";

import { useState } from "react";
import { UserProfile } from "@/types";

interface AdminUserFormProps {
  existingUsers: UserProfile[];
  onSaved: () => void;
}

const emptyUser: UserProfile = {
  id: "",
  name: "",
  email: "",
  role: "student",
  department: "",
  yearOrPosition: "",
  summary: "",
  skills: [],
  projects: [],
  publications: [],
  image: "",
  location: "",
  phone: ""
};

export default function AdminUserForm({ existingUsers, onSaved }: AdminUserFormProps) {
  const [user, setUser] = useState<UserProfile>(emptyUser);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageSource, setImageSource] = useState<"url" | "file">("url");
  const [skills, setSkills] = useState<string>("");
  const [projects, setProjects] = useState<string>("");
  const [publications, setPublications] = useState<string>("");

  const handleSelectExisting = (id: string) => {
    if (!id) {
      // Reset if no selection
      setUser(emptyUser);
      setSelectedUserId("");
      setImageSource("url");
      setSkills("");
      setProjects("");
      setPublications("");
      setMessage(null);
      return;
    }

    const found = existingUsers.find((u) => u.id === id);
    if (found) {
      // Create new object carefully to ensure image is always a string
      const newUser: UserProfile = {
        id: found.id || "",
        name: found.name || "",
        email: found.email || "",
        phone: found.phone || "",
        role: found.role || "student",
        department: found.department || "",
        yearOrPosition: found.yearOrPosition || "",
        summary: found.summary || "",
        skills: found.skills || [],
        projects: found.projects || [],
        publications: found.publications || [],
        image: found.image || "",  // Explicitly ensure string
        location: found.location || "",
      };
      
      setUser(newUser);
      setSelectedUserId(id);
      setImageSource(
        found.image && found.image.startsWith("data:")
          ? "file"
          : "url"
      );
      setSkills(found.skills?.join(", ") || "");
      setProjects(found.projects?.join(", ") || "");
      setPublications(found.publications?.join(", ") || "");
      setMessage(null);
    }
  };

  const handleChange = (field: keyof UserProfile, value: any) => {
    const finalValue = value === null || value === undefined ? "" : value;
    setUser((prev) => ({
      ...prev,
      [field]: finalValue,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setUser((prev) => ({
          ...prev,
          image: dataUrl,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setUser(emptyUser);
    setSelectedUserId("");
    setImageSource("url");
    setSkills("");
    setProjects("");
    setPublications("");
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        ...user,
        id: user.id || `user_${Date.now()}`,
        image: user.image || "",
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
        projects: projects.split(",").map((p) => p.trim()).filter(Boolean),
        publications: publications.split(",").map((p) => p.trim()).filter(Boolean),
      };

      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to save user");
      }

      setMessage("✅ User saved successfully!");
      handleReset();
      onSaved();
    } catch (err) {
      console.error("Error saving user:", err);
      setMessage("❌ Failed to save user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add/Edit User</h2>

      {existingUsers.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Or select an existing user to edit:
          </label>
          <select
            value={selectedUserId}
            onChange={(e) => handleSelectExisting(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a user...</option>
            {existingUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>
      )}

      {message && (
        <div className={`mb-4 p-3 rounded-lg ${message.includes("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={user.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Email *
            </label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={user.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Role *
            </label>
            <select
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={user.role}
              onChange={(e) => handleChange("role", e.target.value)}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="staff">Staff</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Department *
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={user.department}
              onChange={(e) => handleChange("department", e.target.value)}
              placeholder="Computer Science"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Year / Position *
          </label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={user.yearOrPosition}
            onChange={(e) => handleChange("yearOrPosition", e.target.value)}
            placeholder="3rd Year / Senior Lecturer"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Phone
            </label>
            <input
              type="tel"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={user.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Location
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={user.location || ""}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="New York, USA"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Summary / Bio
          </label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={3}
            value={user.summary || ""}
            onChange={(e) => handleChange("summary", e.target.value)}
            placeholder="Brief bio or summary..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Skills (comma-separated)
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Python, JavaScript, React"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Projects (comma-separated)
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={projects}
            onChange={(e) => setProjects(e.target.value)}
            placeholder="E-commerce platform, Blog system"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Publications (comma-separated)
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={publications}
            onChange={(e) => setPublications(e.target.value)}
            placeholder="Research Paper 2024, Journal Article"
          />
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Profile Image
          </label>
          <div className="flex gap-4 mb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="imageSource"
                checked={imageSource === "url"}
                onChange={() => setImageSource("url")}
              />
              <span className="text-sm">URL</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="imageSource"
                checked={imageSource === "file"}
                onChange={() => setImageSource("file")}
              />
              <span className="text-sm">Upload File</span>
            </label>
          </div>

          {imageSource === "file" ? (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <input
              type="url"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={user.image}
              onChange={(e) => handleChange("image", e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          )}

          {user.image && (
            <div className="mt-3">
              <img
                src={user.image}
                alt="Preview"
                className="w-24 h-24 rounded-lg object-cover border border-gray-300"
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold"
          >
            {loading ? "Saving..." : "Save User Profile"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 bg-gray-300 text-gray-900 py-2 rounded-lg hover:bg-gray-400 font-semibold"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}